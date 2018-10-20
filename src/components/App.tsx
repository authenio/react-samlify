import * as React from 'react';
import axios from 'axios';

type Props = {
};

type State = {
  authenticated: boolean;
}

export class App extends React.PureComponent<Props, State> {

  constructor(props) {
    super(props);
    this.state = {
      authenticated: false
    };
  }

  componentWillMount() {

  }

  render() {
    return (
      <React.Fragment>
        <div>
          {
            // if not logged in
          }
          {
            !this.state.authenticated && <>
              <input type="email" placeholder="Enter email" />
              <input type="password" autoComplete="new-password" placeholder="Enter password" />
              <button onClick={() => null}>Login</button>
              <div>
                <button onClick={() => null}>SSO Login - redirect</button>
                <button onClick={() => null}>SSO Login - post</button>
              </div>
            </>
          }
          {
            // logged in
          }
          {
            this.state.authenticated && <>
              Successfully Log in!
              <button onClick={() => null}>Logout</button>
            </>
          }
        </div>
      </React.Fragment>
    );
  }

}
