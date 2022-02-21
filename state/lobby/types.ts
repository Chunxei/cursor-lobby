import React from 'react';
import {GenericAction} from '../types';

export const SET_CURRENT_USER = 'set current user';
export const UPDATE_CURRENT_USER = 'update current user';
export const SET_LOBBY = 'set lobby';

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
  name?: string
  role?: string
  message?: string
}

export interface ILobbyState {
  me: IUser
  lobby?: {
    roomId: string
    hostId: string
    roomMembers: Record<string, boolean>
  }
}

export interface ILobbyContext {
  state: ILobbyState
  dispatch: React.Dispatch<LobbyAction>
}

export type RegisterCurrentUser = GenericAction<typeof SET_CURRENT_USER, IUser>

// eslint-disable-next-line max-len
export type UpdateCurrentUser = GenericAction<typeof UPDATE_CURRENT_USER, Partial<IUser>>

export type SetLobby = GenericAction<typeof SET_LOBBY, ILobbyState['lobby']>

export type LobbyAction = RegisterCurrentUser | UpdateCurrentUser
| SetLobby;
