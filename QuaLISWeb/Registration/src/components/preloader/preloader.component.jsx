import React from 'react';
import { css } from "@emotion/core";
import PuffLoader from "react-spinners/PuffLoader";

const override = css`
    position: fixed;
    z-index: 9999;
    height: 2em;
    width: 2em;
    overflow: visible;
    margin: auto;
    top: 50%;
    left: 50%;
    bottom: 0;
    right: 0;
    margin-top: -50px;
    margin-left: -50px;

    :before {
        content: '';
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.3);
    }
`;

const Preloader = (props) => {
    return (
        <PuffLoader
            css={override}
            size={100}
            color={"#123abc"}
            loading={props.loading}
        />
    );

}



export default Preloader;

