import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import { AtTableWrap } from '../data-grid/data-grid.styles';
import ReactTooltip from 'react-tooltip';

class DataGridWithSelection extends React.Component {

    //lastSelectedIndex = 0;
    // state = {
    //     data: this.props.data.map(dataItem => Object.assign({ selected: false }, dataItem))
    // }

    // selectionChange = (event) => {
    //     const data = this.state.data.map(item=>{
    //         if(item.ProductID === event.dataItem.ProductID){
    //             item.selected = !event.dataItem.selected;
    //         }
    //         return item;
    //     });
    //     this.setState({ data });
    // }
    // rowClick = event => {
    //     let last = this.lastSelectedIndex;
    //     const data = [...this.state.data];
    //     const current = data.findIndex(dataItem => dataItem === event.dataItem);

    //     if (!event.nativeEvent.shiftKey) {
    //         this.lastSelectedIndex = last = current;
    //     }

    //     if (!event.nativeEvent.ctrlKey) {
    //         data.forEach(item => (item.selected = false));
    //     }
    //     const select = !event.dataItem.selected;
    //     for (let i = Math.min(last, current); i <= Math.max(last, current); i++) {
    //         data[i].selected = select;
    //     }
    //     this.setState({ data });
    // };

    // headerSelectionChange = (event) => {
    //     const checked = event.syntheticEvent.target.checked;
    //     const data = this.state.data.map(item=>{
    //         item.selected = checked;
    //         return item;
    //     });
    //     this.setState({ data });
    // }

    render() {
        // let selectAll = true;
        // if (this.props.data && this.props.data.length > 0){
        //     this.props.data.forEach(dataItem => {
        //         if (dataItem.selected){
        //             if (dataItem.selected === false){
        //                 selectAll = false;
        //             }
        //         }
        //         else{
        //             selectAll = false;
        //         }            
        //     }) 
        // }
        // else{
        //     selectAll = false;
        // }
        return (
            <div>

                <AtTableWrap className="at-list-table">
                    <ReactTooltip place="bottom" globalEventOff='click' />
                    <Grid
                        data={this.props.data}
                        style={{ height: '400px' }}
                        selectedField="selected"
                        onSelectionChange={this.props.selectionChange}
                        onHeaderSelectionChange={this.props.headerSelectionChange}
                        onRowClick={this.props.rowClick}
                    >
                        <Column
                            field="selected"
                            width="50px"
                            title={this.props.title}
                            headerSelectionValue={this.props.selectAll}

                        // selectable={false}  
                        // headerSelectionValue={
                        //     this.props.data.findIndex(dataItem => dataItem.selected === false) === -1
                        // }                       
                        />
                        {this.props.extractedColumnList.map((item, index) =>
                            <Column key={index}
                                width={item.width}
                                title={this.props.intl.formatMessage({ id: item.idsName })}
                                cell={(row) => (
                                    <td data-tip={row["dataItem"][item.dataField]}>
                                        {item.isIdsField ?
                                            <FormattedMessage id={row["dataItem"][item.dataField]} defaultMessage={row["dataItem"][item.dataField]} />
                                            : row["dataItem"][item.dataField]}
                                    </td>
                                )} />
                        )}

                    </Grid>
                </AtTableWrap>
            </div>
        );
    }
}

export default injectIntl(DataGridWithSelection);