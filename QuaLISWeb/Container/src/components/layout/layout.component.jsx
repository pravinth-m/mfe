import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from "react-router-dom";
import IdleTimer from 'react-idle-timer';
import PropTypes from 'prop-types';
import IdleTimeOutModal from '../confirm-alert/IdleTimeOutModal.jsx';
import Sidebar from '../sidebar/sidebar.component.jsx';
import Header from '../header/header.component.jsx';
import routes from '../../routes.js';
import { navPage, updateStore } from '../../actions'
import rsapi from '../../rsapi';
import { toast } from 'react-toastify';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component.jsx';
import { IDLE_LOGOUT } from '../../actions/LoginTypes.js';
import { injectIntl } from 'react-intl';
// import { updateStore } from '../../actions/LoginAction';
import  ScrollToTop  from '../../actions/ScrollToTop.js';
const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}

class Layout extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            timeout: this.props.Login.idleTimeout,
            showIdleModal: false,
            userLoggedIn: false,
            isTimedOut: false,
            password: "",
            sessionExpired: this.props.Login.sessionExpired
        }

        this.idleTimer = null
        //this.selectInputOnChange = this.selectInputOnChange.bind(this)
        this.password = React.createRef();
    }

    _onAction = (e) => {

    }

    _onActive = (e) => {

    }

    _onIdle = (e) => {
        if (this.state.showIdleModal !== true) {
            let uRL = "";
            let inputData = [];
            uRL = 'login/insertAuditAction';
            inputData = {
                userinfo: this.props.Login.userInfo,
                // scomments: `UserName:${this.props.Login.userInfo.susername}, 
                // LoginID:${this.props.Login.userInfo.sloginid}`,
                scomments: `User Name:${this.props.Login.userInfo.susername}; User Role:${this.props.Login.userInfo.suserrolename}; Login ID:${this.props.Login.userInfo.sloginid}`,
                sauditaction: "IDS_IDLETIMELOCK"
            }
            rsapi.post(uRL, inputData)
                .then(response => {
                    this.setState({ showIdleModal: true, sessionExpired: Date.now() + 60000 });
                })
                .catch(error => {
                    if (error.response.status === 500) {
                        toast.error(error.message);
                    }
                    else {
                        toast.warn(error.response.data);
                    }
                });
        }
    }


    handleLogin = (event) => {
        if (event) {
            if (this.password.current !== null && this.password.current.elements[0].value === "") {
                toast.info(this.props.intl.formatMessage({ id: "IDS_ENTERPASSWORD" }));
                return;
            }
            else {
                let uRL = "";
                let inputData = [];
                uRL = 'login/idleTimeAuditAction';
                inputData = {
                    userinfo: this.props.Login.userInfo,
                    //password: this.state.password,
                    password: this.password.current.elements[0].value,
                    flag: true, nFlag: 1
                }

                rsapi.post(uRL, inputData)
                    .then(response => {
                        if (response.data['PassFlag'].toUpperCase() === 'SUCCESS') {
                            this.password.current.elements[0].value = ""
                            this.setState({ showIdleModal: false, openModal: false })
                        }
                        else {
                            toast.info(response.data['PassFlag']);
                        }
                    })
                    .catch(error => {
                        if (error.response.status === 500) {
                            toast.warn(error.message);
                        }
                        else {
                            toast.warn(error.response.data);
                        }
                    })
            }
        }
    }

    enterKeyLogin = (event) => {
        if (event.keyCode === 13) {
            this.handleLogin(event);
            event.preventDefault();
        }
    }


    handleLogout = (event) => {
        if (event) {
            let uRL = "";
            let inputData = [];
            uRL = 'login/idleTimeAuditAction';
            inputData = {
                userinfo: this.props.Login.userInfo,
                //password: this.state.password,
                //password: this.password.current.elements[0].value,
                flag: false, nFlag: 2
            }

            rsapi.post(uRL, inputData)
                .then(response => {

                    const updateInfo = {
                        typeName: IDLE_LOGOUT,
                        data: {
                            masterData: [], inputParam: undefined, idleneed: false
                        }
                    }
                    this.props.updateStore(updateInfo);

                    //this.password.current.elements[0].value = ""
                    //this.setState({ showIdleModal: false })
                    this.props.navPage("login");
                })
                .catch(error => {
                    if (error.response.status === 500) {
                        toast.error(error.message);
                    }
                    else {
                        toast.warn(error.response.data);
                    }
                })
        }
    }

    renderer = (event) => {
        // event.preventDefault();
        const {  minutes, seconds, completed } = event;
        if (completed) {
            // Render a completed state
            let uRL = "";
            let inputData = [];
            uRL = 'login/insertAuditAction';
            inputData = {
                userinfo: this.props.Login.userInfo,
                // scomments: `UserName:${this.props.Login.userInfo.susername}, 
                // LoginID:${this.props.Login.userInfo.sloginid}`,
                scomments: `User Name:${this.props.Login.userInfo.susername}; User Role:${this.props.Login.userInfo.suserrolename}; Login ID:${this.props.Login.userInfo.sloginid}`,
                sauditaction: "IDS_SESSIONEXPIRED", nFlag: 2
            }

            rsapi.post(uRL, inputData)
                .then(response => {

                    const updateInfo = {
                        typeName: IDLE_LOGOUT,
                        data: {
                            masterData: [], inputParam: undefined, idleneed: false
                        }
                    }
                    //this.props.navPage("login");
                    this.props.updateStore(updateInfo);

                })
                .catch(error => {
                    if (error.response.status === 500) {
                        toast.error(error.message);
                    }
                    else {
                        toast.warn(error.response.data);
                    }
                })
        } else {
            // Render a countdown
            console.log("minutes" + minutes + "seconds" + seconds)
            return <span style={{ 'margin-left': '0.3rem', color: 'red' }}>{minutes} minutes {seconds} seconds..!</span>;

        }
        return null;
    };

    // selectInputOnChange = (event) => {
    //     let password = ""
    //     if (event !== null) {
    //         password = event.target.value
    //     }
    //     this.setState({ password: password })
    // }

    render() {
        console.log('container',this.props.Login)
        this.confirmMessage = new ConfirmMessage();
        return (
            <>
                <div id="app-wrapper">
                    <IdleTimer
                        ref={ref => { this.idleTimer = ref }}
                        element={document}
                        onActive={this._onActive}
                        onAction={this._onAction}
                        onIdle={this._onIdle}
                        debounce={250}
                        timeout={this.state.timeout} />
                    {this.props.Login.idleneed ?
                        <IdleTimeOutModal
                            showIdleModal={this.state.showIdleModal}
                            handleLogin={this.handleLogin}
                            handleLogout={this.handleLogout}
                            UserInfo={this.props.Login.userInfo}
                            passwordref={this.password}
                            //selectInputOnChange={this.selectInputOnChange}
                            idealTime={this.props.Login.idleTimeout}
                            Login={this.props.Login}
                            sessionExpired={this.state.sessionExpired}
                            enterKeyLogin={this.enterKeyLogin}
                            renderer={this.renderer} />
                        : ""}

                    <Sidebar history={this.props} />
                    <div id="content-wrapper" className="d-flex flex-column">
                        <div id="content">
                            <Header history={this.props} />
                            <div className="container-fluid px-0">
                                <ScrollToTop>
                                    <Suspense fallback={<div>...Loading</div>}>
                                    <Switch>
                                        {routes.map((route, index) => {
                                            return route.component ? (
                                                <Route
                                                    key={index}
                                                    path={route.path}
                                                    exact={route.exact}
                                                    name={route.name}
                                                    render={props => (
                                                        <route.component Login={this.props.Login} {...props}  />
                                                    )} />
                                            ) : (null);
                                        })}
                                    </Switch>
                                    </Suspense>
                                </ScrollToTop>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

Layout.propTypes = {
    match: PropTypes.any.isRequired,
    history: PropTypes.func.isRequired
}

export default connect(mapStateToProps, { navPage, updateStore })(injectIntl(Layout));