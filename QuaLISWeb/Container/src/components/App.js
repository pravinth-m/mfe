import React,{ lazy, Suspense, useState } from 'react';
import {connect } from 'react-redux';
import { createIntl, createIntlCache, IntlProvider } from 'react-intl';
import { Switch, Route, Redirect, withRouter } from 'react-router';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import messages_en from '../assets/translations/en.json';
import messages_de from '../assets/translations/de.json';

import './App.css';

import Layout from './layout/layout.component.jsx';
import Login from '../pages/Login/Login.jsx'
 import rsapi from '../rsapi';
import PortalApp from '../PortalApp.js';
//import Progress from './Progress.js';

//import MarketingLazy from './MarketingApp';
const MarketingLazy = lazy(() => import('./MarketingApp.js'));
//import Mark from './Mark.jsx'
const messages = {
  'en-US': messages_en,
  'ko-KR': messages_de
}

// This is optional but highly recommended
// since it prevents memory leak
const cache = createIntlCache()

// Call it once in your app. At the root of your app is the best place
toast.configure()

// Create the `intl` object
export const intl = createIntl(
  {
    // Locale of the application
    locale: 'en-US',
    // Locale of the fallback defaultMessage
    defaultLocale: 'en-US',
    messages: messages['en-US'],
  },
  cache,
)

const mapStateToProps = (state) => {
  return {
    Login: state.Login
  }
}



//const MarketingLazy = lazy(() => import('./Checking.jsx'));

class App extends React.Component {
    constructor(props) {
      super(props);
      this.handleUnload = this.handleUnload.bind(this);
      this.handleEndConcert = this.handleEndConcert.bind(this);
      // Store the previous pathname and search strings
      this.currentPathname = null;
      this.currentSearch = null;
    }
    
    componentDidMount() {

      window.addEventListener('beforeunload', this.handleUnload);
      window.addEventListener('unload', this.handleEndConcert)
      const { history } = this.props;
      // history.listen((newLocation, action) => {
      //   if (action === "PUSH") {
      //     if (
      //       newLocation.pathname !== this.currentPathname ||
      //       newLocation.search !== this.currentSearch
      //     ) {
      //       // Save new location
      //       this.currentPathname = newLocation.pathname;
      //       this.currentSearch = newLocation.search;
      //       console.log(newLocation.pathname)
      //       // Clone location object and push it to history
      //       history.push({
      //         pathname: newLocation.pathname,
      //         search: newLocation.search
      //       });
      //     }
      //   } else {
      //     // Send user back if they try to navigate back
      //     history.go(1);
      //     console.log('else')
      //   }
      // });
    }

    componentWillUnmount() {
      window.removeEventListener('beforeunload', this.handleUnload);
      window.removeEventListener('unload', this.handleEndConcert)
      this.handleEndConcert()
    }

   handleUnload(e) {
      const message = "\o/";
      if (this.props.Login.userInfo.susername && this.props.Login.userInfo.susername !== "") {
        let uRL = "";
        let inputData = [];
        uRL = 'login/insertAuditAction';
        inputData = {
          userinfo: this.props.Login.userInfo,
          scomments: `User Name:${this.props.Login.userInfo.susername}, Login ID:${this.props.Login.userInfo.sloginid}`,
          sauditaction: "IDS_IMPROPERLOGOUT", nFlag: 2
        }

        rsapi.post(uRL, inputData)
          .then(response => {
            (e || window.event).returnValue = message; //Gecko + IE
            return message;
          })
          .catch(error => {
            if (error.response.status === 500) {
              toast.error(error.message);
            } else {
              toast.warn(error.response.data);
            }
          })
      } else {
        (e || window.event).returnValue = message; //Gecko + IE
        return message;
      }
    }

    handleEndConcert = async () => {
      // Write a code to handle Leave button clicked
      // await fetcher({
      //   url: endConcert(concert.id),
      //   method: 'PUT'
      // })
    }

  render() {

    const { language, navigation } = this.props.Login;

    return (<>
        <IntlProvider locale={language} messages={messages[language]}>
         {/* <Suspense fallback={<div>Loading... </div>}>  */}
          <Switch>
          {/* <Route path="/productCategory"  > 
            {console.log('render',this.props.Login)} */}
            {/* <MarketingLazy Login={this.props.Login}></MarketingLazy> */}
            {/* </Route> */}
            <Route exact path="/login" name="Login" render={props=> <Login {...props} />} />
            <Route path="/" name="Home" render={props=> <Layout {...props} />} /> 
          </Switch>
          <Redirect push exact to={"/login"} />
           {/* </Suspense> */}
        
          {/* { navigation !== "login" && <PortalApp />} */}
        </IntlProvider>
      </>);
  }
}
export default connect(mapStateToProps)(withRouter(App));
