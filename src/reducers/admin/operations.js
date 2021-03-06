import _ from 'lodash';
import { toastr } from 'react-redux-toastr';

import constants from '../../utils/constants';
import enums from '../../utils/readable-enums';

import actions from './actions';

const handleResyncDB = () => dispatch => dispatch({ type: 'RESYNC_DATABASE' });

const handleEditArtist = artistId => (dispatch, getState) => {
  const panels = { ...getState().admin.panels };

  panels.artist = 'edit';

  if (artistId) {
    dispatch({ type: 'REQUEST_ARTIST', artistId, panels, state: 'edit' });
  } else {
    dispatch(actions.setEditingArtist({ new: true }));
    dispatch(actions.setPanels(panels));
  }
};

const handleEditUnit = unitId => (dispatch, getState) => {
  const panels = { ...getState().admin.panels };

  panels.unit = 'edit';

  if (unitId) {
    const units = [...getState().admin.editingArtist.units];
    const unitIndex = _.findIndex(units, u => u.id === unitId);
    const currentUnit = units[unitIndex];

    dispatch(actions.setEditingUnit(currentUnit));
  } else {
    dispatch(actions.setEditingUnit({ new: true }));
  }

  dispatch(actions.setPanels(panels));
};

const handleEditMember = (memberId, formState) => (dispatch, getState) => {
  const editingMembers = [...getState().admin.editingMembers];
  if (memberId) {
    const { members } = getState().db;
    const memberIndex = _.findIndex(members, m => m.id === memberId);
    const addedMember = { ...members[memberIndex] };
    editingMembers.push(addedMember);
    dispatch(actions.setEditingMembers(editingMembers));

    // Also update colors in use
    // const colorsInUse = {};
    // editingMembers.forEach(member => (colorsInUse[member.colorId] = true)); //eslint-disable-line
    const colorsInUse = editingMembers.reduce((dict, member) => {
      if (member && member.colorId) {
        dict[member.colorId] = true;
      }
      return dict;
    }, {});
    dispatch(actions.setColorsInUse(colorsInUse));
  } else {
    let lastMember = editingMembers[editingMembers.length - 1] || false;
    if (lastMember && formState.values.members) {
      lastMember =
        formState.values.members[formState.values.members.length - 1];
    }

    editingMembers.push({
      new: true,
      positions: [],
      gender: lastMember.gender || undefined,
      nationality: lastMember.nationality || undefined,
    });
    dispatch(actions.setEditingMembers(editingMembers));
  }
};

const updateMemberColor = (value, index) => (dispatch, getState) => {
  const editingMembers = [...getState().admin.editingMembers];
  editingMembers[index].colorId = value;
  dispatch(actions.setEditingMembers(editingMembers));

  // Also update colors in use
  const colorsInUse = editingMembers.reduce((dict, member) => {
    if (member && member.colorId) {
      dict[member.colorId] = true;
    }
    return dict;
  }, {});
  dispatch(actions.setColorsInUse(colorsInUse));
};

const updateMemberPositions = () => {};

