import React, { useRef, useState, useEffect } from "react";
import { Card, Button, ButtonToolbar, OverlayTrigger, Tooltip, Collapse } from "react-bootstrap";
import "./single-number-bin-info.css";
import {  getComponentConfigBasedOfMeasuredValue } from "../../util/valueDescription";
import { LineChart } from "echarts/charts"
import { TitleComponent, TooltipComponent } from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"
import ReactEChartsCore from "echarts-for-react"
import * as echarts from "echarts/core"

echarts.use([TitleComponent, TooltipComponent, LineChart, CanvasRenderer])

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
 * @property {string} name
 * @property {[string, number][]} dataset
 * @property {boolean} globalIsShowGraph
 * @property {React.Dispatch<React.SetStateAction<number>>} setMainComponentAssetLevel
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
  const componentConfig = useRef(
    getComponentConfigBasedOfMeasuredValue(
      props.name,
      props.dataset[props.dataset.length-1][1]
    )
  );
  const [isShowGraph, setIsShowGraph] = useState(false);
  /**
   * @type {[import("echarts").EChartsCoreOption | null, React.Dispatch<React.SetStateAction<import("echarts").EChartsCoreOption | null>>]}
   */

  const tooltip = (props) => {
    return (
      <Tooltip {...props}>
        <p>{componentConfig.current.description}</p>
      </Tooltip>
    );
  };

  useEffect(() => {
    if (props.globalIsShowGraph === true) {
      setIsShowGraph(false);
    }
  }, [props.globalIsShowGraph])

  useEffect(() => {
    if (componentConfig) {
      props.setMainComponentAssetLevel((prev) =>
        componentConfig.current.interpreted.displayColorLevel >= prev
          ? componentConfig.current.interpreted.displayColorLevel
          : prev
      );
    }
  }, [componentConfig]);

  return (
    <Card
      className={`mt-3 border-3 ${componentConfig.current.asset.borderColor} ${componentConfig.current.asset.background}`}
    >
      <Card.Header className="text-align-left  my-card-header-and-footer">
        <div className="bin-card-header">
          <Card.Title className="center ">
            {capitalizeFirstLetter(componentConfig.current.displayName)}
          </Card.Title>
          <ButtonToolbar>
            <OverlayTrigger placement="bottom" overlay={tooltip}>
              <Button variant="outline-black" className="center">
                <ion-icon name="information-circle-outline"></ion-icon>
              </Button>
            </OverlayTrigger>
            <Button
              variant="outline-black"
              className="center"
              disabled={props.globalIsShowGraph}
              onClick={() => setIsShowGraph((prev) => !prev)}
            >
              <ion-icon name="bar-chart-outline"></ion-icon>
            </Button>
          </ButtonToolbar>
        </div>
      </Card.Header>
      <Card.Body className="text-align-left my-card-body">
        <Collapse in={props.globalIsShowGraph || isShowGraph}>
          <div>
            <ReactEChartsCore
              echarts={echarts}
              option={{
                xAxis: {
                  type: "time",
                  name: capitalizeFirstLetter(componentConfig.current.displayName),
                  nameLocation: "center",
                  nameTextStyle: {
                    padding: 20
                  },
                  axisLabel: {
                    rotate: 30
                  }
                },
                yAxis: {
                  type: "value",
                  name: "Value",
                },
                dataset: {
                  source: props.dataset,
                  dimensions: ["timestamp", "data"],
                },
                series: [
                  {
                    name: props.name,
                    type: "line",
                  },
                ],
              }}
            ></ReactEChartsCore>
            <hr></hr>
          </div>
        </Collapse>
        <p className="no-margin center">
          Current {props.name} level is{" "}
        </p>
        <div className="center flex-row add-gap">
          <h1>{props.dataset[props.dataset.length-1][1] ?? ""}</h1>
          <h3>{componentConfig.current.unit}</h3>
        </div>
      </Card.Body>
      <Card.Footer className="my-card-header-and-footer">
        {/* <p className={`${componentConfig.current.asset.textColor} bold-text`}> */}
        <p className={` bold-text`}>
          Status: {componentConfig.current.interpreted.interpretAs} -{" "}
          {componentConfig.current.interpreted.interpretDescription}
        </p>
      </Card.Footer>
    </Card>
  );
};

export default SingleNumberBinInfoComponent;