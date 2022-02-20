import {v4 as uuid} from 'uuid';

import {
  ILobbyState,
  LobbyAction,
  SET_CURRENT_USER,
  SET_LOBBY,
} from './types';

export const INIT_STATE: ILobbyState = {
  me: {
    id: uuid(),
    name: 'Hyeladzira John',
    lastSeen: new Date().toISOString(),
  },
  lobby: {
    roomId: '',
    roomMembers: [],
  },
};

export const lobbyReducer = (
    state = INIT_STATE,
    action: LobbyAction,
): ILobbyState => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {...state, me: action.payload};

    case SET_LOBBY:
      return {...state, lobby: action.payload};

    default:
      return state;
  }
};
