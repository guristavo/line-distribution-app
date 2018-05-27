import _ from 'lodash';

import API from '../api';

import {
  copyToClipboard,
  getAlternativeColor,
  getLatestId,
  getTrueKeys,
} from '../utils';

/* ------------------   ACTIONS   ------------------ */

const SET_TAB = 'SET_TAB';
const SET_IS_VALID = 'SET_IS_VALID';
const SET_MESSAGE = 'SET_MESSAGE';
const SET_VALIDATION = 'SET_VALIDATION';

const SET_TEMP_INPUT = 'SET_TEMP_INPUT';
const SET_LOADED_ARTIST = 'SET_LOADED_ARTIST';
const SET_NEW_ARTIST_NAME = 'SET_NEW_ARTIST_NAME';
const SET_NEW_ARTIST_OTHER_NAMES = 'SET_NEW_ARTIST_OTHER_NAMES';
const SET_NEW_ARTIST_GENRE = 'SET_NEW_ARTIST_GENRE';
const SET_NEW_ARTIST_UNITS = 'SET_NEW_ARTIST_UNITS';
const SET_LOADED_UNIT = 'SET_LOADED_UNIT';
const SET_NEW_UNIT_NAME = 'SET_NEW_UNIT_NAME';
const SET_NEW_UNIT_DEBUT_YEAR = 'SET_NEW_UNIT_DEBUT_YEAR';
const SET_NEW_UNIT_OFFICIAL = 'SET_NEW_UNIT_OFFICIAL';
const SET_NEW_UNIT_MEMBERS = 'SET_NEW_UNIT_MEMBERS';
const SET_LOADED_MEMBER = 'SET_LOADED_MEMBER';
const SET_NEW_MEMBERS = 'SET_NEW_MEMBERS';

/* --------------   ACTION CREATORS   -------------- */

const setTab = payload => dispatch => dispatch({ type: SET_TAB, payload });
const setIsValid = payload => dispatch => dispatch({ type: SET_IS_VALID, payload });
const setMessage = payload => dispatch => dispatch({ type: SET_MESSAGE, payload });
const setValidation = payload => dispatch => dispatch({ type: SET_VALIDATION, payload });

const setTempInput = payload => dispatch => dispatch({ type: SET_TEMP_INPUT, payload });
const setLoadedArtist = payload => dispatch => dispatch({ type: SET_LOADED_ARTIST, payload });
const setNewArtistName = payload => dispatch => dispatch({ type: SET_NEW_ARTIST_NAME, payload });
const setNewArtistOtherNames = payload => dispatch => dispatch({ type: SET_NEW_ARTIST_OTHER_NAMES, payload });
const setNewArtistGenre = payload => dispatch => dispatch({ type: SET_NEW_ARTIST_GENRE, payload });
const setNewArtistUnits = payload => dispatch => dispatch({ type: SET_NEW_ARTIST_UNITS, payload });
const setLoadedUnit = payload => dispatch => dispatch({ type: SET_LOADED_UNIT, payload });
const setNewUnitName = payload => dispatch => dispatch({ type: SET_NEW_UNIT_NAME, payload });
const setNewUnitDebutYear = payload => dispatch => dispatch({ type: SET_NEW_UNIT_DEBUT_YEAR, payload });
const setNewUnitOfficial = payload => dispatch => dispatch({ type: SET_NEW_UNIT_OFFICIAL, payload });
const setNewUnitMembers = payload => dispatch => dispatch({ type: SET_NEW_UNIT_MEMBERS, payload });
const setLoadedMember = payload => dispatch => dispatch({ type: SET_LOADED_MEMBER, payload });
const setNewMembers = payload => dispatch => dispatch({ type: SET_NEW_MEMBERS, payload });

/* -----------------   REDUCERS   ------------------ */

