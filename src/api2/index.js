/* eslint no-underscore-dangle: ["error", { "allow": ["_authenticated", "_admin", "_loaded", _uid, "_user", "_db", "_reload", "_userAdditionalInfo"] }] */
/* eslint class-methods-use-this: 0 */

import firebase from 'firebase';
import { fb, googleProvider, userSession } from './firebase';
import utils from './utils';
import { serializeCollection, serialize } from './serializers';
import { deserialize } from './deserializers';

const WAIT_AUTH_TIME = 2000;
const WAIT_DB_TIME = 3500;

let dbRef = null;

class API {
  constructor() {
    this._authenticated = false;
    this._admin = false;
    this._loaded = false;
    this._uid = null;
    this._user = {};
    this._db = {
      artists: {},
      colors: {},
      distributions: {},
      members: {},
      relationships: {},
      songs: {},
      units: {},
      users: {},
      userAdditionalInfo: {
        displayName: null,
        photoURL: null,
      },
    };
    this._reload = {
      artists: true,
      colors: true,
      distributions: true,
      members: true,
      relationships: true,
      songs: true,
      units: true,
      users: true,
    };

    // TO-DO: REMOVE?
    // this.init();
  }

  /**
   * Gets basic information about database
   * @category Getter
   * @returns {Object}
   */
  get state() {
    return {
      isAdmin: this._authenticated ? this._admin : false,
      isAuthenticated: this._authenticated,
      isLoaded: this._loaded,
      user: this._authenticated ? this._user : null,
    };
  }

  /**
   * Creates a reference to the firebase database and updates api loaded status
   * @category Method
   * @returns {Boolean}
   */
  init() {
    this.print('Initializing database...');

    return new Promise(async (resolve, reject) => {
      dbRef = await fb.database();

      if (dbRef) {
        this._loaded = true;

        // Verify if there is an active previous session for the user
        await this.auth();
        return resolve(this.state);
      }

      const errorMessage = 'Failed to load firebase database';
      this.printError(errorMessage);
      return reject(Error(errorMessage));
    });
  }

  /**
   * Verifies if the users is still logged in from a previous session
   * @category Method
   * @returns {Object} user
   */
  auth() {
    this.print('Running auth...');

    return new Promise(async resolve => {
      await utils.wait(WAIT_AUTH_TIME);

      const { user } = userSession;

      if (user.emailVerified) {
        this._authenticated = true;
        this._uid = user.uid;
        this._db.userAdditionalInfo = {
          displayName: user.displayName,
          photoURL: user.photoURL,
        };

        let userResponse = null;

        try {
          userResponse = await this.get(`/users/${user.uid}`);
        } catch (_) {
          userResponse = await this.post(`/users/${user.uid}`);
        }

        this._admin = userResponse.data.attributes.isAdmin;
        this._user = userResponse;
        return resolve(userResponse);
      }
      this._authenticated = false;
      this._uid = null;
      return resolve({});
    });
  }

  async login() {
    this.print('Running login...');

    return new Promise(async (resolve, reject) => {
      if (!this._loaded) {
        try {
          await this.init();
        } catch (err) {
          return reject(Error(err));
        }
      }

      let result;

      try {
        await fb.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        result = await fb.auth().signInWithPopup(googleProvider);
      } catch (error) {
        const errorMessage = `Failed to login: ${error.message}`;
        this.printError(errorMessage);
        return reject(Error(errorMessage));
      }

      try {
        const { user } = result;
        if (user.emailVerified) {
          this._authenticated = true;
          this._uid = user.uid;
          this._db.userAdditionalInfo = {
            displayName: user.displayName,
            photoURL: user.photoURL,
          };

          let userResponse;
          try {
            userResponse = await this.get(`/users/${user.uid}`);
          } catch (_) {
            userResponse = await this.post(`/users/${user.uid}`);
          }

          this._admin = userResponse.data.attributes.isAdmin;
          result = userResponse;
        }
      } catch (error) {
        const errorMessage = `Failed to login: ${error.message}`;
        this.printError(errorMessage);
        return reject(Error(errorMessage));
      }
      return resolve(result);
    });
  }

