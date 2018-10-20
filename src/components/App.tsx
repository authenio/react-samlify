import * as React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Home } from './Home';

export class App extends React.PureComponent {
  render() {
    return (
      <Router>
        <Route path="/" component={Home} />
      </Router>
    );
  }
}