const initialState = {
  tab: 'artist',
  isValid: false,
  message: {},
  validation: {
    artist: 'box-unchecked',
    unit: 'box-unchecked',
    members: 'box-unchecked',
  },
  tempInput: '',
  loadedArtist: 0,
  newArtistName: '',
  newArtistOtherNames: '',
  newArtistGenre: 'K-Pop',
  newArtistUnits: [],
  loadedUnit: 0,
  newUnitName: '',
  newUnitDebutYear: '',
  newUnitOfficial: false,
  newUnitMembers: [],
  loadedMember: 0,
  newMembers: {},

};

export default function reducer(prevState = initialState, action) {
  const newState = Object.assign({}, prevState);

  switch (action.type) {
    case SET_TAB:
      newState.tab = action.payload;
      break;

    case SET_IS_VALID:
      newState.isValid = action.payload;
      break;

    case SET_MESSAGE:
      newState.message = action.payload;
      break;

    case SET_VALIDATION:
      newState.validation = action.payload;
      break;

    case SET_TEMP_INPUT:
      newState.tempInput = action.payload;
      break;

    case SET_LOADED_ARTIST:
      newState.loadedArtist = action.payload;
      break;

    case SET_NEW_ARTIST_NAME:
      newState.newArtistName = action.payload;
      break;

    case SET_NEW_ARTIST_OTHER_NAMES:
      newState.newArtistOtherNames = action.payload;
      break;

    case SET_NEW_ARTIST_GENRE:
      newState.newArtistGenre = action.payload;
      break;

    case SET_NEW_ARTIST_UNITS:
      newState.newArtistUnits = action.payload;
      break;

    case SET_LOADED_UNIT:
      newState.loadedUnit = action.payload;
      break;

    case SET_NEW_UNIT_NAME:
      newState.newUnitName = action.payload;
      break;

    case SET_NEW_UNIT_DEBUT_YEAR:
      newState.newUnitDebutYear = action.payload;
      break;

    case SET_NEW_UNIT_OFFICIAL:
      newState.newUnitOfficial = action.payload;
      break;

    case SET_NEW_UNIT_MEMBERS:
      newState.newUnitMembers = action.payload;
      break;

    case SET_LOADED_MEMBER:
      newState.loadedMember = action.payload;
      break;

    case SET_NEW_MEMBERS:
      newState.newMembers = action.payload;
      break;

    default:
      return prevState;
  }
  return newState;
}

/* ---------------   DISPATCHERS   ----------------- */

export const loadArtist = event => (dispatch) => {
  dispatch(setTempInput(''));
  const { value } = event.target;
  dispatch(setLoadedArtist(value));
  if (value !== 'art000000') {
    const artist = API.get(`/artists/${value}`);
    dispatch(setNewArtistName(artist.name));
    dispatch(setNewArtistOtherNames(artist.otherNames || ''));
    dispatch(setNewArtistGenre(artist.genre));
    dispatch(setNewArtistUnits(artist.units || []));
    dispatch(setNewUnitName(''));
    dispatch(setNewUnitDebutYear(''));
    dispatch(setNewUnitOfficial(false));
    dispatch(setNewUnitMembers([]));
  } else {
    dispatch(setNewArtistName(''));
    dispatch(setNewArtistOtherNames(''));
    dispatch(setNewArtistGenre('K-Pop'));
    dispatch(setNewArtistUnits([]));
  }

  // Lazy validation
  setTimeout(dispatch(checkValidation()), 1000);
};

export const handleNewArtistName = event => (dispatch) => {
  // Empty clipboard input
  dispatch(setTempInput(''));
  const { value } = event.target;
  dispatch(setNewArtistName(value));

  // Lazy validation
  setTimeout(dispatch(checkValidation()), 1000);
};

export const handleNewArtistOtherNames = event => (dispatch) => {
  // Empty clipboard input
  dispatch(setTempInput(''));
  const { value } = event.target;
  dispatch(setNewArtistOtherNames(value));

  // Lazy validation
  setTimeout(dispatch(checkValidation()), 1000);
};

export const handleNewArtistGenre = event => (dispatch) => {
  // Empty clipboard input
  dispatch(setTempInput(''));
  const { value } = event.target;
  dispatch(setNewArtistGenre(value));

  // Lazy validation
  setTimeout(dispatch(checkValidation()), 1000);
};

