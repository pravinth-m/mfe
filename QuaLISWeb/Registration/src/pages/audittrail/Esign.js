import React from 'react';
import { connect } from 'react-redux';
import {Row, Col} from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component.jsx';
import FormTextarea from '../../components/form-textarea/form-textarea.component.jsx';
import CustomSwitch from '../../components/custom-switch/custom-switch.component.jsx';
import { FormattedMessage, injectIntl } from 'react-intl';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component.jsx';
import { TagLine} from "../../components/login/login.styles.jsx";
import { transactionStatus } from '../../components/Enumeration.js';
//import {transactionStatus} from '../../components/Enumeration';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class Esign extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            agree : transactionStatus.YES
        }
    }
    static getDerivedStateFromProps(props, state) {
        state.agree = props.selectedRecord.agree === transactionStatus.NO ? false : true
    }
       render (){
      
           return(
           <Row>                                
                <Col md={12}>
                    <FormInput
                        name={"sloginid"}
                        type="text"
                        label={ this.props.intl.formatMessage({ id:"IDS_LOGINID"})}                  
                        placeholder={ this.props.intl.formatMessage({ id:"IDS_LOGINID"})}
                        defaultValue ={this.props.inputParam && this.props.inputParam.inputData 
                                        && (this.props.inputParam.inputData.userinfo["sdeputyid"] || "")}
                        isMandatory={false}
                        required={false}
                        maxLength={20}
                        readOnly = {true}
                        onChange={(event)=> this.props.onInputOnChange(event)}
                    />
                </Col>
                <Col md={12}>
                       <FormInput
                            name={"esignpassword"}
                            type="password"
                            label={ this.props.intl.formatMessage({ id:"IDS_PASSWORD"})}                            
                            placeholder={ this.props.intl.formatMessage({ id:"IDS_PASSWORD"})}
                            isMandatory={true}
                            required={true}
                            maxLength={50}
                            onChange={(event)=> this.props.onInputOnChange(event)}                            
                       />
                   </Col>
                   <Col md={12}>
                       <FormTextarea
                            name={"esigncomments"}
                            label={ this.props.intl.formatMessage({ id:"IDS_COMMENTS"})}                    
                            placeholder={ this.props.intl.formatMessage({ id:"IDS_COMMENTS"})}
                            rows="2"
                            isMandatory={true}
                            required={true}
                            maxLength={255}
                            onChange={(event)=> this.props.onInputOnChange(event)}
                           />
                   </Col>                
                  
                    <Col md={12}>                     
                       <DateTimePicker
                                    name={"esigndate"} 
                                    label={ this.props.intl.formatMessage({ id:"IDS_ESIGNDATE"})}                     
                                    className='form-control'
                                    placeholderText="Select date.."
                                    selected={this.props.Login.serverTime}
                                    dateFormat={this.props.Login.userInfo.ssitedatetime}
                                    isClearable={false}
                                    readOnly={true}                                                                                                  
                            />
                    </Col>  
                    <Col md={12}>
                        <TagLine>
                                <FormattedMessage id="IDS_ELECTRONICSIGN"></FormattedMessage><br/>                    
                                <FormattedMessage id="IDS_ESIGNTEXT"></FormattedMessage>
                        </TagLine>
                    </Col>
                    <Col md={12}>
                       <CustomSwitch
                            name={"agree"}
                            type="switch"
                            label={ this.props.intl.formatMessage({ id:"IDS_AGREE"})}
                            placeholder={ this.props.intl.formatMessage({ id:"IDS_AGREE"})}                            
                            // defaultValue ={ this.props.selectedRecord["agree"] === transactionStatus.NO ? false :true }
                            isMandatory={true}
                            required={true}
                            checked={ this.state.agree}
                            onChange={(event)=> this.toggleChange(event)}
                         />
                   </Col>                          
               </Row>   
            )
        }
        toggleChange =(event)=>{
            let agree = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
            this.setState({agree})
            this.props.onInputOnChange(event);
        }
   }
   //export default injectIntl(Esign);
   export default connect(mapStateToProps, {})(injectIntl(Esign));