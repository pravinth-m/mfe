import styled from 'styled-components';
export const TreeMenuGroup = styled.div`
    div[tabindex="0"]:focus {
        outline: 0;
        box-shadow: 0;
    }
        .rstm-tree-item--focused {
            z-index: 9;
            box-shadow: none;
            outline: 0;
        }
        .rstm-tree-item {
            font-size: 15px;
            color: #505f79;
            border-bottom: 1px solid #e2e5e9;
            padding: 0.5rem 0;
            font-weight: 600;
            &:focus {
                outline: 0;
            }
        }
        .rstm-tree-item--active {
            // background-color: #FFF
            background: none;
            border-bottom: 1px solid #e2e5e9;
            &.rstm-tree-item--focused {
                color: #505f79 !important;
                background:  #d2e4fd ;
                box-shadow: none;
                border-bottom: none;
            }

        }
`;