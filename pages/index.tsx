import type {NextPage} from 'next';
import Head from 'next/head';
import React from 'react';
import styles from '../styles/Home.module.scss';


const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Cursor Lobby</title>
        <meta
          name="description"
          content="A lobby of cursors representing users in realtime,
            inspired by nextjs conf"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to
          {' '}
          <a
            href="https://github.com/Chunxei/cursor-lobby"
            rel="noopener noreferrer"
            target="_blank"
          >
            Cursor Lobby
          </a>
        </h1>
      </main>
    </div>
  );
};

export default Home;

