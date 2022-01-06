import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';

const oauthUrl = process.env.NEXT_PUBLIC_OAUTH_HOST;
const clientId = process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID;

function useQuery() {
  // bypasses missing query params on first render
  // from https://github.com/vercel/next.js/issues/8259

  const router = useRouter();
  const query = useRef({});
  // Parse query from URL - this avoids delay in query params by next js router
  useEffect(() => {
    const urlQuery = new URLSearchParams(router.asPath.split('?')[1]);
    Array.from(urlQuery.entries()).forEach(([key, value]) => {
      query.current[key] = value;
    });
  }, [router.asPath]);
  query.current = { ...query.current, ...router.query };
  return query.current;
}

function redirectToLogin() {
  const url = new URL(`${oauthUrl}/login`);
  const redirectUrl = new URL(window.location.href);
  redirectUrl.search = '';

  url.searchParams.append('returnURI', redirectUrl.href);
  url.searchParams.append('client_id', clientId);
  window.location.replace(url);
}

export default function useAuth() {
  const [{ loggedIn, accessToken, profile }, setState] = useState({
    loggedIn: false,
    accessToken: null,
    profile: null,
  });
  const query = useQuery();

  async function exchangeCode() {
    const res = await fetch('/api/exchange-auth-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: query.code,
        redirectUrl: window.location.href,
      }),
    });

    const body = await res.json();

    if (res.status !== 200) {
      redirectToLogin();
      return;
    }

    const { access_token, expires_in } = body;

    localStorage.accessToken = access_token;
    localStorage.tokenExpiresAt = new Date(
      new Date().getTime() + expires_in * 1000.0
    ).toISOString();

    setState(s => ({
      ...s,
      loggedIn: true,
      accessToken: access_token,
    }));
  }

  useEffect(() => {
    if (!loggedIn && localStorage.accessToken) {
      if (new Date(localStorage.tokenExpiresAt) > new Date()) {
        setState(s => ({
          ...s,
          loggedIn: true,
          accessToken: localStorage.accessToken,
        }));

        return;
      }

      delete localStorage.accessToken;
      delete localStorage.tokenExpiresAt;
    }

    if (!loggedIn && query.code) {
      exchangeCode();
    } else if (!loggedIn) {
      redirectToLogin();
    }
  }, [setState]);

  useEffect(() => {
    if (!loggedIn || !accessToken || profile) {
      return;
    }

    async function fetchProfile() {
      const res = await fetch('/api/fetch-profile', {
        method: 'POST',
        body: JSON.stringify({
          accessToken,
        }),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const body = await res.json();

      const profileData = {
        id: body.intUserID,
        email: body.personalEmail,
        dealerNumber: body.primaryintDealerID,
        firstName: body.strFirst,
        lastName: body.strLast,
      };

      setState(s => ({ ...s, profile: profileData }));
    }

    fetchProfile();
  }, [setState, loggedIn, accessToken]);

  return { loggedIn, profile };
}
