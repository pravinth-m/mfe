import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Navbar, Nav, Dropdown, Image, Media, NavLink, NavDropdown, NavItem, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getChangeUserRole, submitChangeRole, getPassWordPolicy, updateStore, changepassword, changeOwner, logOutAuditAction  } from '../../actions'
import rsapi from '../../rsapi';
import { AtHeader, NavPrimaryHeader, ProfileImage, DashboardIcon } from '../header/header.styles.jsx';
import '../../assets/styles/login.css';

import SlideOutModal from '../slide-out-modal/SlideOutModal.jsx';
import ChangePassWord from '../../pages/Login/ChangePassWord.js';
import { DEFAULT_RETURN } from '../../actions/LoginTypes.js';
import { changePasswordValidation, fnPassMessage } from '../../pages/Login/LoginCommonFunction.js';
import { LOGINTYPE } from '../Enumeration.js';
import PortalModal from '../../PortalModal.js';
import SliderPage from '../slider-page/slider-page-component.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartPie } from '@fortawesome/free-solid-svg-icons';
import { createImageFromInitials } from './headerutils.js';
// import { Tooltip } from '@progress/kendo-react-tooltip';
// import { getSelectedAlert } from '../../actions/AlertViewAction.js';
import { faBell } from '@fortawesome/free-regular-svg-icons';
// import '../../pages/dashboardtypes/Alert.css'
import ReactTooltip from 'react-tooltip';
const mapStateToProps = (state) => {
  return {
    Login: state.Login
  }
}

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      createPwdRecord: {},
      alert: [],
      sliderOpen: false,
      nflag: 2,
      quickSettingOpen: false.valueOf,
      showDashboard: false
    }
  }


  onChangeRole() {
    rsapi.post("/login/getchangerole", { "userInfo": this.props.Login.userInfo })
      .then(response => {
        const responseData = response.data;
        this.setState({
          show: true,
          UserMultiRole: responseData.UserMultiRole,
          nusermultirolecode: {
            label: responseData.UserMultiRole[0].suserrolename, value: responseData.UserMultiRole[0].nusermultirolecode,
            item: responseData.UserMultiRole[0]
          }
        });
      })
      .catch(error => {
        if (error.status === 205) {
          toast.warn(error.message)
        } else {
          toast.error(error.message)
        }
      });
  }

  onLogout() {
    const inputData = {
      userinfo: this.props.Login.userInfo,
      scomments: this.props.intl.formatMessage({ id: "IDS_LOGOUT" }),
      sauditaction: "IDS_LOGOUT"
    };
    this.props.logOutAuditAction(inputData);
  }

  openAlert = () => {
    this.setState({ showDashboard: !this.state.showDashboard, nflag: 2 });
  }

  openQuickSetting = () => {
    this.setState({ quickSettingOpen: !this.state.quickSettingOpen })
  }

  openDashBoard = () => {
    this.setState({ showDashboard: !this.state.showDashboard, nflag: 1 })
  }

  render() {
    const { susername, suserrolename, nuserrole, nlogintypecode } = this.props.Login.userInfo;
    const { deputyUser, userMultiRole, isDeputyLogin, userImagePath, settings, profileColor } = this.props.Login;
  
    return (
      <>
        <AtHeader>
          <Navbar className="p-0" bg="light" fixed="top">
            <Navbar.Brand>
              <NavPrimaryHeader className="at-nav-brand">
                {this.props.Login && this.props.Login.displayName ?
                  <FormattedMessage id={this.props.Login.displayName} /> : ""}
              </NavPrimaryHeader>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" className="d-flex align-items-center justify-content-end">
            <ReactTooltip/>
              {/* <Nav>
                <Nav.Item onClick={this.openDashBoard}>
                  <Image src={DashBoard} alt="DashBoard" width="34" height="34" />
                </Nav.Item>
              </Nav> */}
              <Nav>
                {/* <ListView
              data={alert}
              openslide={this.openDashBoard}
              getSelectedAlert={getSelectedAlert}
              userInfo={this.props.Login.userInfo}
              > */}
                {/* </ListView> */}
                {/* <Button className="btn btn-circle outline-grey ml-2" style={{ "border-color": " rgba(187, 194, 203, 0.41)!important" }} variant="link" role="button"
                                        title={this.props.intl.formatMessage({ id: "IDS_ALERT" })}
                                        onClick={this.openAlert}>
                                        <FontAwesomeIcon icon={faBell}  style={{ "width": "0.6!important" }}/>
                                        <div style={{"margin-bottom":"11px"}}>
                  <Badge pill variant="secondary">{alert&&alert.length}</Badge>
                  </div>
                   </Button> */}
                <DashboardIcon>
                  {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
                    {/* <div onClick={this.openAlert}> */}

                    <div className="fa_stack fa-2x the-wrapper" onClick={this.openAlert} >
                      <FontAwesomeIcon icon={faBell} style={{ 'font-size': '26px' }} data-tip="Alert" />
                      <div className="icon icon_Badge" style={{ "width": this.state.alert && this.state.alert.length > 9 ? "52%" : "46%" }}>
                        {/* <div style={{ "margin-bottom": "137px", "font-size": "40%" }}> */}
                        {this.state.alert && this.state.alert.length > 0 ?
                          <Badge pill variant="danger">{this.state.alert && this.state.alert.length}</Badge>
                          : ""}

                        {/* </div> */}
                        {/* </div> */}
                      </div>
                    </div>
                  {/* </Tooltip> */}
                </DashboardIcon>
                <DashboardIcon>
                  {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
                    <FontAwesomeIcon icon={faChartPie} data-tip="Dashboard" onClick={this.openDashBoard}></FontAwesomeIcon>
                  {/* </Tooltip> */}
                </DashboardIcon>
                {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
               
                  <NavDropdown className="no-arrow" alignRight title={<Media >
                    {/* {userImagePath === "" ? */}
                    <ProfileImage className="zoom">
                      {settings && settings[5] && userImagePath && userImagePath !== "" ?
                        <Image src={settings[5] + userImagePath}
                          alt="avatar" className="rounded-circle mr-2" width="36" height="36" /> : <Image className="rounded-circle mr-2"
                            src={createImageFromInitials(32, susername ? susername.charAt(0).toUpperCase() : "", profileColor)}
                        />}
                    </ProfileImage>
                    <Media.Body bsPrefix="media-profileinfo">
                      <span className="user-name user-role" data-tip={susername} data-place="bottom">{susername}</span>
                      <span className="role user-role" data-tip={suserrolename} data-place="bottom">{suserrolename}</span>
                    </Media.Body>
                    {/* :
                    <Image src={userImagePath === "" ? userImg : fileViewURL + "/SharedFolder/UserProfile/" + userImagePath}
                      alt="avatar" className="img-profile rounded-circle mr-2" />
                  } */}

                    {/* <FontAwesomeIcon className="align-self-center down-icon ml-2" icon={faChevronDown} /> */}
                  </Media>}>
                    {/* <ProfileLayer>
                    <ProfileImageLayer>
                      {userImagePath === "" ?
                        <Image className="rounded-circle mr-2"
                          src={createImageFromInitials(80, susername ? susername.charAt(0).toUpperCase() : "", profileColor)}
                        /> : <Image src={fileViewURL + "/SharedFolder/UserProfile/" + userImagePath}
                          alt="avatar" className="rounded-circle mr-2" width="80" height="80" />}
                    </ProfileImageLayer>
                    <Profile>
                      <ProfileName>{susername}</ProfileName>
                      <ProfileRole>{suserrolename}</ProfileRole>
                    </Profile>
                  </ProfileLayer> */}
                    {userMultiRole && userMultiRole.length > 0 &&
                      <Dropdown as={NavItem} drop={"left"} className="ml-2">
                        <Dropdown.Toggle as={NavLink}>
                          <FormattedMessage id="IDS_CHANGEROLE" defaultMessage="Change Role" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {userMultiRole.map((item, index) => {
                            return (
                              <Dropdown.Item key={`roleindex_${index}`} onClick={() => this.submitChangeRole(item)}>{item.suserrolename}</Dropdown.Item>
                            )
                          })}
                        </Dropdown.Menu>
                      </Dropdown>}
                    {!isDeputyLogin && deputyUser && deputyUser.length > 0 &&
                      <Dropdown as={NavItem} drop={"left"} className="ml-2">
                        <Dropdown.Toggle as={NavLink}>
                          <FormattedMessage id="IDS_CHANGEOWNER" defaultMessage="Change Owner" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {this.props.Login.deputyUser.map((item, index) => {
                            return (
                              item.lstUserMultiDeputy && item.lstUserMultiDeputy.length > 1 ?
                                <Dropdown as={NavItem} drop={"left"} className="ml-2">
                                  <Dropdown.Toggle as={NavLink}>{`${item.sdeputyname}[${item.sdeputyid}]-${item.suserrolename}`}</Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    {item.lstUserMultiDeputy.map((role, index) => {
                                      return <Dropdown.Item key={`roleIndex_${index}`} onClick={() => this.submitChangeOwner(item, role)}>{role.suserrolename}</Dropdown.Item>
                                    })}
                                  </Dropdown.Menu>
                                </Dropdown>
                                : <Dropdown.Item key={`deptuserindex_${index}`} onClick={() => this.submitChangeOwner(item, item.lstUserMultiDeputy[0])}>{item.sdeputyname+ "["+ item.sdeputyid + "]"+"-"+item.suserrolename}</Dropdown.Item>
                            )
                          })}
                        </Dropdown.Menu>
                      </Dropdown>
                    }
                    {nlogintypecode && nlogintypecode === LOGINTYPE.INTERNAL && !isDeputyLogin &&
                      <NavDropdown.Item onClick={() => this.props.getPassWordPolicy(nuserrole)}>
                        <FormattedMessage id="IDS_CHANGEPASSWORD" defaultMessage="Change Password" />
                      </NavDropdown.Item>}
                    {/* <NavDropdown.Item>
                      <FormattedMessage id="IDS_LOCK" defaultMessage="Lock" />
                    </NavDropdown.Item> */}
                    <NavDropdown.Item onClick={() => this.onLogout()}>
                      <FormattedMessage id="IDS_LOGOUT" defaultMessage="Log Out" />
                    </NavDropdown.Item>

                  </NavDropdown>
                {/* </Tooltip> */}
                {/* <PortalModal>
                  <SliderPage sliderOpen={this.state.sliderOpen} openDashBoard={this.openDashBoard}
                    component={<h1>Dash Board</h1>}>
                  </SliderPage>
                </PortalModal>

                <PortalModal>
                  <SliderPage sliderOpen={this.state.quickSettingOpen} openQuickSetting={this.openQuickSetting}
                    component={<h1>Alert</h1>}>
                  </SliderPage>
                </PortalModal> */}

                {/* <Dropdown alignRight className="no-arrow">

                  <Dropdown.Toggle id="dropdown-basic" as={NavLink}>
                    <Media>
                      <Image  src={userImg} alt="avatar" className="img-profile rounded-circle mr-2" />
                        <Media.Body>
                          <span className="user-name">{susername}</span>
                          <span className="role">{suserrolename}</span>
                        </Media.Body>
                        <FontAwesomeIcon className="align-self-center down-icon ml-2" icon={faChevronDown} />
                    </Media>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {this.props.Login.nchangerolecount > 0 && 
                    <>
                      <Dropdown.Item onClick={()=>this.props.getChangeUserRole(this.props.Login.userInfo)}>
                          <FormattedMessage id="IDS_CHANGEROLE" defaultMessage="Change Role" />
                      </Dropdown.Item>
                      <Dropdown as={NavItem} drop={"left"}>
                        <Dropdown.Toggle as={NavLink}>
                          <FormattedMessage id="IDS_CHANGEROLE" defaultMessage="Change Role" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item>Hello there!</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                      </>}
                    {this.props.Login.ndeputyCount > 0 && 
                      <Dropdown.Item onClick={ () => this.onChangeOwner() }>
                          <FormattedMessage id="IDS_CHANGEOWNER" defaultMessage="Change Owner" />
                      </Dropdown.Item>}
                      <Dropdown.Item>
                          <FormattedMessage id="IDS_CHANGEPASSWORD" defaultMessage="Change Password" />
                      </Dropdown.Item>
                      <Dropdown.Item>
                          <FormattedMessage id="IDS_LOCK" defaultMessage="Lock" />
                      </Dropdown.Item>
                      <Dropdown.Item onClick={ () => this.onLogout()}>
                          <FormattedMessage id="IDS_LOGOUT" defaultMessage="Log Out" />
                      </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown> */}
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </AtHeader>
        <PortalModal>
          <SliderPage show={this.state.showDashboard} nflag={this.state.nflag} closeModal={this.openDashBoard} />
        </PortalModal>
        { this.props.Login.openCPModal && this.props.Login.screenName === "IDS_CHANGEPASSWORD" &&
          <SlideOutModal
            show={this.props.Login.openCPModal}
            closeModal={this.closeModal}
            loginoperation={true}
            inputParam={{}}
            screenName={this.props.Login.screenName}
            onSaveClick={this.onChangePassword}
            selectedRecord={this.state.createPwdRecord || {}}
            mandatoryFields={this.mandatoryFieldFunction()}
            addComponent={
              <ChangePassWord
                sloginid={this.props.Login.userInfo.sloginid}
                createPwdRecord={this.state.createPwdRecord}
                msg={fnPassMessage(this.props.Login.passwordPolicy)}
                onInputChange={(event) => this.onInputChange(event)}
              />
            }
          />}
      </>
    );
  }

  submitChangeOwner = (item, role) => {
    const parameterInfo = {
      typeName: DEFAULT_RETURN,
      data: { menuDesign: [], navigation: "" }
    }
    this.props.updateStore(parameterInfo);
    const inputData = {
      nuserrolecode: item.nuserrolecode,
      suserrolename: item.suserrolename,
      nusercode: item.nusercode,
      sdeputyid:item.sdeputyid,
      userinfo: this.props.Login.userInfo
    }
    this.props.changeOwner(inputData);
  }

  onChangePassword = () => {
    const createPwdRecord = this.state.createPwdRecord;
    const returnMsg = changePasswordValidation(createPwdRecord, this.props.Login.passwordPolicy, this.props.Login.userInfo.sloginid);
    if (returnMsg === 0) {
      const inputParam = {
        spassword: createPwdRecord.snewpassword.trim(),
        sOldPassword: createPwdRecord.soldpassword.trim(),
        nusersitecode: this.props.Login.userInfo.nusersitecode,
        isPasswordExpiry: false,
        userInfo: this.props.Login.userInfo
      };
      this.props.changepassword(inputParam);
    } else {
      toast.info(returnMsg);
    }
  }

  onInputChange(event) {
    const createPwdRecord = this.state.createPwdRecord || {};
    createPwdRecord[event.target.name] = event.target.value;
    this.setState({ createPwdRecord });
  }

  closeModal = () => {
    const updateInfo = {
      typeName: DEFAULT_RETURN,
      data: { openCPModal: false }
    }
    this.props.updateStore(updateInfo);
  }

  mandatoryFieldFunction() {
    let mandatoryField = [
      { "idsName": "IDS_OLDPASSWORD", "dataField": "soldpassword", "mandatory": false },
      { "idsName": "IDS_NEWPASSWORD", "dataField": "snewpassword", "mandatory": false },
      { "idsName": "IDS_CONFIRMPASSWORD", "dataField": "sconfirmpassword", "mandatory": true }
    ]
    return mandatoryField;
  }

  submitChangeRole = (roleItem) => {
    const parameterInfo = {
      typeName: DEFAULT_RETURN,
      data: { menuDesign: [], navigation: "" }
    }
    this.props.updateStore(parameterInfo);
    const userInfo = this.props.Login.userInfo;
    const inputParam = {
      nusermultisitecode: userInfo.nusersitecode,
      slanguagetypecode: userInfo.slanguagetypecode,
      nusermultirolecode: roleItem.nusermultirolecode,
      nuserrolecode: roleItem.nuserrolecode,
      nmastersitecode: userInfo.nmastersitecode,
      nlogintypecode: userInfo.nlogintypecode,
      userinfo: userInfo
    }
    this.props.submitChangeRole(inputParam);
  }

  componentDidUpdate(prevProps) {
  //   if (this.props.Login.isDeputyLogin === true) {
    
  //   if (this.props.Login.navigation === "home") {
  //      this.props.history.push('/');
  //  }
  // }
    if (this.props.Login.createPwdRecord !== prevProps.Login.createPwdRecord) {
      this.setState({ createPwdRecord: this.props.Login.createPwdRecord })
    }
    if (this.props.Login.alert !== prevProps.Login.alert) {
      this.setState({ alert: this.props.Login.alert })
    }
  }



  // componentWillUnmount() {
  //   clearInterval(this.interval);
  // }

}

export default connect(mapStateToProps, {
  getChangeUserRole, submitChangeRole, getPassWordPolicy,
  updateStore, changepassword, changeOwner, logOutAuditAction
})(injectIntl(Header));