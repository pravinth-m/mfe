import React from 'react';
import { injectIntl } from 'react-intl';
import {Accordion, Card, useAccordionToggle} from "react-bootstrap";
import AccordionContext from "react-bootstrap/AccordionContext";
import {AtAccordion} from '../custom-accordion/custom-accordion.styles';
// import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

const CustomToggle = ({ children, eventKey}) => {
  const currentEventKey = React.useContext(AccordionContext);
  const isCurrentEventKey = currentEventKey === eventKey;
  const decoratedOnClick = useAccordionToggle( eventKey,
      () => isCurrentEventKey ? "" : children.props.onExpandCall()
    );

 
  return (
      <div
        className="d-flex justify-content-between"
        // style={{ backgroundColor: isCurrentEventKey ? "orange" : "pink" }}
        // className={classNames('myDefaultStyling', {'myCollapsedStyling': isCurrentEventKey})}
        onClick={decoratedOnClick}>
        {children}
        {isCurrentEventKey ? 
            <FontAwesomeIcon icon={faChevronUp}/>
          : <FontAwesomeIcon icon={faChevronDown} //onClick={children.props.onExpandCall}
                                              />}
      </div>
    );
}

const CustomAccordion = (props) => { 
  const keys = [...props.accordionComponent.keys()];

    return (
      <AtAccordion>
        <Accordion activeKey={String(props.selectedKey)}>
          <Card>
            { keys.map((item, index) =>{
              const accordionObject = props.accordionComponent.get(item)["props"][props.accordionObjectName];
                return(<> 
                  <Card.Header>
                    <CustomToggle eventKey={String(accordionObject[props.accordionPrimaryKey])}>
                      <Card.Title  onExpandCall={()=> props.accordionClick({...props.inputParam, [props.accordionObjectName]:accordionObject})}> 
                        { accordionObject[props.accordionTitle]}
                      </Card.Title>
                    </CustomToggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey={String(accordionObject[props.accordionPrimaryKey])}>
                    <Card.Body>
                    {props.accordionComponent.get(item)} 
                    </Card.Body>
                  </Accordion.Collapse>
               </>)})}  
          </Card>
          
      </Accordion>
    </AtAccordion>
    )}

export default injectIntl(CustomAccordion);