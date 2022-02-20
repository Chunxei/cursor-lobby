import type {NextPage} from 'next';
import Head from 'next/head';
import {Cursor} from '../components/cursor';
import useCursorPosition from '../hooks/useCursorPosition';
import {useLobbyContext} from '../state/lobby/provider';
import styles from '../styles/Home.module.scss';


const Home: NextPage = () => {
  const {x, y} = useCursorPosition();
  const {
    state: {
      me,
    },
  } = useLobbyContext();

  return (
    <div className={styles.container}>
      <Head>
        <title>Cursor Lobby</title>
        <meta
          name="description"
          content="A lobby of cursors representing users,
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

      <Cursor
        id={me.id}
        x={x}
        y={y}
        name={me.name}
        message={me.message}
      />
    </div>
  );
};

export default Home;

