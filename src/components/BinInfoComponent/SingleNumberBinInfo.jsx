import React, { useEffect, useRef } from "react";
import { Card, Button, ButtonToolbar, OverlayTrigger, Tooltip } from "react-bootstrap";
import "./single-number-bin-info.css";
import { getValueDescription, getValueInterpretation, getValueUnit, assetGenerator } from "../../util/valueDescription";

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
     * @type {React.RefObject<string>}
     */
    const valueDescription = useRef(getValueDescription(props.binData.dataName));
    /**
     * @type {React.RefObject<string>}
     */
    const unit = useRef(getValueUnit(props.binData.dataName));
    /**
     * @type {React.RefObject<import("./../../util/valueDescription.js").Interpretor>}
     */
    const interpretation = useRef(getValueInterpretation(props.binData.dataName, props.binData.value));
    const asset = useRef(assetGenerator(interpretation.current.displayColorLevel));

    const tooltip = (props) => {
      return (
        <Tooltip {...props}>
          <p>{valueDescription.current}</p>
        </Tooltip>
      );
    };

    return (
      <Card className={`mt-3 border-3 ${asset.current.borderColor}`}>
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
          <p>{props.binData.value ?? ""}</p>
        </Card.Body>
        <Card.Footer>
          <p className={`${asset.current.textColor} bold-text`}>Status: {interpretation.current.interpretAs} - {interpretation.current.interpretDescription} </p>
        </Card.Footer>
      </Card>
    );
}

export default SingleNumberBinInfoComponent;