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
    let userId = localStorage.getItem('CURSOR_LOBBY_USER_ID');

    if (!userId) {
      userId = uuid();
      localStorage.setItem('CURSOR_LOBBY_USER_ID', userId);
    }

    dispatch(lobbyActions.registerCurrentUser({...me, id: userId}));
    firebaseService.listenForAllUsersUpdates(onUserDataUpdate);
    firebaseService.listenForUserDeletion(onUserDataRemoval);
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

  const updateCurrentUser = () => {
    const updatedUserFields: Partial<IUser> = {
      lastSeen: new Date().toISOString(),
      /* reduce precision to boost performance */
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
        // role={lobby.hostId === me.id ? 'Host' : ''}
        mine
      />

      {Object.entries(users)
        .map(([memberId, isMemberActive]) => {
          if (memberId === me.id || !isMemberActive || !(memberId in users)) {
            return null;
          }

          const member = users[memberId];

          return (
            <Cursor
              key={'remote-' + memberId}
              id={'remote-' + memberId}
              x={member.x * window.innerWidth}
              y={member.y * window.innerHeight}
              name={member.name}
              message={member.message}
              // role={lobby.hostId === memberId ? 'Host' : ''}
            />
          );
        })
      }
    </>
  );
}

export default CursorHost;
