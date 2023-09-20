import React from "react";

/**
 * @typedef {Object} PlaceholderProps
 * @property {string} text
 */

/**
 * Placeholder JSX element 
 * @param {PlaceholderProps} props 
 * @returns {React.ReactNode} 
 */
const Placeholder = ({ text }) => {
    return (
        <>
            <p>This is a Placeholder</p>
            <p>{text}</p>
        </>
    )
}

export default Placeholder; 