import styled, {css} from 'styled-components';

export const AtTableWrap = styled.div`
.k-grid-toolbar {
    background-color: #FFF;
    margin: -1px -1px 0 -1px;
    padding: 1rem 0;
    border-color: #eff1f4;
    text-align: right;
}
.k-grid, .k-grid .k-grid-content, .k-grid-header, .k-grid-header th.k-grid-header-sticky {
    border-color: #eff1f4;
}
.k-grid th {
    font-size: .85rem;
    color: #172b4d;
    /* text-transform: uppercase; */
    font-weight: bold;
    // padding: 1rem 2rem;
}
/* For Adjusting last column in grid */
${props => props.actionColWidth && css`
    table > colgroup col:last-of-type{
        width: ${props.actionColWidth};
    }
    .k-grid-table col:last-of-type{
        width: ${props.actionColWidth};
    }
`}

.k-grid-header .k-header.active > div > div {
    color: #1268e3;
}
.k-grid .k-master-row td.active {
    background-color: #d2e4fd
    /* rgba(0, 123, 255, 0.25); */
}
.no-paging .k-pager-numbers-wrap{
    display:none;
}
.k-grid th, .k-grid td {
    /* border-width: 0; */
    // padding: 1rem 2rem;
}
.k-grid td {
    border-width: 0 0 1px 0;
    border-color: #eff1f4;
    font-weight: 600;
    color: #505f79;
    padding: .5rem .75rem;
    background-color: #fff;
    /* overflow: hidden;
    text-overflow: ellipsis; */
    white-space: nowrap;
}
.k-grid .k-alt, 
.k-master-row.k-alt .k-grid-content-sticky,
.k-master-row:hover .k-grid-content-sticky {
    background-color: #fff;
}
.k-grid-pager {
    border-color: #eff1f4;
    color: #505f79;
    background-color: #fff;
    padding: 1rem 2rem;
    border: 0;
}
.k-pager-input, .k-pager-sizes, .k-pager-info {
    display: flex !important;
}
.k-grid-pager .k-i-arrow-e::before {
	content: 'A'
}

.k-grid-pager .k-i-arrow-w::before {
	content: 'B'
}
.k-pager-numbers .k-link.k-state-selected {
    border-color: #1268e3;
    background-color: #FFF;
    color: #1268e3;
}
.k-pager-numbers .k-link, .k-pager-nav.k-link {
    color: #505f79;
    border-color: #eff1f4;
    font-weight: 600;
    &:hover {
        background-color: #1268e3;
        color: #FFF;
        border-color: #1268e3;
    }
}
.k-pager-wrap .k-dropdown .k-dropdown-wrap {
    border-color: #eff1f4;
}
.k-pager-numbers .k-link:focus {
    box-shadow: none;
}
.k-grid  .k-hierarchy-cell {
    padding: 0;
}
.k-grid-header th.k-grid-header-sticky {
    background-color:#f8f9fa;
    color: #172b4d;
}
// For Multilevel Table Resize issue 
.k-grid-table {
    width: 100% !important;
}
.k-grid-header-wrap > table{
    width: 100% !important;
}

`;
export const FormControlStatic = styled.div`
    color: #505f79;
    font-size: 16px;
    font-weight: 400;
    margin-bottom: 10px;
    white-space: normal;
`;
export const FontIconWrap = styled.span`

`;