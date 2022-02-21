import React from 'react';
import styles from './cursor.module.scss';
import Image from 'next/image';
import cn from 'classnames';
import {ICursorProps} from './types';
import {ClientOnlyPortal} from '../../portals';

/**
 * Custom cursor
 * @param {ICursorProps} props - Cursor properties
 * @return {JSX.Element}
 */
function Cursor(props: ICursorProps): JSX.Element | null {
  const {
    id,
    x,
    y,
    name,
    message,
    // lastSeen,
    role,
    mine = false,
  } = props;

  if (!ClientOnlyPortal) {
    return null;
  }

  return (
    <ClientOnlyPortal selector="#cursor-root">
      <div
        id={`${id}`}
        className={cn(styles.cursor, {
          [styles.mine]: mine,
        })}
        style={{transform: `translate(${x + 5}px, ${y + 5}px)`}}
        role="tooltip"
        aria-label="cursor tooltip"
      >
        <div className={cn(styles.cursor__pointer)}>
          <Image
            src="/cursors/cursor-0.png"
            width={18}
            height={25}
            alt="cursor"
          />
        </div>

        <div className={cn(styles.cursor__text)} data-role="host">
          <div className={cn(styles.cursor__text__header)}>
            <div className={cn(styles.cursor__text__header__name)}>
              {name}
            </div>

            {role && (
              <div className={cn(styles.cursor__text__header__role)}>
                {role}
              </div>
            )}
          </div>

          { message && (
            <div className={cn(styles.cursor__text__message)}>
              {message}
            </div>
          )}
        </div>
      </div>
    </ClientOnlyPortal>
  );
}

export default Cursor;
