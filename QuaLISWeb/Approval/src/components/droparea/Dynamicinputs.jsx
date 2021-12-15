import React, { useState, useCallback } from "react";
import PerfectScrollbar from 'react-perfect-scrollbar';
import DropArea from "./DropArea.jsx";
import TrashDropZone from "./TrashDropZone";
import SideBarItem from "./SideBarItem";
import DynamicRow from "./Row";
import {
  handleMoveWithinParent,
  handleMoveToDifferentParent,
  handleMoveSidebarComponentIntoParent,
  handleRemoveItemFromLayout
} from "./helpers";
import { AtAccordion } from '../custom-accordion/custom-accordion.styles';
import { SIDEBAR_ITEM, COMPONENT, COLUMN, COMPONENTROW } from "./constants";
import "./styles.css"
import { Col, Row, Accordion, Card, useAccordionToggle, AccordionContext } from "react-bootstrap";
import DynamicFieldProperties from "./DynamicFieldProperties.jsx";
import { injectIntl } from "react-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
// import Component from "./Component.jsx";

const Dynamicinput = (props) => {
  const handleDropToTrashBin = useCallback(
    (dropZone, item) => {
      const splitItemPath = item.path.split("-");
      props.setLayout(handleRemoveItemFromLayout(props.layout, splitItemPath), item.path, true);
    },
    [props.layout]
  );

  const handleDrop = useCallback(
    (dropZone, item) => {
      const splitDropZonePath = dropZone.path.split("-");
      const pathToDropZone = splitDropZonePath.slice(0, -1).join("-");

      let newItem = { id: item.id, type: item.type };
      if (item.type === COLUMN) {
        newItem.children = item.children;
      }
      if (item.type === COMPONENTROW) {
        newItem = { ...item.data, ...newItem }
      }
      if (item.type === COMPONENT) {
        newItem = { ...item.data, type: item.type }
      }
      // sidebar into
      if (item.type === SIDEBAR_ITEM) {
        // 1. Move sidebar item into page
        const newComponent = {
          ...item.component
        };
        const newComponent1 = {
          type: COMPONENT,
          ...item.component
        };


        const newItem = {
          // id: newComponent.id,
          ...item,
          type: COMPONENT,
        };
        props.setLayout(
          handleMoveSidebarComponentIntoParent(
            props.layout,
            splitDropZonePath,
            newItem
          ), dropZone.path
        );
        return;
      }

      // move down here since sidebar items dont have path
      const splitItemPath = item.path.split("-");
      const pathToItem = splitItemPath.slice(0, -1).join("-");

      // 2. Pure move (no create)
      if (splitItemPath.length === splitDropZonePath.length) {
        // 2.a. move within parent
        if (pathToItem === pathToDropZone) {
          props.setLayout(
            handleMoveWithinParent(props.layout, splitDropZonePath, splitItemPath), dropZone.path
          );
          return;
        }

        // 2.b. OR move different parent
        // TODO FIX columns. item includes children
        props.setLayout(
          handleMoveToDifferentParent(
            props.layout,
            splitDropZonePath,
            splitItemPath,
            newItem
          ), dropZone.path
        );
        return;
      }

      // 3. Move + Create
      props.setLayout(
        handleMoveToDifferentParent(
          props.layout,
          splitDropZonePath,
          splitItemPath,
          newItem
        ), dropZone.path
      );
    },
    [props.layout,// components
    ]
  );

  const renderRow = (row, currentPath, index) => {
    return (
      <DynamicRow
        key={row.id}
        data={row}
        handleDrop={handleDrop}
        // components={components}
        path={currentPath}
        index={index}
        onclickcomponent={props.onclickcomponent}
      />
    );
  };
  const CustomToggle = ({ children, eventKey }) => {
    const currentEventKey = React.useContext(AccordionContext);
    const isCurrentEventKey = currentEventKey === eventKey;
    const decoratedOnClick = useAccordionToggle(eventKey, "");


    return (
      <div
        className="d-flex justify-content-between"
        onClick={decoratedOnClick}>
        {children}
        {isCurrentEventKey ?
          <FontAwesomeIcon icon={faChevronUp} />
          : <FontAwesomeIcon icon={faChevronDown} //onClick={children.props.onExpandCall}
          />}
      </div>
    );
  }
  return (
    <Row>
      <Col md={2} className="sideBar">
        <PerfectScrollbar>
          <AtAccordion>
            <Accordion defaultActiveKey="InputFields">
              <Card>
                <Card.Header>
                  <CustomToggle eventKey={"InputFields"}>
                    <Card.Title>
                      {props.intl.formatMessage({ id: "IDS_INPUTFIELDS" })}
                    </Card.Title>
                  </CustomToggle>
                </Card.Header>
                <Accordion.Collapse eventKey={"InputFields"}>
                  {/* <Card.Body> */}
                  <>
                    {
                      Object.values(props.reactComponents).map((sideBarItem, index) => (
                        <SideBarItem key={sideBarItem.id} data={sideBarItem} displayField={"componentname"} />
                      ))
                    }
                  </>
                  {/* Object.values(props.designData).map((sideBarItem, index) => (
        <SideBarItem key={sideBarItem.id} data={sideBarItem} displayField={"label"} />
      )) */}
                  {/* </Card.Body> */}
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </AtAccordion>

        </PerfectScrollbar>
      </Col>
      <Col md={8} className="pageContainer">
        <Row>
          <Col md={12}>
            <TrashDropZone
              data={props.layout}
              onDrop={handleDropToTrashBin}
            />
          </Col>
          <Col md={12}>
            <div className="page" style={{ minHeight: "150px" }}>
              {props.layout.map((row, index) => {
                const currentPath = `${index}`;

                return (
                  <React.Fragment key={row.id}>
                    <DropArea
                      data={{
                        path: currentPath,
                        childrenCount: props.layout.length
                      }}
                      onDrop={handleDrop}
                      path={currentPath}
                    />
                    {renderRow(row, currentPath, index)}
                  </React.Fragment>
                );
              })}
              <DropArea
                data={{
                  path: `${props.layout.length}`,
                  childrenCount: props.layout.length
                }}
                onDrop={handleDrop}
                isLast
                isEmpty={props.layout.length ? false : true}
              />
            </div>
          </Col>
        </Row>

      </Col>
      <Col md={2} className="pl-0">
        <Card>
          <div className="fielpropsidebar">
            <Card.Title style={{ textAlign: "center" }}>
              {props.selectedFieldRecord.label ? props.selectedFieldRecord.label : props.selectedFieldRecord.componentname
                ? props.selectedFieldRecord.componentname : ""}
            </Card.Title>
            <Card.Body className="pr-2">
              <DynamicFieldProperties
                onInputOnChange={props.onInputOnChange}
                onNumericInputChange={props.onNumericInputChange}
                selectedFieldRecord={props.selectedFieldRecord}
                tables={props.ReactTables}
                onComboChange={props.onComboChange}
                tableColumn={props.tableColumn}
              />
            </Card.Body>
          </div>
        </Card>


      </Col>
    </Row>
  );
};
export default injectIntl(Dynamicinput);
