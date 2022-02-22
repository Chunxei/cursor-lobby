import {firebaseService} from '../../services/firebase';
import {
  IUser,
  RegisterCurrentUser,
  SET_CURRENT_USER,
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
  userFields: Partial<IUser>,
): UpdateCurrentUser => {
  firebaseService.updateUser(userId, userFields);

  return {
    type: UPDATE_CURRENT_USER,
    payload: userFields,
  };
};

export const lobbyActions = {
  registerCurrentUser,
  updateCurrentUser,
};
