import React, { Component } from 'react';
import PropTypes from 'prop-types';

import API from '../api';

import Header from './Header';
import LoadingBar from './LoadingBar';

class App extends Component {
  async componentDidMount() {
    // this.props.initDB();
    // this.props.checkAuth();

    try {
      console.log('==== TRY/CATCH START ====');
      const startDB = await API.init();
      API.setter('_authenticated', true);
      API.setter('_uid', '000000000001');
      console.log(startDB);
      // const testArtists = await API.get(`/artists`);
      // console.log('testArtists', testArtists);
      // const testArtist = await API.get(`/artists/-LDcyPgcJaR4gd8pvVKb`);
      // console.log('testArtist', testArtist);
      // const testArtistUnits = await API.get(
      //   `/artists/-LDcyPgcJaR4gd8pvVKb/units`
      // );
      // console.log('testArtistUnits', testArtistUnits);
      // const testColors = await API.get(`/colors`);
      // console.log('testColors', testColors);
      // const testMembers = await API.get(`/members`);
      // console.log('testMembers', testMembers);
      // const testMember = await API.get(`/members/-LDcyPg_LQgDOBQ-wFP3`);
      // console.log('testMember', testMember);
      // // const testPositions = await API.get(`/positions`);
      // // console.log('testPositions', testPositions);
      // const testSongs = await API.get(`/songs`);
      // console.log('testSongs', testSongs);
      // const testSong = await API.get(`/songs/-LLcdNSHFJj1TqkK0y9f`);
      // console.log('testSong', testSong);
      // const testUnit = await API.get(`/units/-LDcyPgbytNzK2BkYaLN`);
      // console.log('testUnit', testUnit);
      // const testUnitDistributions = await API.get(
      //   `/units/-LDcyPgbytNzK2BkYaLN/distributions`
      // );
      // console.log('testUnitDistributions', testUnitDistributions);
      // const testUnitMembers = await API.get(
      //   `/units/-LDcyPgbytNzK2BkYaLN/members`
      // );
      // console.log('testUnitMembers', testUnitMembers);
      // const testUser = await API.get(`/users/hbFlRswbZkepQfaONzoyB6EuJSA2`);
      // console.log('testUser', testUser);

      // const postColor = await API.post('/colors', {
      //   name: 'test',
      //   r: 1,
      //   g: 2,
      //   b: 3,
      //   hex: '#000000',

      // });
      // console.log('postArtist', postColor);
      // const postMember = await API.post('/members', {
      //   name: 'bob',
      //   birthdate: '123',
      //   colorId: 'col000001',
      //   gender: 'MALE',
      //   nationality: 'BRITISH',
      //   referenceArtist: 'B.O.B.'
      // });
      // console.log('postMember', postMember);
      // console.log('SONG');
      // const postSong = await API.post('/songs', {
      //   title: "Bob's Song",
      //   distribution: 'a string with the distribution',
      //   originalArtist: 'Twice'
      // });
      // console.log('postSong', postSong);
      // console.log('UNIT');
      // const postUnit = await API.post('/units', {
      //   artistId: 'at1', debutYear: 2018, name: 'OT1'
      // });
      // console.log('postUnit', postUnit);

      // console.log('USER');
      // const postUsers = await API.post('/users', {
      //   email: 'kavis@kavis.com'
      // });
      // console.log('postUsers', postUsers);
    } catch (error) {
      console.log('ERROR BITCH!!!', error);
    } finally {
      console.log('==== TRY/CATCH DONE ====');
    }
  }

  componentDidUpdate(nextProps) {
    // if (nextProps.db.loaded !== this.props.db.loaded) {
    //   this.props.checkAuth();
    //   const { location } = this.props;
    //   if (location.pathname === '/artists') {
    //     this.props.loadArtists();
    //   }
    //   if (location.pathname.includes('/artists/')) {
    //     this.props.loadArtist(location.pathname.substr(9), location.search);
    //   }
    // }
  }

  render() {
    return (
      <div>
        {/* <Header props={this.props} /> */}
        {/* {this.props.app.isLoading ? <LoadingBar /> : null} */}
      </div>
    );
  }
}

App.propTypes = {
  app: PropTypes.object.isRequired,
  checkAuth: PropTypes.func.isRequired,
  db: PropTypes.object.isRequired,
  initDB: PropTypes.func.isRequired,
  loadArtist: PropTypes.func.isRequired,
  loadArtists: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
};

export default App;
