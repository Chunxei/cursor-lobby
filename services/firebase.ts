// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {
  DatabaseReference,
  DataSnapshot,
  getDatabase,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  ref,
  set,
  update,
  off,
} from 'firebase/database';
import {IUser} from '../state/lobby/types';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBkN1qcEFHtwT2KcB4mPWmqwrnyFOlbfSE',
  authDomain: 'cursor-lobby.firebaseapp.com',
  databaseURL: 'https://cursor-lobby-default-rtdb.firebaseio.com',
  projectId: 'cursor-lobby',
  storageBucket: 'cursor-lobby.appspot.com',
  messagingSenderId: '349786130425',
  appId: '1:349786130425:web:28be6bc64d283a45c7df28',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const refs: Record<string, DatabaseReference> = {};

const removeListener = (path: string) => {
  if (path in refs) {
    off(refs[path]);
    delete refs[path];
  }
};

const prepareListener = (path: string) => {
  let pathRef = refs[path];

  if (!pathRef) {
    pathRef = ref(db, path);
    refs[path] = pathRef;
  }

  return {
    path,
    ref: pathRef,
    exists() {
      return path in refs;
    },
    remove() {
      removeListener(path);
    },
  };
};

const listenForLobbiesUpdates = (
    callback: (
      lobbyId: string,
      userData: Omit<IUser, 'id'>,
    ) => any,
) => {
  //
  const handler = (snapshot: DataSnapshot) => {
    const data = snapshot.val();
    const id = snapshot.key;

    console.log('[LOBBIES]:', id, data);

    if (id && data) {
      callback(id, data);
    }
  };

  const listener = ref(db, 'lobbies');

  onChildAdded(listener.ref, handler);
  onChildChanged(listener.ref, handler);
};

const listenForUsersUpdates = (
    callback: (
      userId: string,
      userData: Omit<IUser, 'id'>,
    ) => any,
) => {
  //
  const handler = (snapshot: DataSnapshot) => {
    const data = snapshot.val();
    const id = snapshot.key;

    if (id && data) {
      callback(id, data);
    }
  };

  const listener = prepareListener('users');
  onChildAdded(listener.ref, handler);
  onChildChanged(listener.ref, handler);
};

const listenForUsersDeletion = (callback: (userId: string) => any) => {
  const listener = prepareListener('users');

  onChildRemoved(listener.ref, (snapshot) => {
    const id = snapshot.key;
    if (id) {
      callback(id);
    }
  });
};

const registerUser = (user: IUser) => {
  const listener = prepareListener(`users/${user.id}`);
  const userCopy: Partial<IUser> = {...user};
  delete userCopy.id;
  set(listener.ref, userCopy);
};

const updateUser = (userId: string, userFields: Partial<IUser>): void => {
  const listener = prepareListener(`users/${userId}`);

  update(listener.ref, userFields);
};

export const firebaseService = {
  listenForLobbiesUpdates,
  listenForUsersUpdates,
  listenForUsersDeletion,
  registerUser,
  updateUser,
};
