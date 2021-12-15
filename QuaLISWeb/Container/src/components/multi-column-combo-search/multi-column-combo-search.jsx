import React from "react";
import './multi-column-combo-search.css';
import { FormattedMessage, injectIntl } from "react-intl";
// import { sortByField } from "../CommonScript";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { Col, Row, Table } from "react-bootstrap";
import { DivWrap, InlineEl, InputWrap, LabelNormal, TableData, TableHead, TableRow } from "./multi-table-compo-list.styles";
import { WithContext as ReactTags } from 'react-tag-input';
import PerfectScrollbar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css';

import { sortByField } from "../CommonScript";

class MultiColumnComboSearchs extends React.Component {
  constructor(Props) {
    super(Props);
    this.wrapperRef = React.createRef();
    // this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.state = { ...Props, listValue: [], inputVal: "", showList: false, notToShow: [], idslabelfield: [], singleSelection: true }

    this.handleDelete = this.handleDelete.bind(this);
    this.handleChangeInput = this.handleChangeInput.bind(this);
    this.closeList = this.closeList.bind(this);
    this.openList = this.openList.bind(this);
  }
  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
    // this.setState((state) => ({
    //    value: this.state.value.map((str, index) => ({ text: str }))
    // }))
    let fieldToShow = this.props.fieldToShow;
    let showInputkey = this.props.showInputkey;
    let idslabelfield = this.props.idslabelfield;
    //let inputVal = this.props.value
    const listValue = this.props.alphabeticalSort ? sortByField(this.state.listValue, "ascending", this.state.showInputkey) : this.state.listValue;

