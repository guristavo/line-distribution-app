const mockDatabase = {
  artists: {
    '1': {
      id: '1',
      createdBy: '1',
      genre: 'POP',
      memberList: ['1', '2', '3'],
      name: 'Band 1',
      otherNames: 'bandie',
      private: false,
      query: 'band',
      units: ['1', '2'],
    },
    '2': {
      id: '2',
      createdBy: '2',
      genre: 'POP',
      memberList: ['2', '4'],
      name: 'Band 2',
      otherNames: 'bandit',
      private: true,
      query: '',
      units: ['3'],
    },
  },
  colors: {
    '1': {
      id: '1',
      b: 255,
      count: 1,
      g: 0,
      hex: '#0000FF',
      name: 'blue',
      r: 0,
    },
    '2': {
      id: '2',
      b: 0,
      count: 1,
      g: 255,
      hex: '#00FF00',
      name: 'green',
      r: 0,
    },
    '3': {
      id: '3',
      b: 0,
      count: 1,
      g: 0,
      hex: '#FF0000',
      name: 'red',
      r: 255,
    },
    '4': {
      id: '4',
      b: 0,
      count: 1,
      g: 255,
      hex: '#FFFF00',
      name: 'yellow',
      r: 255,
    },
    '5': {
      id: '5',
      b: 255,
      count: 1,
      g: 0,
      hex: '#FF00FF',
      name: 'magenta',
      r: 255,
    },
    '6': {
      id: '6',
      b: 255,
      count: 1,
      g: 255,
      hex: '#00FFFF',
      name: 'cyan',
      r: 0,
    },
  },
  distribution: {},
  members: {
    '1': {
      id: '1',
      altColorId: '4',
      birthdate: 1543617465471,
      colorId: '1',
      createdBy: '1',
      gender: 'MALE',
      initials: 'AD',
      name: 'Adam',
      nationality: 'AMERICAN',
      positions: ['MAIN_VOCALIST', 'MAKNAE'],
      private: false,
      referenceArtist: 'Refecent Artist A',
    },
    '2': {
      id: '2',
      altColorId: '5',
      birthdate: 1543617465472,
      colorId: '1',
      createdBy: '1',
      gender: 'MALE',
      initials: 'BO',
      name: 'Bob',
      nationality: 'BRITISH',
      positions: ['VOCALIST', 'DANCER'],
      private: false,
      referenceArtist: 'Refecent Artist A',
    },
    '3': {
      id: '3',
      altColorId: '6',
      birthdate: 1543617465473,
      colorId: '3',
      createdBy: '1',
      gender: 'MALE',
      initials: 'CR',
      name: 'Carlos',
      nationality: 'BRAZILIAN',
      positions: ['MAIN_DANCER'],
      private: true,
      referenceArtist: 'Refecent Artist B',
    },
    '4': {
      id: '4',
      altColorId: '1',
      birthdate: 1543617465474,
      colorId: '4',
      createdBy: '2',
      gender: 'FEMALE',
      initials: 'DA',
      name: 'Diana',
      nationality: 'CHINESE',
      positions: ['MAIN_RAPPER'],
      private: false,
      referenceArtist: 'Refecent Artist C',
    },
    '5': {
      id: '5',
      altColorId: '2',
      birthdate: 15436174654705,
      colorId: '5',
      createdBy: '2',
      gender: 'FEMALE',
      initials: 'EM',
      name: 'Emma',
      nationality: 'KOREAN',
      positions: ['LEAD_VOCALIST', 'DANCER'],
      private: false,
      referenceArtist: 'Refecent Artist C',
    },
    '6': {
      id: '6',
      altColorId: '3',
      birthdate: 1543617465476,
      colorId: '6',
      createdBy: '2',
      gender: 'FEMALE',
      initials: 'FT',
      name: 'Faith',
      nationality: 'THAI',
      positions: ['VOCALIST', 'RAPPER', 'VISUAL'],
      private: true,
      referenceArtist: 'Refecent Artist D',
    },
  },
  positions: {},
  songs: {},
  units: {
    '1': {
      id: '1',
      artistId: '1',
      createdBy: '1',
      debutYear: 2017,
      distributions: [],
      distributions_legacy: [],
      name: 'Unit AAA',
      members: ['1', '2'],
      official: true,
      private: false,
    },
    '2': {
      id: '2',
      artistId: '1',
      createdBy: '1',
      debutYear: 2017,
      distributions: [],
      distributions_legacy: [],
      name: 'Unit BBB',
      members: ['4', '5'],
      official: true,
      private: false,
    },
    '3': {
      id: '3',
      artistId: '2',
      createdBy: '2',
      debutYear: 2018,
      distributions: [],
      distributions_legacy: [],
      name: 'Unit CCC',
      members: ['1', '3'],
      official: true,
      private: true,
    },
  },
  users: {
    A: {
      email: 'a@email.com',
      favoriteArtists: {},
      favoriteMembers: {},
      biases: {
        '1': true,
        '3': true,
      },
      isAdmin: true,
      latestUnits: ['1'],
      session: {},
      displayName: 'User A',
      photoUrl: 'http://www.profile.com/profileA.jpg',
    },
    B: {
      email: 'b@email.com',
      favoriteArtists: {
        '1': true,
      },
      favoriteMembers: {
        '2': true,
      },
      biases: {
        '4': true,
      },
      isAdmin: false,
      latestUnits: ['2', '3'],
      session: {},
      displayName: 'User B',
      photoUrl: 'http://www.profile.com/profileB.jpg',
    },
  },
};
