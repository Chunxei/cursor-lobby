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
          Cursor Lobby
        </h1>

        <h6 className={styles.subtitle}>
          Press <kbd>/</kbd> to change your display name
        </h6>

        <h6 className={styles.subtitle}>
          Press any other key to begin writing a message
        </h6>

        <h6 className={styles.subtitle}>
          Press <kbd>enter</kbd> to save
        </h6>

        <p className={styles.paragraph}>
          Visit {' '}
          <a
            className={styles.link}
            href="https://github.com/Chunxei/cursor-lobby"
            rel="noopener noreferrer"
            target="_blank"
          >
            source
          </a>
        </p>
      </main>
    </div>
  );
};

export default Home;

