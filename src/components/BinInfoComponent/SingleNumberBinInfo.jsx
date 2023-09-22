import React, { useEffect, useRef } from "react";
import { Card, Button, ButtonToolbar, OverlayTrigger, Tooltip } from "react-bootstrap";
import "./single-number-bin-info.css";
import {  getComponentConfigBasedOfMeasuredValue } from "../../util/valueDescription";

/**
 * @param {string} text 
 * @returns {string}
 */
const capitalizeFirstLetter = (text) => {
  if (text === "") return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * @typedef SingleNumberBinInfoComponentProps
 * @property {Object} props 
 * @property {Object} props.binData
 * @property {string} props.binData.dataName
 * @property {string} props.binData.value
 */

/**
 * 
 * @param {SingleNumberBinInfoComponentProps} props 
 * @returns {React.ReactNode}
 */
const SingleNumberBinInfoComponent = (props) => {
    /**
     * @type {React.RefObject<import("./../../util/valueDescription.js").ComponentConfig>}
     */
    const componentConfig = useRef(getComponentConfigBasedOfMeasuredValue(props.binData.dataName, props.binData.value));

    const tooltip = (props) => {
      return (
        <Tooltip {...props}>
          <p>{componentConfig.current.description}</p>
        </Tooltip>
      );
    };

    return (
      <Card className={`mt-3 border-3 ${componentConfig.current.asset.borderColor}`}>
        <Card.Header className="text-align-left ">
          <div className="bin-card-header">
            <Card.Title className="center">
              {capitalizeFirstLetter(props.binData.dataName) ?? ""}
            </Card.Title>
            <ButtonToolbar>
              <OverlayTrigger placement="bottom" overlay={tooltip}>
                <Button variant="outline-black" className="center">
                  <ion-icon name="information-circle-outline"></ion-icon>
                </Button>
              </OverlayTrigger>
              <Button variant="outline-black" className="center">
                <ion-icon name="bar-chart-outline"></ion-icon>
              </Button>
            </ButtonToolbar>
          </div>
        </Card.Header>
        <Card.Body className="text-align-left">
          <h1>{props.binData.value ?? ""}</h1>
        </Card.Body>
        <Card.Footer>
          <p className={`${componentConfig.current.asset.textColor} bold-text`}>
            Status: {componentConfig.current.interpreted.interpretAs} - {componentConfig.current.interpreted.interpretDescription} 
          </p>
        </Card.Footer>
      </Card>
    );
}

export default SingleNumberBinInfoComponent;