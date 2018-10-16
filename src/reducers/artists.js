import _ from 'lodash';

import { setIsLoading } from './app';
import { API } from './db';

/* ------------------   ACTIONS   ------------------ */

const SET_ARTIST_LIST = 'SET_ARTIST_LIST';
const SET_SEARCH_QUERY = 'SET_ARTIST_SEARCH_QUERY';
const SET_SELECTED_ARTIST = 'SET_SELECTED_ARTIST';
const SET_SELECTED_UNIT = 'SET_SELECTED_UNIT';
const SET_SELECTED_UNIT_SONGS = 'SET_SELECTED_UNIT_SONGS';
const SET_SELECTED_UNITS = 'SET_SELECTED_UNITS';
const SET_USER_FAVORITE_ARTISTS = 'SET_USER_FAVORITE_ARTISTS';
const SET_USER_LATEST_ARTISTS = 'SET_USER_LATEST_ARTISTS';

/* --------------   ACTION CREATORS   -------------- */

export const setArtistList = payload => dispatch =>
  dispatch({ type: SET_ARTIST_LIST, payload });
export const setSearchQuery = payload => dispatch =>
  dispatch({ type: SET_SEARCH_QUERY, payload });
export const setSelectedArtist = payload => dispatch =>
  dispatch({ type: SET_SELECTED_ARTIST, payload });
export const setSelectedUnit = payload => dispatch =>
  dispatch({ type: SET_SELECTED_UNIT, payload });
export const setSelectedUnitSongs = payload => dispatch =>
  dispatch({ type: SET_SELECTED_UNIT_SONGS, payload });
export const setSelectedUnits = payload => dispatch =>
  dispatch({ type: SET_SELECTED_UNITS, payload });
export const setUserFavoriteArtists = payload => dispatch =>
  dispatch({ type: SET_USER_FAVORITE_ARTISTS, payload });
export const setUserLatestArtists = payload => dispatch =>
  dispatch({ type: SET_USER_LATEST_ARTISTS, payload });

/* -----------------   REDUCERS   ------------------ */

export const initialState = {
  artistList: {},
  searchQuery: '',
  selectedArtist: {},
  selectedUnit: {},
  selectedUnitSongs: [],
  selectedUnits: {},
  userFavoriteArtists: {},
  userLatestArtists: [],
};

export default function reducer(prevState = initialState, action) {
  const newState = Object.assign({}, prevState);

  switch (action.type) {
    case SET_ARTIST_LIST:
      newState.artistList = action.payload;
      break;

    case SET_SEARCH_QUERY:
      newState.searchQuery = action.payload;
      break;

    case SET_SELECTED_ARTIST:
      newState.selectedArtist = action.payload;
      break;

    case SET_SELECTED_UNIT:
      newState.selectedUnit = action.payload;
      break;

    case SET_SELECTED_UNIT_SONGS:
      newState.selectedUnitSongs = action.payload;
      break;

    case SET_SELECTED_UNITS:
      newState.selectedUnits = action.payload;
      break;

    case SET_USER_LATEST_ARTISTS:
      newState.userLatestArtists = action.payload;
      break;

    case SET_USER_FAVORITE_ARTISTS:
      newState.userFavoriteArtists = action.payload;
      break;

    default:
      return prevState;
  }

  return newState;
}

/* ---------------   DISPATCHERS   ----------------- */

export const loadArtists = () => async dispatch => {
  const artistList = await API.get('/artists');

  const sortedArtistList = _.sortBy(artistList, [a => a.name.toLowerCase()]);

  dispatch(setArtistList(sortedArtistList));

  // Also, load latest artists, and favorite units
  dispatch(loadUserArtists());
};

export const loadUserArtists = () => async (dispatch, getState) => {
  const { user } = getState().auth;
  if (user.uid) {
    const userLatestArtists = await API.get(`/users/${user.uid}/latest`);
    dispatch(setUserLatestArtists(userLatestArtists));
  }
};

export const loadArtist = (artistId, queryParams) => async (
  dispatch,
  getState
) => {
  const artist = await API.get(`/artists/${artistId}`);
  dispatch(setSelectedArtist(artist));

  // Update selected Units
  const units = await API.get(`/artists/${artistId}/units`);
  dispatch(setSelectedUnits(units));

  // Reset selected unit
  const unitsIds = units ? Object.keys(units) : [];

  if (unitsIds.length > 0) {
    let unit = { ...units[unitsIds[0]] };

    if (unitsIds[queryParams]) {
      unit = unitsIds[queryParams];
    }

    dispatch(setSelectedUnit(unit));
  } else {
    dispatch(setSelectedUnit({}));
  }

  if (getState().db.loaded) {
    dispatch(setIsLoading(false));
  }
};

export const updateLatestUnits = id => async (dispatch, getState) => {
  const unitId = id || getState().app.currentUnit.id;
  const { user } = getState().auth;
  if (id && user.uid) {
    let latestUnits = [];
    const { userLatestArtists } = getState().artists;
    if (userLatestArtists.length > 0) {
      latestUnits = userLatestArtists.map(unit => unit.id);
    }
    if (id === latestUnits[0]) {
      return null;
    }

    // Check if it already contains, then remove it
    const containsInLatest = latestUnits.indexOf(unitId);
    if (containsInLatest !== -1) {
      latestUnits.splice(containsInLatest, 1);
    }
    // Add it to the beginning
    latestUnits.unshift(id);
    // Remove the last one if array is larger than 5
    if (latestUnits.length > 5) {
      latestUnits.pop();
    }
    // Post then reload app
    const newUserLatestArtists = await API.post(
      `/users/${user.uid}/latest`,
      latestUnits
    );

    dispatch(setUserLatestArtists(newUserLatestArtists));
  }
};

export const updateSelectedArtist = id => async (dispatch, getState) => {
  const artist = await API.get(`/artists/${id}`);

  dispatch(setSelectedArtist(artist));
  // Reset selected unit
  dispatch(setSelectedUnit({}));

  // Update selected Units
  const units = await API.get(`/artists/${id}/units`);
  dispatch(setSelectedUnits(units));

  // Reset song
  // TO-DO: Remove this call from here. Don't use other reducer functions here

  if (getState().db.loaded) {
    dispatch(setIsLoading(false));
  }
};

export const updateSelectedUnit = id => async dispatch => {
  const unit = await API.get(`/units/${id}`);

  dispatch(setSelectedUnit(unit));
};
