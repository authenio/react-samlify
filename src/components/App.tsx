import * as React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Home } from './Home';
import { Logout } from './Logout';
import { Helmet } from "react-helmet";

export class App extends React.PureComponent {
  render() {
    return (
      <React.Fragment>
        <Helmet>
          <title>react-samlify</title> 
          <link rel="stylesheet" href="https://unpkg.com/tachyons@4.10.0/css/tachyons.min.css"/>
        </Helmet>
        <Router>
          <Route path="/" component={Home} />
        </Router>
        <Router>
          <Route path="/logout" component={Logout} />
        </Router>
      </React.Fragment>
    );
  }
}