// const updateMemberPositions = (value, position, index) => (
//   dispatch,
//   getState
// ) => {
//   const editingMembers = [...getState().admin.editingMembers];
//   const positionsObj = {};
//   editingMembers[index].positions.forEach(pos => (positionsObj[pos] = true));
//   if (value === false) {
//     delete positionsObj[position];
//   } else {
//     positionsObj[position] = true;
//     switch (position) {
//       case 'MAIN_VOCALIST':
//         delete positionsObj.LEAD_VOCALIST;
//         delete positionsObj.VOCALIST;
//         break;
//       case 'LEAD_VOCALIST':
//         delete positionsObj.MAIN_VOCALIST;
//         delete positionsObj.VOCALIST;
//         break;
//       case 'VOCALIST':
//         delete positionsObj.MAIN_VOCALIST;
//         delete positionsObj.LEAD_VOCALIST;
//         break;
//       case 'MAIN_DANCER':
//         delete positionsObj.LEAD_DANCER;
//         delete positionsObj.DANCER;
//         break;
//       case 'LEAD_DANCER':
//         delete positionsObj.MAIN_DANCER;
//         delete positionsObj.DANCER;
//         break;
//       case 'DANCER':
//         delete positionsObj.MAIN_DANCER;
//         delete positionsObj.LEAD_DANCER;
//         break;
//       case 'MAIN_RAPPER':
//         delete positionsObj.LEAD_RAPPER;
//         delete positionsObj.RAPPER;
//         break;
//       case 'LEAD_RAPPER':
//         delete positionsObj.MAIN_RAPPER;
//         delete positionsObj.RAPPER;
//         break;
//       case 'RAPPER':
//         delete positionsObj.MAIN_RAPPER;
//         delete positionsObj.LEAD_RAPPER;
//         break;
//       default:
//       // do nothing
//     }
//   }
//   editingMembers[index].positions = Object.keys(positionsObj);
//   dispatch(actions.setEditingMembers(editingMembers));
// };

const updateManageForm = () => () => {
  // // console.log(formObj);
  // if (formObj.dirty) {
  //   // console.log('DIRTY');
  //   // console.log(formObj);
  // } else {
  //   // console.log('CLEAN');
  // }
};

const unlockUnit = formState => (dispatch, getState) => {
  const artistState = formState.values.artist;

  // Only unlock if required fields are filled.
  if (!artistState || !artistState.name || !artistState.genre) return;

  const panels = { ...getState().admin.panels };
  panels.unit = 'open';

  const editingArtistState = getState().admin.editingArtist;
  const editingArtist = {
    genre: artistState.genre,
    name: artistState.name,
    otherNames: artistState.otherNames || '',
    private: artistState.private || false,
    new: editingArtistState.new || false,
    memberIds: editingArtistState.memberIds || false,
    memberList: editingArtistState.memberList || false,
    units: editingArtistState.units || false,
    id: editingArtistState.id,
    createdBy: editingArtistState.createdBy,
  };

  dispatch(actions.setEditingArtist(editingArtist));
  dispatch(actions.setPanels(panels));
};

const unlockMembers = formState => (dispatch, getState) => {
  const unitState = formState.values.unit;

  // Only unlock if required fields are filled.
  if (!unitState || !unitState.name || !unitState.debutYear) return;

  const panels = { ...getState().admin.panels };
  panels.members = 'open';

  const editingUnitState = getState().admin.editingUnit;
  const editingUnit = {
    debutYear: unitState.debutYear,
    name: unitState.name,
    official: unitState.official,
    private: unitState.private || false,
    subUnit: unitState.subUnit || null,
    new: editingUnitState.new || false,
    averages: editingUnitState.averages || false,
    distributions: editingUnitState.distributions || false,
    members: editingUnitState.members || false,
    id: editingUnitState.id,
    createdBy: editingUnitState.createdBy,
  };

  dispatch(actions.setEditingUnit(editingUnit));
  dispatch({
    type: 'REQUEST_UNIT_MEMBERS',
    unitId: editingUnitState.id,
    panels,
  });
};

const removeMember = index => (dispatch, getState) => {
  const editingMembers = [...getState().admin.editingMembers];
  // editingMembers.splice(index, 1);
  editingMembers[index] = null;
  dispatch(actions.setEditingMembers(editingMembers));
};

const resetManage = () => dispatch => {
  dispatch(actions.setEditingArtist({}));
  dispatch(actions.setEditingMembers([]));
  dispatch(actions.setEditingUnit({}));
  dispatch(actions.setUnitsTypeahead([]));
  dispatch(actions.setUnitsTypeaheadDict({}));
  dispatch(actions.setManageResult(null));
  dispatch(actions.setColorsInUse({}));
  dispatch(
    actions.setPanels({
      artist: 'open',
      unit: 'locked',
      members: 'locked',
    })
  );
};

