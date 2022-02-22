import {NextPage} from 'next';
import {useRouter} from 'next/router';
import React, {useEffect} from 'react';

/**
 * 404 page
 * @return {NextPage}
 */
const Page404: NextPage = (): JSX.Element => {
  const router = useRouter();
  useEffect(() => {
    router.replace('/');
  }, []);
  return <></>;
};

export default Page404;
