import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { parse } from 'query-string';
import axios from 'axios';

const LOCALSTORAGE_TOKEN_FIELD = 'auth_token';

type Props = RouteComponentProps & {

};

type Profile = {
  email: string;
}

type State = {
  authenticated: boolean;
  profile: Profile;
}

export class Home extends React.Component<Props, State> {

  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      profile: null
    };
  }

  _initRedirectRequest() {
    window.location.href = '/sso/redirect';
  }

  _initPostRequest() {
    window.location.href = '/sso/post';
  }

  _viewMetadata() {
    window.location.href = '/metadata';
  }

  _logout() {
    window.localStorage.removeItem(LOCALSTORAGE_TOKEN_FIELD);
    this.setState({ authenticated: false, profile: null });
  }

  async getProfile(token) {
    try {
      const { data } = await axios.get<{profile: Profile}>('/profile', { headers: { Authorization: `Bearer ${token}` } });
      this.setState({ authenticated: true, profile: data.profile });
    } catch (e) {
      this.setState({ authenticated: false, profile: null })
      window.localStorage.removeItem(LOCALSTORAGE_TOKEN_FIELD);
    }
  }

  componentWillMount() {
    this.init();
  }

  async init() {
    const token = window.localStorage.getItem(LOCALSTORAGE_TOKEN_FIELD);
    // if the token is already stored in localstoarge, call the service to verify if it's expired
    // if anything wrong, go back to the login scene
    if (token) {
      // verify the current auth token
      return await this.getProfile(token);
    }
    // this section
    const params = parse(this.props.location.search);
    if (params.auth_token) {
      window.localStorage.setItem(LOCALSTORAGE_TOKEN_FIELD, params.auth_token);
      await this.getProfile(params.auth_token);
      // remove the auth_token part in 
      this.props.history.replace('/');
    }
    // initial state
  }

  render() {
    if (!this.state.authenticated) {
      return (
        <React.Fragment>
          <button onClick={() => this._initRedirectRequest()}>Okta SSO Login - redirect</button>
          <button onClick={() => this._initPostRequest()}>Okta SSO Login - post</button>
          <button onClick={() => this._viewMetadata()}>Metadata</button>
        </React.Fragment>
      );
    }
    {
      /** render screen after login in */
    }
    return <>
      Welcome <b>{this.state.profile.email}</b>
      <button onClick={() => this._logout()}>Logout</button>
    </>
  }

}
