import React from 'react';
import {GenericAction} from '../types';

export const SET_CURRENT_USER = 'set current user';
export const UPDATE_CURRENT_USER = 'update current user';
export const SET_LOBBY = 'set lobby';
export const UPDATE_LOBBY = 'update lobby';
export const RESET_LOBBY = 'reset lobby';

export interface ILobbyProviderProps {
  children?: React.ReactNode
}

/**
 * User data, including the relative position of their cursor
 * @interface
 * **x** and **y** (positions on the screen) are normalized i.e converted
 * into a range of 0 - 1. This is so we can render the cursor's position
 * relative to the dimensions of the screen it is viewed in
 */
export interface IUser {
  id: string
  lastSeen: string
  x: number
  y: number
  name: string
  message: string
  typing: boolean
  color: string
  role?: string
}

export interface ILobbyState {
  me: IUser
}

export interface ILobbyContext {
  state: ILobbyState
  dispatch: React.Dispatch<LobbyAction>
}

export type RegisterCurrentUser = GenericAction<typeof SET_CURRENT_USER, IUser>

// eslint-disable-next-line max-len
export type UpdateCurrentUser = GenericAction<typeof UPDATE_CURRENT_USER, Partial<IUser>>

export type LobbyAction = RegisterCurrentUser | UpdateCurrentUser;