  async logoff() {
    this.print('Running logout...');

    return new Promise(async (resolve, reject) => {
      if (!this._loaded) {
        try {
          await this.init();
        } catch (err) {
          return reject(Error(err));
        }
      }

      try {
        await fb.auth().signOut();
        this._authenticated = false;
        this._uid = null;
        this._admin = false;
        this._user = {};
      } catch (error) {
        const errorMessage = `Failed to logout: ${error.message}`;
        this.printError(errorMessage);
        return reject(Error(errorMessage));
      }

      return resolve();
    });
  }

  /**
   * Prints warning message in the console
   * @category Internal Method
   * @param {String}message the message string
   * @param {String} path the api path
   * @returns undefined
   */
  print(message, path = '') {
    if (process.env.NODE_ENV !== 'test') console.warn(message, path); // eslint-disable-line
  }

  /**
   * Prints error message in the console
   * @category Internal Method
   * @param {String} errorMessage the error message string
   * @returns undefined
   */
  printError(errorMessage) {
    if (process.env.NODE_ENV !== 'test') console.error(errorMessage); // eslint-disable-line
  }

  /**
   * Build error message depending on the API state
   * @category Internal Method
   * @param {String} action the request action type (GET, POST, PATCH, PUT, DELETE)
   * @param {String} errorMessage the error message string
   * @returns {String} error message
   */
  buildErrorMessage(action = '', errorMessage = '') {
    let message = 'API failed with unkown error';

    if (!this._loaded) {
      message = `Unable to perform ${action} action, database is not ready`;
    } else if (!this._authenticated) {
      message = `Unable to perform ${action} action, you are not logged in`;
    } else if (errorMessage) {
      message = `Unable to perform ${action} action: ${errorMessage}`;
    }
    this.printError(message);
    return message;
  }

  // TO-DO: Add resync database function

  /**
   * Gets data from the database based on a path
   * @category Method
   * @param {String} path the get request path
   * @returns {Promise} response
   */
  async get(path) {
    this.print('Fetching data:', path);

    return new Promise(async (resolve, reject) => {
      /*
       * List of possible get calls:
       * /artists
       * /artists/<id>
       * /colors
       * /members
       * /units/<id>
       * /user/<id>
       */
      let result = null;

      if (!this._loaded) {
        try {
          await this.init();
        } catch (err) {
          return reject(Error(err));
        }
      }

      if (!this._authenticated) {
        try {
          await this.login();
        } catch (err) {
          return reject(Error(err));
        }
      }

      if (!this._loaded || !this._authenticated) {
        await utils.wait(WAIT_DB_TIME);

        if (!this._loaded || !this._authenticated) {
          const errorMessage = this.buildErrorMessage('GET');
          return reject(Error(errorMessage));
        }
      }

      const route = utils.breadcrumble(path);

      switch (route.root) {
        // API/artists
        case 'artists':
          // API/artists/id
          if (route.referenceId) {
            result = await getFunctions.fetchArtist(
              route.referenceId,
              this._db,
              this._reload
            );
          }
          // API/artists
          else {
            result = await getFunctions.fetchArtists(this._db, this._reload);
          }
          break;
        // API/colors
        case 'colors':
          result = await getFunctions.fetchColors(this._db, this._reload);
          break;
        // API/distributions
        case 'distributions':
          if (route.referenceId) {
            result = await getFunctions.fetchDistribution(
              route.referenceId,
              this._db,
              this._reload
            );
          }
          break;
        // API/members
        case 'members':
          result = await getFunctions.fetchMembers(this._db, this._reload);
          break;
        // API/membersongss
        case 'songs':
          result = await getFunctions.fetchSongs(this._db, this._reload);
          break;
        // API/units
        case 'units':
          // API/units/<id>
          if (route.referenceId) {
            result = await getFunctions.fetchUnit(
              route.referenceId,
              this._db,
              this._reload
            );
          }
          break;
        // API/users
        case 'users':
          // API/users/<id>
          if (route.referenceId) {
            result = await getFunctions.fetchUser(
              route.referenceId,
              this._db,
              this._reload
            );
          }
          break;
        default:
          return reject(
            Error(`Unable to perform GET action: path ${path} does not exist`)
          );
      }

      if (!result) {
        return reject(
          Error(`Unable to perform GET action: an unkown error has occured`)
        );
      }

      return resolve(result);
    });
  }

