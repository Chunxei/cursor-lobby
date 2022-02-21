import {firebaseService} from '../../services/firebase';
import {
  ILobbyState,
  IUser,
  RegisterCurrentUser,
  SetLobby,
  SET_CURRENT_USER,
  SET_LOBBY,
  UpdateCurrentUser,
  UPDATE_CURRENT_USER,
} from './types';

const registerCurrentUser = (user: IUser): RegisterCurrentUser => {
  firebaseService.registerUser(user);

  return {
    type: SET_CURRENT_USER,
    payload: user,
  };
};

const updateCurrentUser = (
    userId: string,
    updatedFields: Partial<IUser>,
): UpdateCurrentUser => {
  firebaseService.updateUser(userId, updatedFields);

  return {
    type: UPDATE_CURRENT_USER,
    payload: updatedFields,
  };
};

const setLobby = (lobby: ILobbyState['lobby']): SetLobby => ({
  type: SET_LOBBY,
  payload: lobby,
});

export const lobbyActions = {
  registerCurrentUser,
  updateCurrentUser,
  setLobby,
};
