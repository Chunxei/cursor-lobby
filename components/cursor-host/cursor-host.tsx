import React, {useEffect, useState} from 'react';
import {v4 as uuid} from 'uuid';
import {Cursor} from '../cursor';
import useCursorPosition from '../../hooks/useCursorPosition';
import {firebaseService} from '../../services/firebase';
import {lobbyActions} from '../../state/lobby/actions';
import {
  useLobbyDispatchContext,
  useLobbyStateContext,
} from '../../state/lobby/provider';
import {IUser} from '../../state/lobby/types';
import CursorList from '../cursor-list/cursor-list';

/**
 * Renders all the cursors
 * @return {JSX.Element}
 */
function CursorHost(): JSX.Element {
  const {me} = useLobbyStateContext();
  const dispatch = useLobbyDispatchContext();
  const {x, y} = useCursorPosition();
  const [users, setUsers] = useState<Record<string, IUser>>({});

  const init = () => {
    const name = localStorage.getItem('CURSOR_LOBBY_USER_NAME') || me.name;
    let userId = localStorage.getItem('CURSOR_LOBBY_USER_ID');

    if (!userId) {
      userId = uuid();
      localStorage.setItem('CURSOR_LOBBY_USER_ID', userId);
    }

    dispatch(lobbyActions.registerCurrentUser({
      ...me,
      id: userId,
      name,
    }));
    firebaseService.listenForAllUsersUpdates(onUserDataUpdate);
    firebaseService.listenForUserDeletion(onUserDataRemoval);
    firebaseService.deleteInactiveUsers();
  };

  const onUserDataUpdate = (user: IUser) => {
    setUsers((prevState) => ({
      ...prevState,
      [user.id]: user,
    }));
  };

  const onUserDataRemoval = (userId: string) => {
    setUsers((prevState) => {
      const newState = {...prevState};

      if (userId in newState) {
        delete newState[userId];
      }

      return newState;
    });
  };

  const updateCurrentUser = (fields: Partial<IUser>) => {
    if (me.id) {
      const updatedUserFields: Partial<IUser> = me.id in users ? {
        lastSeen: new Date().toISOString(),
        ...fields,
      } : me;

      dispatch(lobbyActions.updateCurrentUser(me.id, updatedUserFields));
    }
  };

  const updateCurrentUserName = (name: string) => {
    const truncatedName = name.substring(0, 50);
    localStorage.setItem('CURSOR_LOBBY_USER_NAME', truncatedName);
    updateCurrentUser({name: truncatedName});
  };

  useEffect(() => {
    updateCurrentUser({
      /* reduce precision to boost performance */
      x: +(x / window.innerWidth).toFixed(3),
      y: +(y / window.innerHeight).toFixed(3),
    });
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
        name={users[me.id]?.name || me.name}
        message={users[me.id]?.message || me.message}
        onType={(typing) => updateCurrentUser({typing})}
        onNameChange={updateCurrentUserName}
        onMessageChange={(message) => {
          updateCurrentUser({message: message.substring(0, 120)});
        }}
        color={users[me.id]?.color || me.color}
        mine
      />

      {me.id && (
        <CursorList
          users={users}
          excludeIds={[me.id]}
        />
      )}
    </>
  );
}

export default CursorHost;