  /**
   * Updates data in the database based on a path
   * @category Method
   * @param {String} path the put request path
   * @returns {Promise} response
   */
  async put(path, body) {
    this.print('Updating data:', path);

    return new Promise(async (resolve, reject) => {
      /*
       * List of possible get calls:
       * /users/<id>/favorite-artists
       * /users/<id>/favorite-members
       * /users/<id>/biases
       */
      let result = {};

      if (!this._loaded || !this._authenticated) {
        await utils.wait(WAIT_DB_TIME);

        if (!this._loaded || !this._authenticated) {
          const errorMessage = this.buildErrorMessage('GET');
          return reject(Error(errorMessage));
        }
      }

      const route = utils.breadcrumble(path);

      switch (route.root) {
        // API/members
        case 'members':
          // API/members/<id>
          if (route.referenceId) {
            result = await putFunctions.updateMember(
              route.referenceId,
              body,
              this._db,
              this._uid
            );
          } else {
            return reject(
              Error(
                `Unable to perform PUT action for member, path ${path} does not exist`
              )
            );
          }
          break;
        // API/users
        case 'users':
          // API/users/<id>/favorite-artists
          if (route.subPath === 'favorite-artists') {
            result = await putFunctions.updateUserFavoriteArtists(
              route.referenceId,
              body,
              this._db,
              this._reload
            );
            // API/users/<id>/favorite-members
          } else if (route.subPath === 'favorite-members') {
            result = await putFunctions.updateUserFavoriteMembers(
              route.referenceId,
              body,
              this._db,
              this._reload
            );
            // API/users/<id>/biases
          } else if (route.subPath === 'biases') {
            result = await putFunctions.updateUserBiases(
              route.referenceId,
              body,
              this._db,
              this._reload
            );
          } else {
            return reject(
              Error(
                `Unable to perform PUT action for user, path ${path} does not exist`
              )
            );
          }
          break;
        default:
          return reject(
            Error(`Unable to perform PUT action, path ${path} does not exist`)
          );
      }

      // TO-DO: Catch errors in result and reject

      return resolve(result);
    });
  }
}

