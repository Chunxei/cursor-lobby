import React from 'react';
import {GenericAction} from '../types';

export const SET_CURRENT_USER = 'set current user';
export const SET_LOBBY = 'set lobby';

export interface ILobbyProviderProps {
  children?: React.ReactNode
}

export interface IUser {
  id: string
  lastSeen: string
  name?: string
  message?: string
}

export interface ILobbyState {
  me: IUser
  lobby?: {
    roomId: string
    roomMembers: IUser[]
  }
}

export interface ILobbyContext {
  state: ILobbyState
  dispatch: React.Dispatch<LobbyAction>
}

export type SetCurrentUser = GenericAction<typeof SET_CURRENT_USER, IUser>

export type SetLobby = GenericAction<typeof SET_LOBBY, ILobbyState['lobby']>

export type LobbyAction = SetCurrentUser | SetLobby;
