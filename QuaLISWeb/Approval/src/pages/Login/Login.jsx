import React, { Component } from "react";
import flowIcon1 from '../../assets/image/method-execution.svg';
import flowIcon2 from '../../assets/image/instrument-data.svg';
import flowIcon3 from '../../assets/image/spreadsheet.svg';
import flowIcon4 from '../../assets/image/workflows.svg';
import productImg from '../../assets/image/product-image@3x.png'
import Logo from '../../assets/image/qualis-horizontal-logo.png';
import { LoginLeftContainer, LoginRightContainer, LogoContainer, WelcomeTxt, SubTxt, TagLine, VersionTxt, CardImgRight } from "../../components/login/login.styles.jsx";
import { Container, Row, Col, Card, Media, Image } from "react-bootstrap";
import SignIn from "../../components/sign-in/sign-in.component.jsx";
import { FormattedMessage } from "react-intl";

class Login extends Component {

    render() {
        return (
            <>
                <Container fluid={true} className="px-0 login-fixed-top">
                    <Row noGutters={true} className="align-item-center">
                        <Col md="6" sm="6" xs="12">
                            <LoginLeftContainer>
                                <LogoContainer className="d-flex align-items-center ">
                                    <img src={Logo} alt="Lims-Logo" width="180" height="76" className="mr-2" />
                                </LogoContainer> 
                                <VersionTxt>Version 9.0.0.1</VersionTxt>

                                <WelcomeTxt className="mt-2">
                                    <FormattedMessage id="IDS_WELCOMETEXT" defaultMessage="Welcome to Qualis" />
                                    <SubTxt> LIMS</SubTxt>
                                </WelcomeTxt>
                                <TagLine>
                                    <FormattedMessage id="IDS_LIMSINFO" defaultMessage="Digital enabler for laboratories" />
                                </TagLine>
                                <SignIn {...this.props} />
                            </LoginLeftContainer>
                        </Col>
                        <Col md="6" sm="6" xs="12">
                            <LoginRightContainer>
                                <Card className="min-vh-100">
                                    <Card.Body>
                                        <Card.Title>
                                            <FormattedMessage id="IDS_RIGHTHEADERTITLE" defaultMessage="How Qualis LIMS can help your laboratory" />
                                        </Card.Title>
                                        <Media className="mb-4">
                                            <Image className="align-self mr-4" src={flowIcon1} width={41} height={41} alt="Icon-1" />
                                            <Media.Body>
                                                <h5 className="media-heading">
                                                    <FormattedMessage id="IDS_SMHEADER" defaultMessage="Sample Management" />
                                                </h5>
                                                <FormattedMessage id="IDS_SMINFO" defaultMessage="Qualis LIMS has a comprehensive sample registration, storage, distribution & tracking." />
                                            </Media.Body>
                                        </Media>
                                        <Media className="mb-4">
                                            <Image className="align-self mr-4" src={flowIcon2} width={41} height={41} alt="Icon-2" />
                                            <Media.Body>
                                                <h5 className="media-heading">
                                                    <FormattedMessage id="IDS_WSHEADER" defaultMessage="Work Scheduling, Results Entry , Review & Approval with Compliance" />
                                                </h5>
                                                <FormattedMessage id="IDS_WSINFO" defaultMessage="Schedule work for personnel & instruments, enter results, perform review & approval with full data integrity & compliance." />
                                            </Media.Body>
                                        </Media>
                                        <Media className="mb-4">
                                            <Image className="align-self mr-4" src={flowIcon3} alt="Icon-3" width={41} height={41} />
                                            <Media.Body>
                                                <h5 className="media-heading">
                                                    <FormattedMessage id="IDS_REPORTHEADER" defaultMessage="Reporting" />
                                                </h5>
                                                <FormattedMessage id="IDS_REPORTINFO" defaultMessage="Create reports on the fly. Choose the parameters for reporting." />
                                            </Media.Body>
                                        </Media>
                                        <Media className="mb-4">
                                            <Image className="align-self-start mr-4" src={flowIcon4} alt="Icon-4" width={41} height={41} />
                                            <Media.Body>
                                                <h5 className="media-heading">
                                                    <FormattedMessage id="IDS_ADHEADER" defaultMessage="Alert & Dashboard" />
                                                </h5>
                                                <FormattedMessage id="IDS_ADINFO" defaultMessage="Watch for alerts to take action on various tasks. Watch the dashboard to understand where you are." />
                                            </Media.Body>
                                        </Media>
                                    </Card.Body>
                                    <CardImgRight>
                                        <Card.Img src={productImg} className="img-fluid" width="416" height="232" alt="Product-Bottom" />
                                    </CardImgRight>
                                </Card>
                            </LoginRightContainer>
                        </Col>
                    </Row>
                </Container>

            </>
        )
    }

}

export default Login;

