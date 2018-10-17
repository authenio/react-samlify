import React from "react";
import ReactDOM from "react-dom";

import { App } from "./components/App";

const root = document.createElement('div');
root.setAttribute('style', 'width: 100%; height: 100%;');
document.body.appendChild(root);

ReactDOM.render(<App />, root);