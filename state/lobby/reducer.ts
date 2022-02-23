import rand from '../../utils/rangedRandom';
import {
  ILobbyState,
  LobbyAction,
  SET_CURRENT_USER,
  UPDATE_CURRENT_USER,
} from './types';

export const INIT_STATE: ILobbyState = {
  me: {
    id: '',
    name: '',
    x: 0,
    y: 0,
    message: '',
    typing: false,
    color: `rgb(${rand(0, 200)}, ${rand(0, 200)}, ${rand(0, 200)})`,
    lastSeen: new Date().toISOString(),
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

  default:
    return state;
  }
};
