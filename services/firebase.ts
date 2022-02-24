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
  get,
  remove,
} from 'firebase/database';
import {utcToZonedTime} from 'date-fns-tz';
import {millisecondsToSeconds} from 'date-fns';
import {IUser} from '../state/lobby/types';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
};

const pathPrefix = process.env.NEXT_PUBLIC_ENV || '';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const refs: Record<string, DatabaseReference> = {};

const composePath = (targetPath: string) => `${pathPrefix}/${targetPath}`;

const removeListener = (targetPath: string) => {
  const path = composePath(targetPath);

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

const prepareListener = (targetPath: string) => {
  const path = composePath(targetPath);
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
  const path = composePath(`users/${user.id}`);
  const userRef = ref(db, path);
  set(userRef, user);
};

//
const updateUser = (userId: string, userFields: Partial<IUser>): void => {
  const path = composePath(`users/${userId}`);
  const userRef = ref(db, path);
  update(userRef, userFields);
};

//
const deleteInactiveUsers = async () => {
  const path = composePath('users');
  const usersRef = ref(db, path);
  const timeZone = new Intl.DateTimeFormat().resolvedOptions().timeZone;

  let snapshot: DataSnapshot | undefined;
  try {
    snapshot = await get(usersRef);

    Object.values(snapshot.val()).forEach((data) => {
      const user = data as IUser;
      const zonedTime = utcToZonedTime(user.lastSeen, timeZone);
      const timeSince = millisecondsToSeconds(
        Date.now() - new Date(zonedTime).getTime(),
      );

      if (timeSince > 30) {
        remove(ref(db, composePath(`users/${user.id}`)));
      }
    });
  } catch (e) {}
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
  listenForUserDeletion,
  registerUser,
  updateUser,
  deleteInactiveUsers,
  /* remove listeners */
  removeAllListeners,
  removeAllUsersListener,
  removeSingleUserListener,
};
