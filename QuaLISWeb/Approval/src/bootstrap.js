import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
//import { HashRouter } from 'react-router-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@progress/kendo-theme-default/dist/all.css';
import '@progress/kendo-theme-bootstrap/dist/all.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './assets/styles/floating-label.css';
import './assets/styles/lims-global-theme.css';
import store from './store';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import { createMemoryHistory, createBrowserHistory } from 'history';
import {  Router } from 'react-router-dom';
//import {parentToChild} from './actions/LoginAction'

const mount = (el, { onNavigate, defaultHistory, initialPath },Login,parent) => {
  console.log('childapp')
  const history =
    defaultHistory ||
    createMemoryHistory({
      initialEntries: [initialPath],
    });
    console.log('reg',onNavigate)
  if (onNavigate) {
    history.listen(onNavigate);
  }
  console.log('parentstoredata',Login)
  if(Login){
    console.log('parentstoredata',Login)
  //  props.parentToChild(Login);
  }

  ReactDOM.render(<Provider store={store}>
    {/* <HashRouter > */}
    {/* <StylesProvider generateClassName={generateClassName}> */}
      <Router history={history}>
      <App  parent={parent}  parentdata={Login} history={history} />
      </Router>
    {/* </StylesProvider> */}
    {/* </HashRouter> */}
  </Provider>, el);
  return {
    onParentNavigate({ pathname: nextPathname }) {
      const { pathname } = history.location;
      console.log('childpathname',pathname)
      console.log('childnextpathname',nextPathname)
      if (pathname !== nextPathname) {
        history.push(nextPathname);
      }
    },
  };
};

// If we are in development and in isolation,
// call mount immediately
if (process.env.NODE_ENV === 'development') {
  const devRoot = document.querySelector('#approval');
  console.log(devRoot,'success')
console.log(process.env.NODE_ENV)
  if (devRoot) {
    console.log('success')
    mount(devRoot, { defaultHistory: createBrowserHistory() });
  }
}

// We are running through container
// and we should export the mount function
export { mount };

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
