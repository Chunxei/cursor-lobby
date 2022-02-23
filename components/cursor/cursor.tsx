import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import styles from './cursor.module.scss';
import cn from 'classnames';
import {ICursorProps} from './types';
import {ClientOnlyPortal} from '../../portals';
// import CursorIcon from '../../public/cursors/cursor-0.svg';
import CursorIcon from '../svgs/cursor-icon';

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
    isTyping,
    onMessageChange,
    onType,
    role,
    color,
    mine = false,
  } = props;

  const messageRef = useRef<HTMLDivElement | null>(null);
  const [messageText, setMessageText] = useState<string>(message);
  const [isMessageBoxVisible, setIsMessageBoxVisible] = useState(false);
  const [escapePressed, setEscapePressed] = useState(false);

  const handleKeyPress = (event: KeyboardEvent) => {
    /* Don't insert a new line when publishing message */
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (!messageRef.current) return;

    /* check if the message box is the element with focus */
    if (document.activeElement === messageRef.current) {
      /* If key is Enter, publish message and blur.
      Reserve Shift+Enter for new line */
      if (event.key === 'Enter' && !event.shiftKey) {
        messageRef.current.blur();
      } else if (event.key === 'Escape') {
        /* Undo changes and blur if escape key is pressed */
        setEscapePressed(true);
      } else {/* update messageText with current text content of message box */
        setMessageText(messageRef.current.textContent || '');
      }
      //
    } else {/* message box blurred, so give it focus */
      messageRef.current.focus();
      setIsMessageBoxVisible(true);
    }
  };

  const handleMessageBoxBlur = () => {
    if (onMessageChange && !escapePressed) {/* publish message text */
      onMessageChange(messageText);
    }

    if (!messageText.length) {
      setIsMessageBoxVisible(false);
    }

    if (onType) {
      onType(false);
    }

    setEscapePressed(false);
  };

  const handleMessageBoxFocus = () => {
    if (onType) {
      onType(true);
    }
  };

  useEffect(() => {
    if (!mine && messageRef.current) {
      if (isTyping) {
        messageRef.current.textContent = 'Typing...';
      } else {
        messageRef.current.textContent = message;
      }
    }
  }, [isTyping, messageRef.current]);

  useEffect(() => {
    if (escapePressed && messageRef.current) {
      messageRef.current.blur();
    }
  }, [escapePressed]);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.textContent = message;
      setMessageText(message);

      if (message.length) {
        setIsMessageBoxVisible(true);
      }
    }
  }, [message, messageRef.current]);

  useEffect(() => {
    if (mine) {
      document.addEventListener('keypress', handleKeyPress);
      document.addEventListener('keyup', handleKeyUp);
    }

    return () => {
      document.removeEventListener('keypress', handleKeyPress);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // if (!ClientOnlyPortal) {
  //   return null;
  // }

  return (
    <ClientOnlyPortal selector="#cursor-root">
      <div
        id={id}
        className={cn(styles.cursor, {
          [styles.mine]: mine,
        })}
        style={{transform: `translate(${x + 5}px, ${y + 5}px)`}}
        role="tooltip"
        aria-label="cursor tooltip"
      >
        <div className={cn(styles.cursor__pointer)}>
          <CursorIcon
            className={cn(styles.cursor__pointer__icon)}
            color={color}
          />
        </div>

        <div className={cn(styles.cursor__text)} data-role="host">
          <div className={cn(styles.cursor__text__header)}>
            {name && (
              <div
                className={cn(styles.cursor__text__header__name)}
                style={{background: color}}
              >
                {name}
              </div>
            )}

            {role && (
              <div className={cn(styles.cursor__text__header__role)}>
                {role}
              </div>
            )}
          </div>

          <div
            role={mine ? 'textbox' : 'region'}
            aria-label="Message text"
            id={id + '-message'}
            ref={messageRef}
            onBlur={handleMessageBoxBlur}
            onFocus={handleMessageBoxFocus}
            className={cn(styles.cursor__text__message, {
              [styles.visible]: isMessageBoxVisible,
              [styles.exceededTextLimit]: 120 - messageText.length < 0,
              [styles.unpublishedChanges]: message !== messageText,
              [styles.typing]: !mine && isTyping,
            })}
            style={{
              borderColor: color,
              outlineColor: color,
            }}
            data-chars-remaining={120 - messageText.length}
            contentEditable={mine}
          />
        </div>
      </div>
    </ClientOnlyPortal>
  );
}

export default Cursor;
