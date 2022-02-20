import {useEffect, useRef} from 'react';
import ReactDOM from 'react-dom';

interface IPortalProps {
  selector: string
  children: React.ReactNode
}

/**
 * Client-side portal
 * @param {IPortalProps} props
 * @return {React.ReactPortal | null}
 */
function ClientOnlyPortal(props: IPortalProps): JSX.Element | null {
  const {children, selector} = props;

  const rootElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    rootElementRef.current = document.querySelector(selector);
  }, [selector]);

  return rootElementRef?.current ?
    ReactDOM.createPortal(children, rootElementRef.current) :
    null;
};

export default ClientOnlyPortal;
