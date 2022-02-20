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
    lastSeen,
  } = props;

  if (!ClientOnlyPortal) {
    return null;
  }

  return (
    <ClientOnlyPortal selector="#cursor-root">
      <div
        id={`${id}`}
        className={cn(styles.cursor)}
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

        <div className={cn(styles.cursor__body)}>
          <div className={cn(styles.cursor__body__header)}>
            {name}
          </div>

          <div className={cn(styles.cursor__body__message)}>
            {message}
          </div>
        </div>
      </div>
    </ClientOnlyPortal>
  );
}

export default Cursor;
