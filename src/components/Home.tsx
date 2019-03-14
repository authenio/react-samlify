import React, { useState, useEffect, ReactNode } from 'react';
import { RouteComponentProps } from 'react-router';
import { parse } from 'query-string';
import axios from 'axios';

const LOCALSTORAGE_TOKEN_FIELD = 'auth_token';

type Props = RouteComponentProps & {};

type Profile = {
  email: string;
}

const Container = (props: { children: ReactNode }) => {
  return (
    <div className="flex items-center justify-center vh-100 system-sans-serif"> 
      {props.children}
    </div>
  )
};

const Button = (props: { children: ReactNode; onClick: Function; }) => {
  return (
    <button
      style={{ border: '1px solid #aaa' }}
      className="pa3 bg-transparent ma2 br3 f6 silver-gray outline-0 pointer"
      onClick={() => props.onClick()}
    >
      {props.children}
    </button>
  );
};

export function Home(props: Props) {

  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile>({ email: null });

  const initRedirectRequest = () => {
    window.location.href = '/sso/redirect';
  };

  const initPostRequest = () => {
    window.location.href = '/sso/post';
  };

  const viewMetadata = () => {
    window.location.href = '/metadata';
  };

  const logout = () => {
    window.localStorage.removeItem(LOCALSTORAGE_TOKEN_FIELD);
    setAuthenticated(false);
    setProfile({ email: null });
  }

  const getProfile = async (token: string) => {
    try {
      const { data } = await axios.get<{profile: Profile}>('/profile', { headers: { Authorization: `Bearer ${token}` } });
      setAuthenticated(true);
      setProfile(data.profile);
    } catch (e) {
      setAuthenticated(false);
      setProfile({ email: null });
      window.localStorage.removeItem(LOCALSTORAGE_TOKEN_FIELD);
    }
  };

  const init = async () => {
    const token = window.localStorage.getItem(LOCALSTORAGE_TOKEN_FIELD);
    // if the token is already stored in localstoarge, call the service to verify if it's expired
    // if anything wrong, go back to the login scene
    if (token) {
      // verify the current auth token
      return await getProfile(token);
    }
    // this section
    const params = parse(props.location.search);
    if (params.auth_token) {
      window.localStorage.setItem(LOCALSTORAGE_TOKEN_FIELD, params.auth_token);
      await getProfile(params.auth_token);
      // remove the auth_token part in 
      props.history.replace('/');
    }
    // initial state
  };

  useEffect(() => {
    init();
    return () => null;
  }, [])

  if (!authenticated) {
    return (
      <Container>
        <Button onClick={() => initRedirectRequest()}>
          Okta - redirect
        </Button>
        <Button onClick={() => initPostRequest()}>
          Okta - post
        </Button>
        <Button onClick={() => viewMetadata()}>
          Metadata
        </Button>
      </Container>
    );
  }
  {
    /** render screen after login in */
  }
  return <Container>
    <div className="flex flex-column">
      <span className="mb3">Welcome back <b>{profile.email}</b></span>
      <Button onClick={() => logout()}>Logout</Button>
    </div>
  </Container>

}