export const loadUnit = event => (dispatch) => {
  dispatch(setTempInput(''));
  const { value } = event.target;
  dispatch(setLoadedUnit(value));
  if (value) {
    const unit = API.get(`/units/${value}`);
    dispatch(setNewUnitName(unit.name));
    dispatch(setNewUnitDebutYear(unit.debutYear));
    dispatch(setNewUnitOfficial(unit.official));
    dispatch(setNewUnitMembers(unit.members));
  } else {
    dispatch(setNewUnitName(''));
    dispatch(setNewUnitDebutYear(''));
    dispatch(setNewUnitOfficial(false));
    dispatch(setNewUnitMembers([]));
  }

  // Lazy validation
  setTimeout(dispatch(checkValidation()), 1000);
};

export const handleNewUnitName = event => (dispatch) => {
  // Empty clipboard input
  dispatch(setTempInput(''));
  const { value } = event.target;
  dispatch(setNewUnitName(value));

  // Lazy validation
  setTimeout(dispatch(checkValidation()), 1000);
};

export const handleNewUnitDebutYear = event => (dispatch) => {
  // Empty clipboard input
  dispatch(setTempInput(''));
  const { value } = event.target;
  dispatch(setNewUnitDebutYear(value));

  // Lazy validation
  setTimeout(dispatch(checkValidation()), 1000);
};

export const handleNewUnitOfficial = event => (dispatch) => {
  // Empty clipboard input
  dispatch(setTempInput(''));
  const value = event.target.checked;
  dispatch(setNewUnitOfficial(value));

  // Lazy validation
  setTimeout(dispatch(checkValidation()), 1000);
};

export const loadMember = event => (dispatch, getState) => {
  dispatch(setTempInput(''));
  const { value } = event.target;

  if (value) {
    const newUnitMembers = [...getState().creator.newUnitMembers];
    newUnitMembers.push(value);
    dispatch(setNewUnitMembers(newUnitMembers));
  }
  dispatch(setLoadedMember(0));

  // Lazy validation
  setTimeout(dispatch(checkValidation()), 1000);
};

export const unloadMember = (event, id) => (dispatch, getState) => {
  event.preventDefault();

  // Empty clipboard input
  dispatch(setTempInput(''));

  const newUnitMembers = [...getState().creator.newUnitMembers];
  const index = newUnitMembers.indexOf(id);
  if (index > -1) {
    newUnitMembers.splice(index, 1);
  }
  dispatch(setNewUnitMembers(newUnitMembers));

  // Lazy validation
  setTimeout(dispatch(checkValidation()), 1000);
};

export const addNewMember = event => (dispatch, getState) => {
  event.preventDefault();

  // Empty clipboard input
  dispatch(setTempInput(''));

  const newMembers = Object.assign({}, getState().creator.newMembers);
  const newUnitMembers = Object.assign({}, getState().creator.newUnitMembers);

  // Prevent more than 25 members
  if ((Object.keys(newMembers).length + newUnitMembers.length) === 25) {
    alert('You can NOT have more than 25 members in the same unit');
    return;
  }

  const newId = Date.now();

  const blankMember = {
    id: newId,
    name: '',
    colorId: 0,
    altColorId: 0,
    birthdate: 0,
    positions: {
      pos000001: false,
      pos000002: false,
      pos000003: false,
      pos000004: false,
      pos000005: false,
      pos000006: false,
      pos000007: false,
      pos000008: false,
      pos000009: false,
      pos000010: false,
      pos000011: false,
      pos000012: false,
      pos000013: false,
    },
  };

  newMembers[newId] = blankMember;

  dispatch(setNewMembers(newMembers));

  // Lazy validation
  setTimeout(dispatch(checkValidation()), 1000);
};

export const removeNewMember = (event, id) => (dispatch, getState) => {
  event.preventDefault();

  // Empty clipboard input
  dispatch(setTempInput(''));

  const newMembers = Object.assign({}, getState().creator.newMembers);
  delete newMembers[id];
  dispatch(setNewMembers(newMembers));

  // Lazy validation
  setTimeout(dispatch(checkValidation()), 1000);
};

