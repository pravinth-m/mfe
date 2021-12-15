import { faCloudDownloadAlt, faExternalLinkAlt, faFlask, faGlobe, faMicroscope, faPencilAlt, faPrint, faTasks, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from 'react'
//import { ReactComponent as Reports } from '../assets/image/reports.svg'
import { ReactComponent as Quarantine } from '../assets/image/Quarantine.svg'
import { ReactComponent as Reject } from '../assets/image/reject.svg';
import { ReactComponent as Reports } from '../assets/image/generate-report.svg'

export function getActionIcon(action) {
    switch (action) {
        case "faMicroscope":
            return (
                <FontAwesomeIcon icon={faMicroscope} />
            )
        case "faFlask":
            return (
                <FontAwesomeIcon icon={faFlask} />
            );
        case "faPencilAlt":
            return (
                <FontAwesomeIcon icon={faPencilAlt} />
            );
        case "reports":
            return (
                <Reports className="custom_icons" width="15" height="15" />
            );
        case "faTrashAlt":
            return (
                <FontAwesomeIcon icon={faTrashAlt} />
            )
        case "faTasks":
            return (
                <FontAwesomeIcon icon={faTasks} />
            )
        case "Quarantine":
            return (
                <Quarantine className="custom_icons" width="15" height="15" />
            )


         case "reject":
            return (
                <Reject className="custom_icons" width="15" height="15" />
                )

        case "AddSource":
            return (
                <FontAwesomeIcon icon={faGlobe} />
            )

        case "faPrint":
            return (
                <FontAwesomeIcon icon={faPrint} />
            )
        
        case "faExternalLinkAlt":
            return(
                <FontAwesomeIcon icon={faExternalLinkAlt} />
            )
        
        case "faCloudDownloadAlt":
            return(
                <FontAwesomeIcon icon={faCloudDownloadAlt} />
            )

        default:
            return "";
    }
}