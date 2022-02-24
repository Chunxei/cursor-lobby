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
    onNameChange,
    onMessageChange,
    onType,
    role,
    color,
    mine = false,
  } = props;

  const messageRef = useRef<HTMLDivElement | null>(null);
  const nameRef = useRef<HTMLDivElement | null>(null);

  const [messageText, setMessageText] = useState<string>(message);
  const [nameText, setNameText] = useState<string>(name);

  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [isNameVisible, setIsNameVisible] = useState(false);

  const [escapePressed, setEscapePressed] = useState(false);

  const handleKeyPress = (event: KeyboardEvent) => {
    /* Don't insert a new line when publishing */
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (!messageRef.current || !nameRef.current) return;

    /* check if the message box is the element with focus */
    if (document.activeElement === messageRef.current) {
      /* Publishing happens when the message input is blurred */
      /* Reserve Shift+Enter for new line */
      if (event.key === 'Enter' && !event.shiftKey) {
        messageRef.current.blur();
      } else if (event.key === 'Escape') {
        /* Triggers a useEffect that blurs the message input*/
        setEscapePressed(true);
      } else {
        /* update messageText with current text content of message input */
        setMessageText(messageRef.current.textContent || '');
      }
      //
    } else if (document.activeElement === nameRef.current) {
      /* Publishing happens when the name input is blurred */
      if (event.key === 'Enter') {
        nameRef.current.blur();
      } else if (event.key === 'Escape') {
        /* Triggers a useEffect that blurs the name input*/
        setEscapePressed(true);
      } else {
        /* update nameText with current text content of name input */
        setNameText(nameRef.current.textContent || '');
      }
    } else if (event.key === '/') {
      /* Name input blurred, so give it focus */
      nameRef.current.focus();
      setIsNameVisible(true);
    } else {
      /* Message input blurred, so give it focus */
      messageRef.current.focus();
      setIsMessageVisible(true);
    }
  };

  const handleBlur = () => {
    if (!escapePressed) {
      if (onNameChange) {/* publish name text */
        onNameChange(nameText);
      }

      if (onMessageChange) {/* publish message text */
        onMessageChange(messageText);
      }
    }

    if (!nameText.length) {
      setIsNameVisible(false);
    }

    if (!messageText.length) {
      setIsMessageVisible(false);
    }

    if (onType) {
      onType(false);
    }

    setEscapePressed(false);
  };

  const handleFocus = () => {
    if (onType) {
      onType(true);
    }
  };

  useEffect(() => {
    if (!mine && messageRef.current) {
      if (isTyping) {
        messageRef.current.textContent = 'Typing...';
        setIsMessageVisible(true);
      } else {
        messageRef.current.textContent = message;
        setIsMessageVisible(message.length > 0);
      }
    }
  }, [isTyping, messageRef.current]);

  useEffect(() => {
    /* if escapePressed === true, then document.activeElement
    is one of the inputs */
    if (escapePressed && document.activeElement) {
      (document.activeElement as HTMLDivElement).blur();
    }
  }, [escapePressed]);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.textContent = message;
      setMessageText(message);

      if (message.length) {
        setIsMessageVisible(true);
      }
    }
  }, [message, messageRef.current]);

  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.textContent = name;
      setNameText(name);

      if (name.length) {
        setIsNameVisible(true);
      }
    }
  }, [name, nameRef.current]);

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
            <div
              ref={nameRef}
              role={mine ? 'textbox' : 'region'}
              onBlur={handleBlur}
              onFocus={handleFocus}
              className={cn(styles.cursor__text__header__name, {
                [styles.visible]: isNameVisible,
              })}
              style={{
                background: color,
                outlineColor: color,
              }}
              contentEditable={mine}
            />

            {role && (
              <div className={cn(styles.cursor__text__header__role)}>
                {role}
              </div>
            )}
          </div>

          <div
            ref={messageRef}
            role={mine ? 'textbox' : 'region'}
            onBlur={handleBlur}
            onFocus={handleFocus}
            className={cn(styles.cursor__text__message, {
              [styles.visible]: isMessageVisible,
              [styles.exceededTextLimit]: 120 - messageText.length < 0,
              [styles.unpublishedChanges]: message !== messageText ||
                name !== nameText,
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