export const updateNewMember = (event, id, field) => (dispatch, getState) => {
  // Empty clipboard input
  dispatch(setTempInput(''));

  const newMembers = Object.assign({}, getState().creator.newMembers);
  const { value } = event.target;

  if (field === 'name') {
    newMembers[id].name = value;
  } else if (field === 'birthdate') {
    newMembers[id].birthdate = value;
  } else if (field === 'color' && value) {
    newMembers[id].colorId = value;
    newMembers[id].altColorId = getAlternativeColor(value);
  } else if (field === 'position' && value) {
    // Toggles positions that can't be with the same member
    switch (value) {
      case 'pos000002':
        newMembers[id].positions.pos000005 = false;
        newMembers[id].positions.pos000008 = false;
        break;
      case 'pos000005':
        newMembers[id].positions.pos000002 = false;
        newMembers[id].positions.pos000008 = false;
        break;
      case 'pos000008':
        newMembers[id].positions.pos000002 = false;
        newMembers[id].positions.pos000005 = false;
        break;
      case 'pos000003':
        newMembers[id].positions.pos000006 = false;
        newMembers[id].positions.pos000010 = false;
        break;
      case 'pos000006':
        newMembers[id].positions.pos000003 = false;
        newMembers[id].positions.pos000010 = false;
        break;
      case 'pos000010':
        newMembers[id].positions.pos000003 = false;
        newMembers[id].positions.pos000006 = false;
        break;
      case 'pos000004':
        newMembers[id].positions.pos000007 = false;
        newMembers[id].positions.pos000009 = false;
        break;
      case 'pos000007':
        newMembers[id].positions.pos000004 = false;
        newMembers[id].positions.pos000009 = false;
        break;
      case 'pos000009':
        newMembers[id].positions.pos000004 = false;
        newMembers[id].positions.pos000007 = false;
        break;
      default:
        // Nothing
    }
    newMembers[id].positions[value] = !newMembers[id].positions[value];
  }

  dispatch(setNewMembers(newMembers));

  // Lazy validation
  setTimeout(dispatch(checkValidation()), 1000);
};

export const removePosition = (event, id, field) => (dispatch, getState) => {
  event.preventDefault();
  console.log('REMOVE POSITION');
  // Empty clipboard input
  dispatch(setTempInput(''));

  const newMembers = Object.assign({}, getState().creator.newMembers);

  newMembers[id].positions = newMembers[id].positions.filter(pos => pos !== field);

  dispatch(setNewMembers(newMembers));

  // Lazy validation
  setTimeout(dispatch(checkValidation()), 1000);
};

export const generateMembersJSON = (evt, skipClipboard = false) => (dispatch, getState) => {
  console.log('Generating Members JSON...');
  const newMembers = _.cloneDeep(getState().creator.newMembers);

  let id = getLatestId('members');

  const newJSON = {};

  // Loop through members, check fields and replace id
  Object.keys(newMembers).forEach((key) => {
    const currentMember = newMembers[key];
    // Replace id
    currentMember.id = id;
    if (!currentMember.name) {
      return alert('Member missing Name');
    }
    if (!currentMember.birthdate) {
      return alert('Member missing Birthdate');
    }
    if (!currentMember.colorId) {
      return alert('Member missing Color');
    }
    if (currentMember.positions.length === 0) {
      return alert('Member missing Position');
    }
    // Sort positions
    currentMember.positions = currentMember.positions.sort((a, b) => a - b);
    // Convert birth date
    currentMember.birthdate = +currentMember.birthdate.split('-').join('');
    newJSON[id] = currentMember;
    id += 1;
  });

  if (!skipClipboard) {
    const clipboard = JSON.stringify(newJSON, null, 2);
    dispatch(setTempInput(clipboard));
    copyToClipboard();
  }

  // Get Existing Members, Get newJson, add them together and order by birthdayDate
  const existingMembers = {};
  const existingMembersIds = getState().creator.newUnitMembers;
  const membersDatabase = getState().database.members;
  existingMembersIds.forEach((mId) => {
    const member = _.cloneDeep(membersDatabase[mId]);
    existingMembers[mId] = member;
  });
  const allMembers = Object.assign({}, newJSON, existingMembers);

  const ids = _.orderBy(allMembers, ['birthdate'], ['asc']).map(member => member.id);

  return { members: newJSON, ids };
};

