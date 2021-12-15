import React from "react";
import { Form } from "react-bootstrap";
import TreeMenu, { ItemComponent } from "react-simple-tree-menu";
import "react-simple-tree-menu/dist/main.css";
import { TreeMenuGroup } from "../form-tree-menu/form-tree-menu.styles";
import { AtWell } from '../App.styles';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {// faFilter, 
  faSearch, faMinus, faPlus} from "@fortawesome/free-solid-svg-icons";
import { InputGroup } from "react-bootstrap";

const openedIcon = <FontAwesomeIcon icon={faMinus} />;
const closedIcon = <FontAwesomeIcon icon={faPlus} />;

const FormTreeMenu = ({
  name,
  ref,
  onChange,
  className,
  errors,
  hasSearch,
  resetOpenNodesOnDataUpdate,
  disableKeyboard,
  activeKey,
  focusKey,
  active,
  focused,
  data,
  initialOpenNodes,
  initialActiveKey,
  // initialFocusKey,
  ...props
}) => (
  <React.Fragment>
    <TreeMenuGroup>
      <TreeMenu
        name={name}
        data={data}
        cacheSearch={false}
        debounceTime={125}
        disableKeyboard={disableKeyboard}
        resetOpenNodesOnDataUpdate
        initialOpenNodes={initialOpenNodes}
        // hasSearch={hasSearch}

        //onClickItem={function noRefCheck(){}}
        onClickItem={props.handleTreeClick}
        // resetOpenNodesOnDataUpdate={resetOpenNodesOnDataUpdate}
        focused={false}
        openNodes={props.openNodes}
        activeKey={activeKey}
        focusKey={focusKey}
        // initialOpenNodes={initialOpenNodes}
        initialActiveKey={initialActiveKey}
      // initialFocusKey={initialFocusKey}
      >


        {({ search, items }) => (
          <>
            {hasSearch &&
              <AtWell>
                <Form.Group controlId="formSearch">
                  <InputGroup className="organisationtreeclass">
                    <InputGroup.Prepend>
                      <InputGroup.Text className="backgroundhidden">
                        {/* <FontAwesomeIcon icon={faFilter} style={{ color: "#c1c7d0" }} /> */}
                        <FontAwesomeIcon icon={faSearch} style={{ color: "#c1c7d0" }} />
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      type="text"
                      placeholder={props.placeholder}
                      hidden={!hasSearch}
                      //onChange={(e) => search(e.target.value)}
                      onKeyUp={(e) => e.keyCode === 13 ? search(e.target.value) :""}
                    />
                  </InputGroup>


                </Form.Group>
              </AtWell>
            }

            <ul className="list-unstyled">
              {items.map((props) => (
                <ItemComponent
                  {...props}
                  openedIcon={openedIcon}
                  closedIcon={closedIcon}
                />
              ))}
            </ul>
          </>
        )}
      </TreeMenu>
    </TreeMenuGroup>
  </React.Fragment>
);
export default FormTreeMenu;