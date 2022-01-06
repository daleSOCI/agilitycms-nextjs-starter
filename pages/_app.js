import '../styles/globals.scss';

import useAuth from '../utils/hooks/useAuth';

function MyApp({ Component, pageProps }) {
  
  const { loggedIn } = useAuth();

  return ( 
    <>
      {loggedIn && <Component {...pageProps} />}
      {!loggedIn && 'Redirecting to login page...'}
    </>
  );
}

export default MyApp
