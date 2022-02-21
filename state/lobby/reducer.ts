import {
  ILobbyState,
  LobbyAction,
  SET_CURRENT_USER,
  SET_LOBBY,
  UPDATE_CURRENT_USER,
} from './types';

export const INIT_STATE: ILobbyState = {
  me: {
    id: '',
    name: 'Hyeladzira John',
    x: 0,
    y: 0,
    message: '',
    lastSeen: new Date().toISOString(),
  },

  lobby: {
    roomId: '',
    hostId: '',
    roomMembers: {},
  },
};

export const lobbyReducer = (
    state = INIT_STATE,
    action: LobbyAction,
): ILobbyState => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {...state, me: action.payload};

    case UPDATE_CURRENT_USER:
      return {
        ...state,
        me: {
          ...state.me,
          ...action.payload,
        },
      };

    case SET_LOBBY:
      return {...state, lobby: action.payload};

    default:
      return state;
  }
};