export const generateUnitJSON = (membersIds, skipClipboard = false) => (dispatch, getState) => {
  console.log('Generating Unit JSON...');
  const bandId = +getState().creator.loadedArtist;
  const unitName = getState().creator.newUnitName;
  const debutYear = getState().creator.newUnitDebutYear;
  const official = getState().creator.newUnitOfficial || false;
  const id = getLatestId('units');

  if (!Array.isArray(membersIds)) {
    membersIds = ['ADD-MEMBER-IDS'];
  }

  if (!unitName) {
    return alert('Missing Band Name');
  }

  const newJSON = {
    id,
    bandId,
    name: unitName,
    debutYear,
    official,
    members: membersIds,
    songs: [],
  };

  if (!skipClipboard) {
    const clipboard = JSON.stringify(newJSON, null, 2);
    dispatch(setTempInput(clipboard));
    copyToClipboard();
  }

  return { unit: newJSON, id };
};

export const generateArtistJSON = (unitId, skipClipboard = false) => (dispatch, getState) => {
  console.log('Generating Artist JSON...');
  const artistName = getState().creator.newArtistName;
  const otherNames = getState().creator.newArtistOtherNames;
  const genre = getState().creator.newArtistGenre;
  let units = [...getState().creator.newArtistUnits];
  const { loadedUnit } = getState().creator;
  const id = getLatestId('artists');

  if (typeof unitId === 'number' || typeof unitId === 'string') {
    unitId = [unitId];
  } else if (loadedUnit) {
    unitId = [loadedUnit];
  } else {
    unitId = [];
  }
  units = units.concat(unitId);

  if (!artistName) {
    return alert('Missing Artist Name');
  }

  const newJSON = {
    id,
    name: artistName,
    otherNames,
    genre,
    units,
  };

  if (!skipClipboard) {
    const clipboard = JSON.stringify(newJSON, null, 2);
    dispatch(setTempInput(clipboard));
    copyToClipboard();
  }

  return { artist: newJSON };
};

export const generateFullJSON = event => (dispatch) => {
  console.log('Generating Full JSON...');

  const members = dispatch(generateMembersJSON(event, true));
  const unit = dispatch(generateUnitJSON(members.ids, true));
  const artist = dispatch(generateArtistJSON(unit.id, true));
  const newJSON = {};

  newJSON.artist = artist.artist;
  newJSON.unit = unit.unit;
  newJSON.members = members.members;

  const clipboard = JSON.stringify(newJSON, null, 2);
  dispatch(setTempInput(clipboard));
  copyToClipboard();
};

// NEW STUFF

export const switchCreatorTab = event => (dispatch) => {
  const { id } = event.target;
  dispatch(setTab(id));
};