const getFunctions = {
  // Fetches list of artists
  fetchArtists: async (db, reload) => {
    if (reload.artists === true) {
      let response = {};
      await dbRef.ref(`/artists`).once('value', snapshot => {
        response = snapshot.val();
      });
      db.artists = response;
      reload.artists = false;
    }
    return serializeCollection(db.artists, 'artist', true, 'name');
  },
  // Fetches a single artist
  fetchArtist: async (id, db, reload) => {
    let response = {};
    if (db.artists[id] === undefined || reload.artists === true) {
      await dbRef.ref(`/artists/${id}`).once('value', snapshot => {
        response = snapshot.val();
      });
      db.artists[id] = response;
    }

    const unitIds = response.unitIds || db.artists[id].unitIds || [];
    let units;
    if (unitIds.length > 0) {
      units = await getFunctions.fetchUnitsSet(unitIds, db, reload);
    }

    return serialize(db.artists[id], id, 'artist', units);
  },
  // Fetches list of colors
  fetchColors: async (db, reload) => {
    if (reload.colors === true) {
      let response = {};
      await dbRef.ref(`/colors`).once('value', snapshot => {
        response = snapshot.val();
      });
      db.colors = response;
      reload.colors = false;
    }
    return serializeCollection(db.colors, 'color', true);
  },
  // Fetches a single distribution
  fetchDistribution: async (id, db, reload) => {
    let response = {};
    if (db.distributions[id] === undefined || reload.distributions === true) {
      await dbRef.ref(`/distributions/${id}`).once('value', snapshot => {
        response = snapshot.val();
      });
      db.distributions[id] = response;
    }

    // Get song
    const song = await getFunctions.fetchSong(response.songId, db, reload);

    return serialize(db.distributions[id], id, 'distribution', song);
  },
  // Fetches set of distributions (used by /unit)
  fetchDistributionsSet: async (ids, db, reload) => {
    const responses = await ids.map(id => {
      if (db.distributions[id] === undefined || reload.distributions === true) {
        return new Promise(async (resolve, reject) => {
          try {
            await dbRef.ref(`/distributions/${id}`).once('value', snapshot => {
              const response = snapshot.val();
              db.distributions[id] = response;
            });
          } catch (error) {
            return reject(error);
          }
          return resolve({ ...db.distributions[id], id });
        });
      }
      return { ...db.distributions[id], id };
    });

    return Promise.all(responses);
  },
  // Fetches list of members
  fetchMembers: async (db, reload) => {
    if (reload.members === true) {
      let response = {};
      await dbRef.ref(`/members`).once('value', snapshot => {
        response = snapshot.val();
      });
      db.members = response;
      reload.members = false;
    }
    return serializeCollection(db.members, 'member', true, 'name');
  },
  // Fetches set of members (used by /unit)
  fetchMembersSet: async (ids, db, reload) => {
    const responses = await ids.map(id => {
      if (db.members[id] === undefined || reload.members === true) {
        return new Promise(async (resolve, reject) => {
          try {
            await dbRef.ref(`/members/${id}`).once('value', snapshot => {
              const response = snapshot.val();
              db.members[id] = response;
            });
          } catch (error) {
            return reject(error);
          }
          return resolve({ ...db.members[id], id });
        });
      }
      return { ...db.members[id], id };
    });

    return Promise.all(responses);
  },
  // Fetches a single song
  fetchSong: async (id, db, reload) => {
    if (db.songs[id] === undefined || reload.songs === true) {
      let response = {};
      await dbRef.ref(`/songs/${id}`).once('value', snapshot => {
        response = snapshot.val();
      });
      db.songs[id] = response;
    }

    return serialize(db.songs[id], id, 'song');
  },
  // Fetches list of songs
  fetchSongs: async (db, reload) => {
    if (reload.songs === true) {
      let response = {};
      await dbRef.ref(`/songs`).once('value', snapshot => {
        response = snapshot.val();
      });
      db.songs = response;
      reload.songs = false;
    }
    return serializeCollection(db.songs, 'song', true, 'title');
  },
  // Fetches set of units (used by /artist)
  fetchUnitsSet: async (ids, db, reload) => {
    const responses = await ids.map(id => {
      if (db.units[id] === undefined || reload.units === true) {
        return new Promise(async (resolve, reject) => {
          try {
            await dbRef.ref(`/units/${id}`).once('value', snapshot => {
              const response = snapshot.val();
              db.units[id] = response;
            });
          } catch (error) {
            return reject(error);
          }
          return resolve({ ...db.units[id], id });
        });
      }
      return { ...db.units[id], id };
    });

    return Promise.all(responses);
  },
  // Fetches a single unit
  fetchUnit: async (id, db, reload) => {
    if (db.units[id] === undefined || reload.units === true) {
      let response;
      await dbRef.ref(`/units/${id}`).once('value', snapshot => {
        response = snapshot.val();
      });
      db.units[id] = response;
    }

    const unit = db.units[id];

    const additionalInformation = {};

    const { artistId, members, distributionIds } = unit;

    // Get artist name
    if (artistId) {
      let artistResponse;
      if (db.artists[artistId] === undefined || reload.artists === true) {
        await dbRef.ref(`/artists/${artistId}`).once('value', snapshot => {
          artistResponse = snapshot.val();
        });
        db.artists[artistId] = artistResponse;
      }
      additionalInformation.artist = db.artists[artistId];
    }

    // Get members
    if (members) {
      const membersIds = utils.getMembersIdsFromUnit(members);
      if (membersIds.length > 0) {
        additionalInformation.members = await getFunctions.fetchMembersSet(
          membersIds,
          db,
          reload
        );
      }
    }

    // Get distriutions
    if (distributionIds && distributionIds.length > 0) {
      additionalInformation.distributions = await getFunctions.fetchDistributionsSet(
        distributionIds,
        db,
        reload
      );
    }

    return serialize(db.units[id], id, 'unit', additionalInformation);
  },
  // Fetches a single user
  fetchUser: async (id, db, reload) => {
    if (db.users[id] === undefined || reload.users === true) {
      let response = {};
      await dbRef.ref(`/users/${id}`).once('value', snapshot => {
        response = snapshot.val();
      });
      db.users[id] = response;
      reload.users = false;
    }
    return serialize(db.users[id], id, 'user', db.userAdditionalInfo);
  },
};

