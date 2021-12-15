import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter,BrowserRouter } from 'react-router-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@progress/kendo-theme-default/dist/all.css';
import '@progress/kendo-theme-bootstrap/dist/all.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './assets/styles/floating-label.css';
import './assets/styles/lims-global-theme.css';
// import './assets/styles/fontello.css';
import store from './store';

import App from './components/App.js';
import * as serviceWorker from './serviceWorker';
import {
  StylesProvider,
  createGenerateClassName,
} from '@material-ui/core/styles';

// const generateClassName = createGenerateClassName({
//   productionPrefix: 'Container',
// });

ReactDOM.render(
  //  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter >
      {/* <StylesProvider generateClassName={generateClassName}> */}
        <App />
        {/* </StylesProvider> */}
      </BrowserRouter>
    </Provider>
  // </React.StrictMode>
,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