const saveManage = formState => async (dispatch, getState) => {
  const artistState = formState.values.artist;
  const unitState = formState.values.unit;
  const membersState = formState.values.members;

  // Check formState
  if (Object.keys(formState.errors).length) {
    toastr.warning('The form has errors', formState.errors.toString());
    return;
  }

  // Check artist required fields
  if (!artistState || !artistState.name || !artistState.genre) {
    toastr.warning('Artist is incomplete', 'Missing name and/or genre');
    return;
  }

  // Check unit required fields
  if (!unitState || !unitState.name || !unitState.debutYear) {
    toastr.warning('Unit is incomplete', 'Missing name and/or debut year');
    return;
  }

  if (!membersState || membersState.length < 2) {
    toastr.warning(
      'Minimum of 2 members are required',
      `You have ${membersState.length} members so far`
    );
    return;
  }

  // Check members required fields
  let missingField = false;
  membersState.forEach(member => {
    if (
      !member.name ||
      !member.birthdate ||
      !member.colorId ||
      !member.gender ||
      !member.nationality
    ) {
      missingField = true;
    }
    const hasPositions = Object.keys(member).some(m => enums.POSITIONS[m]);
    if (!hasPositions) missingField = true;
  });
  if (missingField) {
    toastr.warning(
      'A members has missing fields',
      'Check the console for details'
    );
    console.log(membersState); // eslint-disable-line
    return;
  }

  // Prepare Artist
  const editingArtistState = getState().admin.editingArtist;
  const editingArtist = {
    genre: artistState.genre,
    name: artistState.name,
    otherNames: artistState.otherNames || '',
    private: artistState.private || false,
    new: editingArtistState.new || false,
    memberIds: editingArtistState.memberIds || [],
    memberList: editingArtistState.memberList || [],
    units: editingArtistState.units
      ? editingArtistState.units.map(unit => unit.id)
      : [],
    id: editingArtistState.id || null,
    createdBy: editingArtistState.createdBy || null,
  };

  // Prepare Unit
  const editingUnitState = getState().admin.editingUnit;
  const editingUnit = {
    debutYear: unitState.debutYear,
    name: unitState.name,
    official: unitState.official,
    private: unitState.private || false,
    subUnit: unitState.subUnit || null,
    new: editingUnitState.new || false,
    averages: editingUnitState.averages || false,
    distributions: editingUnitState.distributions || false,
    artistId: editingUnitState.id || null,
    id: editingUnitState.id || null,
    createdBy: editingUnitState.createdBy || null,
  };

  // Prepare Members
  const editingMembersState = getState().admin.editingMembers;
  const editingMembers = [];
  membersState.forEach((memberState, index) => {
    if (memberState) {
      const newMember = {
        birthdate: +memberState.birthdate.replace(/(-)/g, ''),
        colorId: memberState.colorId,
        gender: memberState.gender,
        initials: memberState.initials || '',
        name: memberState.name,
        nationality: memberState.nationality,
        private: memberState.private || false,
      };
      // Handle existing database member
      if (editingMembersState[index].id) {
        newMember.createdBy = editingMembersState[index].createdBy || null;
        newMember.id = editingMembersState[index].id || null;
        newMember.referenceArtist =
          editingMembersState[index].referenceArtist || null;
      }
      // Handle positions
      const positions = [];
      Object.keys(memberState).forEach(key => {
        if (constants.POSITIONS_LIST.includes(key)) positions.push(key);
      });
      newMember.positions = positions;

      editingMembers.push(newMember);
    }
  });

  dispatch({
    type: 'UPDATE_COMPLETE_ARTIST',
    artist: editingArtist,
    unit: editingUnit,
    members: editingMembers,
  });
};

export default {
  handleEditArtist,
  handleEditMember,
  handleEditUnit,
  handleResyncDB,
  removeMember,
  resetManage,
  saveManage,
  unlockUnit,
  unlockMembers,
  updateManageForm,
  updateMemberColor,
  updateMemberPositions,
};
