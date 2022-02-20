import React, {createContext, useContext, useReducer} from 'react';
import {INIT_STATE, lobbyReducer} from './reducer';
import {
  ILobbyContext,
  ILobbyProviderProps,
} from './types';

const LobbyContext = createContext<ILobbyContext | undefined>(undefined);

/**
 * Hook for accessing and updating the lobby state
 * @return {ILobbyContext}
 */
export function useLobbyContext(): ILobbyContext {
  const context = useContext(LobbyContext);
  if (context === undefined) {
    // eslint-disable-next-line max-len
    throw new Error('useLobbyContext must be called inside of LobbyContextProvider');
  }
  return context;
}

/**
 * The context provider for the cursor data
 * @param {ILobbyProviderProps} {children} - the consumer child nodes
 * @return {JSX.Element}
 */
export function LobbyProvider(
    {children}: ILobbyProviderProps,
): JSX.Element {
  const [state, dispatch] = useReducer(lobbyReducer, INIT_STATE);
  return (
    <LobbyContext.Provider value={{state, dispatch}}>
      {children}
    </LobbyContext.Provider>
  );
}
