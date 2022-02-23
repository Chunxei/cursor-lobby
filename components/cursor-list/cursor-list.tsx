import {millisecondsToSeconds} from 'date-fns';
import {utcToZonedTime} from 'date-fns-tz';
import React from 'react';
import {Cursor} from '../cursor';
import {ICursorListProps} from './types';

/**
 * Renders multiple cursors
 * @param {ICursorListProps} props
 * @return {JSX.Element}
 */
function CursorList(props: ICursorListProps): JSX.Element {
  const {
    users,
    excludeIds,
    // hostId,
  } = props;

  const convertLastSeenToLocaleSeconds = (lastSeen: string) => {
    const timeZone = new Intl.DateTimeFormat().resolvedOptions().timeZone;
    const zonedTime = utcToZonedTime(lastSeen, timeZone);
    return millisecondsToSeconds(Date.now() - new Date(zonedTime).getTime());
  };

  return (
    <>
      {Object.values(users)
        .map((user) => {
          if (excludeIds.includes(user.id) || !user ||
            convertLastSeenToLocaleSeconds(user.lastSeen) > 20) {
            return null;
          }

          return (
            <Cursor
              key={'remote-' + user.id}
              id={'remote-' + user.id}
              x={user.x * window.innerWidth}
              y={user.y * window.innerHeight}
              name={user.name}
              message={user.message}
              isTyping={user.typing}
              color={user.color}
              // role={hostId === user.id ? 'Host' : ''}
            />
          );
        })}
    </>
  );
}

export default CursorList;
