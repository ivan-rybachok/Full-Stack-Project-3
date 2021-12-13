import React from 'react';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from 'react-loader-spinner';
import './LoadingOverlay.scss';
import {LoadingProps} from "./../Tools/data.model";
// interface LoadingOverlayProps {
//     enabled:boolean;
//     bgColor:string;
//     spinnerColor:string;
// }

const LoadingOverlay = ({enabled, bgColor, spinnerColor}:LoadingProps) => {

    let styles:Object = {
        backgroundColor:bgColor
    }

    return (
        (enabled)
        ? 
        <div className="loading-overlay" style={styles}>
            <Loader
                type="TailSpin"
                color={spinnerColor}
                height={50}
                width={50}
            />
        </div>
        : <div></div>
    );
}

export default LoadingOverlay;