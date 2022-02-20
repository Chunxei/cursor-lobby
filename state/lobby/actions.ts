import {
  ILobbyState,
  IUser,
  SetCurrentUser,
  SetLobby,
  SET_CURRENT_USER,
  SET_LOBBY,
} from './types';

const setCurrentUser = (user: IUser): SetCurrentUser => ({
  type: SET_CURRENT_USER,
  payload: user,
});

const setLobby = (lobby: ILobbyState['lobby']): SetLobby => ({
  type: SET_LOBBY,
  payload: lobby,
});

export const lobbyActions = {
  setCurrentUser,
  setLobby,
};
