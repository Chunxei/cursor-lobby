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
  onValue,
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

const removeAllListeners = () => {
  Object.entries(refs).forEach(([path, pathRef]) => {
    removeListener(path);
  });
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

/* USERS FUNCTIONS */
//
const listenForAllUsersUpdates = (callback: (userData: IUser) => any) => {
  //
  const handler = (snapshot: DataSnapshot) => {
    const data = snapshot.val();
    if (data) {
      callback(data);
    }
  };

  const listener = prepareListener('users');
  onChildAdded(listener.ref, handler);
  onChildChanged(listener.ref, handler);
};

//
const listenForSingleUserUpdates = (
  userId: string,
  callback: (userData: IUser) => any,
) => {
  const path = `users/${userId}`;

  if (path in refs) {
    return;
  }

  const listener = prepareListener(path);

  onValue(listener.ref, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      callback(data);
    }
  });
};

const listenForUserDeletion = (callback: (userId: string) => any) => {
  const listener = prepareListener('users');

  onChildRemoved(listener.ref, (snapshot) => {
    const id = snapshot.key;
    if (id) {
      removeSingleUserListener(id);
      callback(id);
    }
  });
};

//
const registerUser = (user: IUser) => {
  const userRef = ref(db, `users/${user.id}`);
  set(userRef, user);
};

//
const updateUser = (userId: string, userFields: Partial<IUser>): void => {
  const userRef = ref(db, `users/${userId}`);
  update(userRef, userFields);
};

/* REMOVE LISTENERS */
//
const removeAllUsersListener = (userId: string) => {
  removeListener('users');
};

//
const removeSingleUserListener = (userId: string) => {
  removeListener(`users/${userId}`);
};


export const firebaseService = {
  /* users */
  listenForAllUsersUpdates,
  listenForSingleUserUpdates,
  listenForUserDeletion,
  registerUser,
  updateUser,
  /* remove listeners */
  removeAllListeners,
  removeAllUsersListener,
  removeSingleUserListener,
};
