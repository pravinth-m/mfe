import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Tab, Nav, Image, Accordion, Button } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import Preloader from '../preloader/preloader.component.jsx';
import ContextAwareToggle from './ContextAwareToggle.js';
import PerfectScrollbar from 'react-perfect-scrollbar'
import { callService, navPage, elnLoginAction, sdmsLoginAction } from '../../actions'
import { SidebarNav, SidebarBrand, SidebarBrandTxt, NavHeader, CollapseInner } from '../../components/sidebar/sidebar.styles.jsx';
import PrimaryLogo from '../../assets/image/sidebar-logo.png';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { formatInputDate } from '../CommonScript.js';
//import LogiLabLogo from '../../assets/image/logilablogo.png'
//import SDMSLogo from '../../assets/image/sdmslogo.png'
import { toast } from 'react-toastify';


const mapStateToProps = (state) => {
    return { Login: state.Login }
}

class Menu extends PureComponent {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.state = {
            show: false,
            nusermultirolecode: -1,
            selectedRecord: {},
            isSidebarActive: false,
            isPinned: false,
            key: this.props.Login.menuDesign &&
                this.props.Login.menuDesign[0] ?
                `MenuId_${this.props.Login.menuDesign[0].nmenucode}` :
                "MenuId_0"
        }
    }

    getDetail = (classUrl, methodUrl, formCode, displayName, moduleCode) => {

        if (this.props.Login.userInfo.nformcode !== formCode) {
            const userInfo = {
                ...this.props.Login.userInfo, "nformcode": formCode,
                "nmodulecode": moduleCode
            }
            const inputParam = {
                inputData: { "userinfo": userInfo, currentdate: formatInputDate(new Date(), true) },
                classUrl, methodUrl, displayName
            };

            this.props.callService(inputParam);
        }
    }

    onELNLoginClick = () => {
        if (this.props.Login.sdmselnsettings && this.props.Login.sdmselnsettings[3]) {
            const serverUrl = this.props.Login.sdmselnsettings[3] + "Login/Validateuser";
            const uiUrl = this.props.Login.sdmselnsettings[4];
            const userInfo = this.props.Login.userInfo;
            const inputParam = {
                username: userInfo.sloginid,
                lssitemaster: { "sitecode": "1" },
                password: userInfo.spassword,
                lsusergroup: { "usergroupname": userInfo.suserrolename }
            };
            this.props.elnLoginAction(inputParam, serverUrl, uiUrl);
        } else {
            toast.info(this.intl.FormattedMessage({ id: "IDS_ELNSERVERURLNOTAVAILABLE" }));
        }
    }

    onSDMSLoginClick = () => {
        if (this.props.Login.sdmselnsettings && this.props.Login.sdmselnsettings[1]) {
            const serverUrl = this.props.Login.sdmselnsettings[1] + "/Login/validatelinkUser";
            const uiUrl = this.props.Login.sdmselnsettings[2];
            const userInfo = this.props.Login.userInfo;
            const inputParam = {
                sUserName: userInfo.sloginid,
                sSiteCode: "DEFAULT",
                sGroupName: userInfo.suserrolename
            };
            this.props.sdmsLoginAction(inputParam, serverUrl, uiUrl);
        } else {
            toast.info(this.intl.FormattedMessage({ id: "IDS_ELNSERVERURLNOTAVAILABLE" }));
        }
    }
    setKey = (k) => {
        this.setState({ key: k })
    }
    componentDidUpdate(prevProps) {
        if (this.props.Login.menuDesign !== prevProps.Login.menuDesign) {
            this.setState({ key: this.props.Login.menuDesign && this.props.Login.menuDesign[0] ? `MenuId_${this.props.Login.menuDesign[0].nmenucode}` : "MenuId_0" })
        }
    }
    render() {

        const { isSidebarActive } = this.state;
        const { menuDesign, loading } = this.props.Login;

        return (
            <>
                <Preloader loading={loading} />

                <SidebarNav className={`d-flex side-nav sidebar sidebar-dark bg-gradient-primary ${isSidebarActive && !this.state.isPinned ? 'toggled' : ''} ${this.state.isPinned && 'at-sidebar-pinned'}`} onMouseEnter={() => this.ToggleAction(false)} onMouseLeave={() => this.ToggleAction(true)}>
                    <Tab.Container
                        activeKey={this.state.key}
                        onSelect={(k) => this.setKey(k)} >
                        {/* Left Menu Icon */}
                        < Nav className="nav flex-column side-nav" variant="pills" key='MenuIcon' >
                            <Nav.Link key="HomeMenu" eventKey="HomeMenu" >
                                <Image src={PrimaryLogo} alt="Primary-Logo" width="45" height="60" />
                            </Nav.Link>

                            {menuDesign && menuDesign.map((menu) => {
                                return (
                                    <Nav.Link key={menu.nmenucode} eventKey={`MenuId_${menu.nmenucode}`} >
                                        <Image src={require(`../../assets/image/${menu.smenuname.toLowerCase()}.svg`)} alt="sidebar" width="34" height="34" />
                                    </Nav.Link>)
                            })}
                            {/* <Nav.Link key={6} onClick={() => this.onELNLoginClick()}>
                                <Image src={LogiLabLogo} alt="logilablogo" width="45" height="55" />
                            </Nav.Link>
                            <Nav.Link key={7} onClick={() => this.onSDMSLoginClick()}>
                                <Image src={SDMSLogo} alt="sdmslogo" width="45" height="55" />
                            </Nav.Link> */}
                        </Nav>

                        <Tab.Content>
                            {menuDesign && menuDesign.map(menu => {
                                return (
                                    <Tab.Pane key={menu.nmenucode} eventKey={`MenuId_${menu.nmenucode}`}>
                                        <Accordion className="navbar-nav position-relative" as="ul" >
                                            <Button className="rounded-circle border-0" id="sidebarToggle" onClick={() => this.pinnedEvent()}></Button>
                                            <SidebarBrand className="sidebar-brand d-flex align-items-center">
                                                <SidebarBrandTxt>
                                                    <FormattedMessage id={menu.sdisplayname}
                                                        defaultMessage={menu.sdisplayname} />
                                                </SidebarBrandTxt>
                                            </SidebarBrand>
                                            <PerfectScrollbar className="sidebar-scroll">
                                                {
                                                    (menu.lstmodule).map(module => {

                                                        return (

                                                            <Nav.Item key={module.nmodulecode} as="li">
                                                                <ContextAwareToggle eventKey={module.nmodulecode} >
                                                                    <NavHeader>
                                                                        <FormattedMessage id={module.sdisplayname}
                                                                            defaultMessage={module.sdisplayname} />
                                                                    </NavHeader>
                                                                </ContextAwareToggle>

                                                                <Accordion.Collapse eventKey={module.nmodulecode}>
                                                                    <CollapseInner className="bg-transparent py-2 collapse-inner rounded">
                                                                        {
                                                                            (module.lstforms).map(forms => {
                                                                                return (
                                                                                    <NavLink className="collapse-item" key={forms.nformcode}
                                                                                        nformcode={forms.nformcode} to={'/' + forms.sclassname}
                                                                                        onClick={() => this.getDetail(forms.sclassname.toLowerCase(), forms.surl, forms.nformcode, forms.sdisplayname, module.nmodulecode)}
                                                                                    >
                                                                                        <FormattedMessage id={forms.sdisplayname}
                                                                                            defaultMessage={forms.sdisplayname} />
                                                                                    </NavLink>
                                                                                )
                                                                            })
                                                                        }
                                                                    </CollapseInner>
                                                                </Accordion.Collapse>
                                                            </Nav.Item>
                                                        )
                                                    })
                                                }
                                            </PerfectScrollbar>

                                        </Accordion>
                                    </Tab.Pane>)
                            })}

                        </Tab.Content>
                    </Tab.Container>
                </SidebarNav>
            </>
        );
    }
    ToggleAction = (value) => {

        this.setState({
            isSidebarActive: value
        })
    }
    pinnedEvent = () => {
        let { isPinned } = this.state;
        this.setState({
            isPinned: !isPinned
        })
    }
    // selectInputOnChange = (ComboVal, fieldName) =>  {
    //     this.setState({ [fieldName] : ComboVal }); 
    // }

}

export default connect(mapStateToProps, { callService, navPage, elnLoginAction, sdmsLoginAction })(injectIntl(Menu));


