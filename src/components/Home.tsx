import React, { useState, useEffect, ReactNode } from 'react';
import { RouteComponentProps } from 'react-router';
import { parse } from 'query-string';
import axios from 'axios';

import './index.css';

const LOCALSTORAGE_TOKEN_FIELD = 'auth_token';

type Props = RouteComponentProps & {};

type Profile = {
  email: string;
}

type SamlOption = {
  encrypted: boolean;
};

const Container = (props: { children: ReactNode }) => {
  return (
    <div className="vh-100 system-sans-serif flex flex-column items-center justify-center"> 
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
  const [samlOption, setSamlOption] = useState<SamlOption>({ encrypted: true });

  const parseQuery = (idp) => {
    let params = [];

    if (samlOption.encrypted) {
      params = params.concat('encrypted=true');
    }

    if (idp) {
      params = params.concat(`idp=${idp}`);
    }

    if (params.length > 0) {
      return '?' + params.join('&');
    }
    
    return '';
  };

  const initRedirectRequest = (idp) => {
    window.location.href = `/sso/redirect${parseQuery(idp)}`;
  };

  const initPostRequest = (idp) => {
    window.location.href = `/sso/post${parseQuery(idp)}`;
  };

  const viewSpMetadata = (idp) => {
    window.open(`/sp/metadata${parseQuery(idp)}`);
  };

  const viewIdpMetadata = (idp) => {
    window.open(`/idp/metadata${parseQuery(idp)}`);
  };

  const logout = () => {
    window.localStorage.removeItem(LOCALSTORAGE_TOKEN_FIELD);
    setAuthenticated(false);
    setProfile({ email: null });
  }

  // initialize single logout from sp side
  const singleLogoutRedirect = (idp) => {
    window.location.href = `/sp/single_logout/redirect${parseQuery(idp)}`;
  };

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

  const toggleEncrypted = () => {
    setSamlOption({
      ...samlOption,
      encrypted: !samlOption.encrypted
    })
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
        <div className="">
          <div className="b mv2">OPENAM</div>
          <div>
            <Button onClick={() => viewSpMetadata('openam')}>SP Metadata</Button>
            <Button onClick={() => viewIdpMetadata('openam')}>OpenAM Metadata</Button>
            <Button onClick={() => initRedirectRequest('openam')}>OpenAM Redirect</Button>
            <Button onClick={() => initPostRequest('openam')}>OpenAM POST</Button>
          </div>
          <div className="b mv2">Okta</div>
          <div>
            <Button onClick={() => viewSpMetadata('okta')}>SP Metadata</Button>
            <Button onClick={() => viewIdpMetadata('okta')}>Okta Metadata</Button>
            <Button onClick={() => initRedirectRequest('okta')}>Okta Redirect</Button>
            <Button onClick={() => initPostRequest('okta')}>Okta POST</Button>
          </div>
        </div>
        <div className="mt5">
          <label className="cb-container f6 silver flex">
            <span className="b">Encrypted</span>
            <input
              type="checkbox"
              defaultChecked={samlOption.encrypted}
              onClick={() => toggleEncrypted()}
            />
            <span className="checkmark"></span>
          </label> 
        </div>
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
      <Button onClick={() => singleLogoutRedirect('okta')}>Single Logout (Redirect)</Button>
    </div>
  </Container>

}
