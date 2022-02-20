import '../styles/globals.scss';
import type {AppProps} from 'next/app';
import {LobbyProvider} from '../state/lobby/provider';

/**
 * Wraps around the entire app
 * @param {AppProps} {Component, pageProps} - app props
 * @return {JSX.Element}
 */
function MyApp({Component, pageProps}: AppProps): JSX.Element {
  return (
    <LobbyProvider>
      <Component {...pageProps} />
    </LobbyProvider>
  );
}

export default MyApp;
