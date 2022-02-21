import React, {useEffect, useState} from 'react';
import {v4 as uuid} from 'uuid';
import {Cursor} from '../cursor';
import useCursorPosition from '../../hooks/useCursorPosition';
import {firebaseService} from '../../services/firebase';
import {lobbyActions} from '../../state/lobby/actions';
import {useLobbyContext} from '../../state/lobby/provider';
import {IUser} from '../../state/lobby/types';

/**
 * Renders all the cursors
 * @return {JSX.Element}
 */
function CursorHost(): JSX.Element {
  const {
    state: {
      me,
    },
    dispatch,
  } = useLobbyContext();
  const {x, y} = useCursorPosition();

  const [users, setUsers] = useState<Record<string, Omit<IUser, 'id'>>>({});

  const init = () => {
    let userId = localStorage.getItem('CURSOR_LOBBY_USER_ID');

    if (!userId) {
      userId = uuid();
      localStorage.setItem('CURSOR_LOBBY_USER_ID', userId);
    }

    firebaseService.listenForUsersUpdates(updateUserData);
    firebaseService.listenForUsersDeletion(removeUserData);
    dispatch(lobbyActions.registerCurrentUser({...me, id: userId}));
  };

  const updateUserData = (userId: string, userData: Omit<IUser, 'id'>) => {
    if (userId === me.id) {
      return;
    }

    setUsers((prevState) => ({
      ...prevState,
      [userId]: userData,
    }));
  };

  const removeUserData = (userId: string) => {
    setUsers((prevState) => {
      const newState = {...prevState};

      if (userId in newState) {
        delete newState[userId];
      }

      return newState;
    });
  };


  const updateCurrentUser = () => {
    const updatedUserFields: Partial<IUser> = {
      /* reduce precision to boost performance */
      lastSeen: new Date().toISOString(),
      x: +(x / window.innerWidth).toFixed(3),
      y: +(y / window.innerHeight).toFixed(3),
    };

    if (me.id) {
      dispatch(lobbyActions.updateCurrentUser(me.id, updatedUserFields));
    }
  };

  useEffect(() => {
    updateCurrentUser();
  }, [x, y]);

  useEffect(() => {
    init();
  }, []);
  return (
    <>
      <Cursor
        id={'local-' + me.id}
        x={x}
        y={y}
        name={me.name}
        message={me.message}
        role="Ewu"
        mine
      />

      {Object.entries(users).map(([userId, userData]) => {
        if (userId === me.id) {
          return null;
        }

        return (
          <Cursor
            key={'remote-' + userId}
            id={'remote-' + userId}
            x={userData.x * window.innerWidth}
            y={userData.y * window.innerHeight}
            name={userData.name}
            message={userData.message}
          />
        );
      })}
    </>
  );
}

export default CursorHost;