const putFunctions = {
  // Update Member
  updateMember: async (id, body, db, uid) => {
    const key = id;
    const deserializedBody = deserialize(body, 'member', 'put', uid);
    await dbRef.ref(`/members/${key}`).set(deserializedBody, error => {
      if (error) {
        const message = `Failed to update Member ${key}: ${JSON.stringify(
          body
        )}`;
        throw new Error(`${message}: ${error}`);
      }
    });
    // // Replace member in the DB
    db.members[id] = deserializedBody;
    return getFunctions.fetchMembers(db, false);
  },
  // Update user biases
  updateUserBiases: async (id, body, db, reload) => {
    const key = id;
    const deserializedBody = deserialize(body, 'user', 'put', 'biases');
    await dbRef.ref(`/users/${key}/biases`).set(deserializedBody, error => {
      reload.users = true;
      if (error) {
        const message = `Failed to update User's Biases ${key}: ${JSON.stringify(
          body
        )}`;
        throw new Error(`${message}: ${error}`);
      }
    });
    return getFunctions.fetchUser(id, db, reload);
  },
  // Update user favorite artists
  updateUserFavoriteArtists: async (id, body, db, reload) => {
    const key = id;
    const extendedBody = { ...db.users[id].favoriteArtists, ...body };
    const deserializedBody = deserialize(
      extendedBody,
      'user',
      'put',
      'favoriteArtists'
    );
    await dbRef
      .ref(`/users/${key}/favoriteArtists`)
      .set(deserializedBody, error => {
        reload.users = true;
        if (error) {
          const message = `Failed to update User's Favorite Artists ${key}: ${JSON.stringify(
            body
          )}`;
          throw new Error(`${message}: ${error}`);
        }
      });
    return getFunctions.fetchUser(id, db, reload);
  },
  // Update user favorite members
  updateUserFavoriteMembers: async (id, body, db, reload) => {
    const key = id;
    const extendedBody = { ...db.users[id].favoriteMembers, ...body };
    const deserializedBody = deserialize(
      extendedBody,
      'user',
      'put',
      'favoriteMembers'
    );
    await dbRef
      .ref(`/users/${key}/favoriteMembers`)
      .set(deserializedBody, error => {
        reload.users = true;
        if (error) {
          const message = `Failed to update User's Favorite Members ${key}: ${JSON.stringify(
            body
          )}`;
          throw new Error(`${message}: ${error}`);
        }
      });
    return getFunctions.fetchUser(id, db, reload);
  },
};

export default new API();
