import {Html, Head, Main, NextScript} from 'next/document';

/**
 * Used to modify <body /> and <head />
 * @return {JSX.Element}
 */
export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <div id="cursor-root" />
        <NextScript />
      </body>
    </Html>
  );
}