    this.setState({
      fieldToShow, showInputkey, idslabelfield, listValue, //inputVal,
      // value :inputVal
    })
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target) && this.state.showList) {
      this.closeList(event)
    }
  }
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }
  componentDidUpdate(previousProps) {
    // if (this.props.value !== previousProps.value) {
    //   let value = this.props.value
    //   this.setState({ value })

    // }

    if (this.state.listValue !== previousProps.data) {
      let listValue = this.props.data;
      if (previousProps.data.length > this.state.listValue.length) {
        // listValue = this.state.listValue;
      }
      let value = this.props.value
      this.setState({ listValue, value })
    }
  }
  closeList = (e) => {
    this.setState(state => ({
      showList: false,
    }))
  }
  openList = (e) => {
    //  let val = '' + this.state.inputVal;
    //  let arrayList = this.state.data.filter(o =>
    //    Object.keys(o).some(k =>
    //     o[k] !== null && 
    //     o[k].toString().toLowerCase().includes(val.toLowerCase())));
    //     console.log("arrayList:", arrayList);
    // 
    if (this.state.value.length > 0) {
      this.state.data.map(obj => {
        if (obj[this.state.showInputkey].toLowerCase() === this.state.value[0][this.state.showInputkey].toLowerCase())
          obj.checked = true;
        else
          obj.checked = false;
      })
    }
    // this.state.data[valIndex]["checked"] = false;

    if (!this.state.showList) {
      this.setState(state => ({
        showList: true,
        listValue: this.state.data//arrayList
      }))
    }
    this._scrollBarRef.updateScroll();
  }
  // handleInputFocus =(e) =>{
  //   this.setState(state=>({
  //     listValue : this.state.data,
  //     showList:true
  //   }))
  // }
  handleChangeInput = (e) => {
    let val = '' + e;

    let arrayList = this.state.data.filter(o =>
      Object.keys(o).some(k =>
        o[k] !== null &&
        o[k].toString().toLowerCase().includes(val.toLowerCase())));
    this.setState(state => ({
      listValue: arrayList && arrayList.length > 0 ? arrayList : [],
      inputVal: val
    }))
    this.props.getValue(this.state.value);
  }
  handleTagClick = (e) => {
    this.setState(state => ({
      inputVal: "",
      listValue: this.state.data
    }))
  }
  handleDelete = (e) => {
    let eve = this.state.value;
    eve.splice(e, 1)
    this.state.data.map((obj) => {
      let i = eve.findIndex(evObj => evObj[this.state.showInputkey] === obj[this.state.showInputkey]);
      if (i === -1) {
        obj.checked = false
      } else {
        obj.checked = true
      }
    })
    this.setState(state => ({
      value: eve,
      listValue: this.state.data
      // showList:false
    }))
    this.props.getValue(this.state.value)

  }
  getUpdateSelected = (e, eve) => {
    e['text'] = e[this.state.showInputkey];
    let val = this.state.value;

    if (this.state.singleSelection) {
      val = []
    }
    if (e === 'all' && eve) {
      val = []
      this.state.listValue.map((obj) => {
        obj.checked = true;
        val.push(e)
      })
    } else if (e === 'all' && !eve) {
      this.state.listValue.map((obj) => {
        obj.checked = true;
        val = []
      })
    }
    else if (e !== 'all') {
      let valIndex = this.state.listValue.findIndex((obj) => obj[this.state.showInputkey] === e[this.state.showInputkey])

      this.state.listValue.map((obj, index) => {
        if (index === valIndex) {
          let i = this.state.value.findIndex(obj => obj[this.state.showInputkey] === e[this.state.showInputkey]);
          if (i === -1) {
            val.push(e);
            obj.checked = true;
          } else {
            obj.checked = false;
            val.splice(i, 1)
          }
        } else if (this.state.singleSelection) {
          obj.checked = false;
        }
      })
    }
    this.setState(state => ({
      value: val,
      listValue: this.state.listValue
      // showList:false
    }))
    this.props.getValue(val)
  }
  getUpdateVal = (selected) => {
    let val = selected[this.state.showInputkey];
    this.setState(state => ({
      //value: val,
      value: [selected],
      inputVal: val,
      listValue: this.state.data
      // showList:false
    }))
    this.props.getValue([selected]);
    this.closeList('e')
    // this.props.getValue([val]);
  }
  renderView({ style, ...props }) {
    const customStyle = {
      backgroundColor: `#c1c1c1`
    };
    return (
      <div {...props} style={{ ...style, ...customStyle }} />
    );
  }
  render() {
    const ListHeadItems = (e) => {
      return e.heads.map((item, index) =>
        <TableHead key={item} > <FormattedMessage id={item} defaultMessage={item}></FormattedMessage> </TableHead>

      )
    }
    const ListBodyByKey = (e) => {
      return e.keyFlag.map((item, index) =>
        <TableData key={index}>{e.value[item]}</TableData>
      )
    }
    const ListBodyItems = e => {
      return e.data.map((item, index) => (
        <TableRow key={index} onClick={() => { this.getUpdateVal(item) }}>
          <ListBodyByKey value={item} keyFlag={e.keys} />
        </TableRow>)
      )
    }
    const TableMain = e => {
      //  let thVal = e.visibility === 'show-all' && this.state.listValue && this.state.listValue.length > 0 ? Object.keys(this.state.data[0]).filter(obj => this.state.notToShow.indexOf(obj) === -1) : e.keyList;
      const tableVal = this.state.listValue && this.state.listValue.length > 0 ?
        <Table className="compo-table">
          <thead>
            <TableRow>
              <ListHeadItems heads={this.state.idslabelfield} />
            </TableRow>
          </thead>
          <tbody>
            <ListBodyItems keys={this.state.fieldToShow} data={this.state.listValue} />
          </tbody>
        </Table>

        : <InlineEl className="no-data">No data Found</InlineEl>
      return this.state.showList ? tableVal : ''
    }
    const ToggleList = e => {
      return <InlineEl>
        {this.state.showList ? <i className="fas fa-angle-down" onClick={this.closeList} /> :
          <i className="fas fa-angle-up" onClick={this.openList} />}
      </InlineEl>

    }

    // const ToggleList = e => {
    //   return <span>
    //     {this.state.showList ? <FontAwesomeIcon icon={faAngleUp} onClick={this.closeList} /> :
    //       <FontAwesomeIcon icon={faAngleDown} onClick={this.openList} />
    //     }
    //   </span>
    // }
    const tagValue = this.state.value.length > 0 && this.state.value[0][this.state.showInputkey] && [{ text: this.state.value[0][this.state.showInputkey] }] || [];
    return (
      <>
        <Row>
          <Col>
            <DivWrap className={`custom-column-wrap ${this.state.value && this.state.value.length > 0 ? 'selected' : ''}`} ref={this.wrapperRef}>
              <DivWrap className={`form-group-icon ${this.state.showList ? 'list-view' : ''}`} >
                <LabelNormal className="form-label">{this.state.labelledBy ? <FormattedMessage id={this.state.labelledBy} /> : ''}</LabelNormal>
                <DivWrap className={`dropdoen-wrap ${this.state.showList ? 'listed' : ''}`}>
                  <DivWrap className="icon-input custom-fa-angle-down" onClick={this.openList}>
                    <ReactTags
                      tags={tagValue}
                      handleDelete={this.handleDelete}
                      allowDragDrop={false}
                      delimiters={[]}
                      handleInputChange={this.handleChangeInput}
                      placeholder=""
                      handleTagClick={this.handleTagClick}
                      inline
                    />
                    <ToggleList />
                  </DivWrap>
                  <DivWrap className={` limit-width  ${this.state.showList ? 'active' : ''} `}>
                    <PerfectScrollbar className="compo-table-wrap-scroll" ref={(ref) => { this._scrollBarRef = ref }}>
                      <TableMain visibility={this.state.visibility} keyList={this.state.fieldToShow} data={this.state.listValue} />
                    </PerfectScrollbar>
                  </DivWrap>
                </DivWrap>
              </DivWrap>
            </DivWrap>
          </Col>
        </Row>
      </>
    )
  }
}
export default injectIntl(MultiColumnComboSearch);
