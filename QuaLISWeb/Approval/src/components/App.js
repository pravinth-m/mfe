import React from 'react';
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
import {  Router } from 'react-router-dom';
import ProductCategory from '../pages/product/ProductCategory.jsx';
import Checking from './Checking.jsx';
import {parentToChild} from '../actions/LoginAction'

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
      console.log("enter child componentdidupdate")
      window.addEventListener('beforeunload', this.handleUnload);
      window.addEventListener('unload', this.handleEndConcert)
      this.props.parentToChild(this.props.parentdata);
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
  
      //       // Clone location object and push it to history
      //       history.push({
      //         pathname: newLocation.pathname,
      //         search: newLocation.search
      //       });
      //     }
      //   } else {
      //     // Send user back if they try to navigate back
      //     history.go(1);
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
  //  this.props.parentToChild(this.props.parentdata);
   console.log('appenter', this.props.Login)
    const { language, navigation } = this.props.Login;
    console.log('navigation', navigation)

    return (<>
        <IntlProvider locale={language} messages={messages[language]}>
      
          <Switch>
          {/* <Route path="/" name="Home" render={props=><Checking props={props} Login={this.props.Login} data={this.props.parentdata}/>} />  */}
            <Route exact path="/login" name="Login" render={props=> <Login {...props} />} />
            {console.log("return product cat")}
             { this.props.parent?<Route path="/" name="Home" render={props=><Checking props={props} Login={this.props.Login} data={this.props.parentdata}/>} /> :
             <Route path="/" name="Home" render={props=> <Layout {...props} />} />  }
          
          </Switch>
          { this.props.parent===undefined?
           <Redirect push exact to={"/" + navigation} />  
           :""}
                { this.props.parent===undefined? navigation !== "login" && <PortalApp />:""} 
        </IntlProvider>
      </>);
  }
}
export default connect(mapStateToProps,{parentToChild})(withRouter(App));
