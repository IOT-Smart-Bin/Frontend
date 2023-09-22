import React, { useEffect, useState } from "react";
import "./bin-page-success.css";
import BinPageEdit from "./BinPageEdit";

/**
 * @typedef BinPageSuccessProps 
 * @property {import("./BinPage").BinHistory} binHistory 
 */

/**
 * @param {BinPageSuccessProps} props
 * @returns {React.ReactNode}
 */
const BinPageSuccess = ({ binHistory }) => {
    const [isEditing, setIsEditing] = useState(false);

    return <>
      {isEditing ? 
        <div>
          
        </div> 
      : <BinPageEdit />
    }
    </>;
}

export default BinPageSuccess;