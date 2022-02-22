import React, {createContext, useContext, useReducer} from 'react';
import {INIT_STATE, lobbyReducer} from './reducer';
import {
  // ILobbyContext,
  ILobbyProviderProps,
  ILobbyState,
  LobbyAction,
} from './types';

/* Contexts have been separated for performance reasons.
/* See bottom of page for combined version (commented out)
*/
const LobbyStateContext = createContext<ILobbyState | undefined>(undefined);
const LobbyDispatchContext = createContext<
  React.Dispatch<LobbyAction> | undefined
>(undefined);

/**
 * Hook for accessing the lobby state. Hooks separated for performance
 * @return {ILobbyState}
 */
export function useLobbyStateContext(): ILobbyState {
  const state = useContext(LobbyStateContext);
  if (state === undefined) {
    // eslint-disable-next-line max-len
    throw new Error('useLobbyStateContext must be called inside of LobbyProvider');
  }

  return state;
}

/**
 * Hook for dispatching lobby actions. Hooks separated for performance
 * @return {React.Dispatch<LobbyAction>}
 */
export function useLobbyDispatchContext(): React.Dispatch<LobbyAction> {
  const dispatch = useContext(LobbyDispatchContext);
  if (dispatch === undefined) {
    // eslint-disable-next-line max-len
    throw new Error('useLobbyDispatchContext must be called inside of LobbyProvider');
  }

  return dispatch;
}

/**
 * The context provider for the cursor data
 * @param {ILobbyProviderProps} {children} - the consumer child nodes
 * @return {JSX.Element}
 */
export function LobbyProvider({children}: ILobbyProviderProps): JSX.Element {
  //
  const [state, dispatch] = useReducer(lobbyReducer, INIT_STATE);

  return (
    <LobbyStateContext.Provider value={state}>
      <LobbyDispatchContext.Provider value={dispatch}>
        {children}
      </LobbyDispatchContext.Provider>
    </LobbyStateContext.Provider>
  );
}

// const LobbyContext = createContext<ILobbyContext | undefined>(undefined);

// /**
//  * Hook for accessing and updating the lobby state
//  * @return {ILobbyContext}
//  */
// export function useLobbyContext(): ILobbyContext {
//   const context = useContext(LobbyContext);
//   if (context === undefined) {
//     // eslint-disable-next-line max-len
// eslint-disable-next-line max-len
//     throw new Error('useLobbyContext must be called inside of LobbyProvider');
//   }

//   return context;
// }

// /**
//  * The context provider for the cursor data
//  * @param {ILobbyProviderProps} {children} - the consumer child nodes
//  * @return {JSX.Element}
//  */
// export function LobbyProvider(
//     {children}: ILobbyProviderProps,
// ): JSX.Element {
//   const [state, dispatch] = useReducer(lobbyReducer, INIT_STATE);
//   return (
//     <LobbyContext.Provider value={{state, dispatch}}>
//       {children}
//     </LobbyContext.Provider>
//   );
// }