export const checkValidation = () => (dispatch, getState) => {
  const { creator, admin } = getState();
  const { tab, message } = creator;
  const validation = Object.assign({}, creator.validation);

  // ARTIST
  if (tab === 'artist' || tab === 'review') {
    if (!creator.newArtistName) {
      message[1] = 'Missing Artist Name.\n';
    } else {
      const exists = _.find(admin.artists, o => o.name.toLowerCase() === creator.newArtistName.toLowerCase());
      if (exists !== undefined && exists.id !== creator.loadedArtist) {
        message[1] = 'Artist already exists. Please just load it.\n';
        validation.artist = 'box-invalid';
      } else {
        delete message[1];
        validation.artist = 'box-checked';
      }
    }
  }

  // UNIT
  if (tab === 'unit' || tab === 'review') {
    // Unit Name must be unique
    if (!creator.newUnitName) {
      message[2] = 'Missing Unit Name.\n';
    } else {
      const sameUnit = o => (
        o.name.toLowerCase() === creator.newUnitName.toLowerCase()
        && o.artistId === creator.loadedArtist
      );

      const exists = _.find(admin.units, sameUnit);
      if (exists !== undefined && exists.id !== creator.loadedUnit) {
        message[2] = 'Chosen unit name already exists for this group. Choose a different one.\n';
        validation.unit = 'box-invalid';
      } else {
        delete message[2];
        validation.unit = 'box-checked';
      }
      // Unit Debut Year required
      if (!creator.newUnitDebutYear) {
        message[3] = 'Missing Unit Debut Year.\n';
        validation.unit = 'box-invalid';
      } else {
        delete message[3];
      }
    }
  }

  // MEMBERS
  if (tab === 'members' || tab === 'review') {
    const newMembersCount = Object.keys(creator.newMembers).length;
    const existingMembersCount = creator.newUnitMembers.length;

    if (existingMembersCount > 1 && newMembersCount === 0) {

      validation.members = 'box-checked';
    } else if (existingMembersCount + newMembersCount > 1) {
      validation.members = 'box-unchecked';

      // Loop through newMembers and check their fields
      let membersMessages = '';
      Object.keys(creator.newMembers).forEach((key, i) => {
        const member = creator.newMembers[key];
        let memberMessage = `Missing member ${i + 1}'s `;

        if (!member.name) {
          memberMessage += 'name, ';
        }
        if (!member.colorId) {
          memberMessage += 'color, ';
        }
        if (!member.birthdate) {
          memberMessage += 'birth date, ';
        }
        if (_.filter(member.positions, o => o).length === 0) {
          memberMessage += 'positions.\n';
        }
        if (memberMessage.length > 20) {
          membersMessages += memberMessage;
        }
      });

      if (membersMessages) {
        message[4] = membersMessages;
        validation.members = 'box-invalid';
      } else {
        validation.members = 'box-checked';
        delete message[4];
      }
    } else {
      validation.members = 'box-unchecked';
    }
  }

  if (validation.artist === 'box-checked' && validation.unit === 'box-checked' && validation.members === 'box-checked') {
    dispatch(setIsValid(true));
  } else {
    dispatch(setIsValid(false));
  }
  dispatch(setValidation(validation));
  dispatch(setMessage(message));
};

export const reset = () => dispatch => dispatch();

export const clearPositions = (e, id) => (dispatch, getState) => {
  e.preventDefault();

  const newMembers = Object.assign({}, getState().creator.newMembers);
  const validation = Object.assign({}, getState().creator.validation);

  const positions = {
    pos000001: false,
    pos000002: false,
    pos000003: false,
    pos000004: false,
    pos000005: false,
    pos000006: false,
    pos000007: false,
    pos000008: false,
    pos000009: false,
    pos000010: false,
    pos000011: false,
    pos000012: false,
    pos000013: false,
  };
  newMembers[id].positions = positions;
  dispatch(setNewMembers(newMembers));
  validation.members = 'box-invalid';
  dispatch(setValidation(validation));
};

export const save = () => (dispatch, getState) => {
  const { creator } = getState();

  const body = {
    wasArtistLoaded: creator.loadedArtist > 0,
    artist: {
      genre: creator.newArtistGenre,
      name: creator.newArtistName,
      otherNames: creator.newArtistOtherNames,
    },
    wasUnitLoaded: creator.loadedUnit > 0,
    unit: {
      artistId: creator.loadedArtist,
      debutYear: creator.newUnitDebutYear,
      members: creator.newUnitMembers,
      name: creator.newUnitName,
      official: creator.newUnitOfficial,
    },
    members: [],
  };

  // Prepare members
  Object.keys(creator.newMembers).forEach((key) => {
    const newMember = _.cloneDeep(creator.newMembers[key]);
    newMember.birthdate = +newMember.birthdate.split('-').join('');
    newMember.positions = getTrueKeys(newMember.positions);
    body.members.push(newMember);
  });
  console.log(body);
  API.post('/completeArtist', body);
};