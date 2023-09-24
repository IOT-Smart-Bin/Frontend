import React, { useEffect, useRef , useState } from "react";
import "./bin-page-success.css";
import BinPageEdit from "./BinPageEdit";
import SingleNumberBinInfoComponent from "../../components/BinInfoComponent/SingleNumberBinInfo";
import { Card, Col, Row, Image, Container, Button } from "react-bootstrap";
import { isInWatchList, removeBID, addBID } from "../../util/localStorageReadWrite";
import { useNavigate } from "react-router-dom";

/**
 * @typedef BinPageSuccessProps 
 * @property {import("./BinPage").BinData & import("../../util/binApi").Timeline} binDataAndHistory
 */

/**
 * @param {BinPageSuccessProps} props
 * @returns {React.ReactNode}
 */
const BinPageSuccess = ({ binDataAndHistory }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isInWL, setIsInWL] = useState(false);
  const navigate = useNavigate();
  const [globalIsShowGraph, setGlobalIsShowGraph] = useState(false);
  const [componentTree, setComponentTree] = useState();

  useEffect(() => {
    setIsInWL(isInWatchList(binDataAndHistory.bid));
    setComponentTree(generateComponentTree());
    const handleStorageChange = () => {
      setIsInWL(isInWatchList(binDataAndHistory.bid));
    };

    window.addEventListener("bid_storage", handleStorageChange);
    return () => removeEventListener("bid_storage", handleStorageChange);
  }, []);

  const changeBidWatchlist = () => {
    if (isInWL === true) {
      removeBID(binDataAndHistory.bid);
    } else {
      addBID(binDataAndHistory.bid);
    }

    window.dispatchEvent(new Event("bid_storage"));
  };
  
  const parseHistoryToGraphDataset = () => {
    const config = {}
    const excludeDataType = ["timestamp", "bid"]
    binDataAndHistory.history.forEach((binTime) => {
      if (!binTime.timestamp) return;
      for (let [key, value] of Object.entries(binTime)) {
        if (excludeDataType.includes(key)) continue;
        if (!config[key]) {
          config[key] = []
        } 
        // debugger;
        config[key].push([binTime.timestamp, value])
      }
    })

    return config;
  }

  const generateComponentTree = () => {
    const componentTree = []
    const componentPerRow = 3;
    const historyByDatatype = parseHistoryToGraphDataset();
    /**
     * @type {[string, [string, number][]][]}
     */
    const allDatatype = Object.entries(historyByDatatype);
    for (let i = 0; i < allDatatype.length; i += componentPerRow) {
      const dataInRow = allDatatype
        .slice(i, i + componentPerRow)
        .map(([datatype, graphDataset]) => ({
          name: datatype,
          dataset: graphDataset,
        }));

      componentTree.push(dataInRow);
    }
    return componentTree;
  }

  return (
    <>
      {!isEditing ? (
        <div className="page-limit-container">
          <Row>
            <Col>
              <Card className="mt-3 border-4">
                <Card.Header className="border-4 text-align-left">
                  <Card.Title>Bin Info</Card.Title>
                </Card.Header>
                <Card.Body>
                  {/* <div className="intro-card-container"> */}
                  <Row>
                    <Col>
                      <div className="center-cropped">
                        <Image
                          src={binDataAndHistory.pictureLink}
                          alt="Bin Image"
                          rounded
                        ></Image>
                      </div>
                    </Col>
                    <Col>
                      <div className="flex-grow-1 text-align-left info-text-size">
                        <p>
                          <b>Name:</b> {binDataAndHistory.name}
                        </p>
                        <p>
                          <b>Bin ID:</b> {binDataAndHistory.bid}
                        </p>
                        <p>
                          <b>Tags:</b> {binDataAndHistory.tags.toString()}
                        </p>
                        <p>
                          <b>Location:</b>
                        </p>
                        <p className="indent">
                          Latitude: {binDataAndHistory.location.lat}
                        </p>
                        <p className="indent">
                          Longitude: {binDataAndHistory.location.long}
                        </p>
                      </div>
                    </Col>
                  </Row>
                  {/* </div> */}
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card className="mt-3 border-4">
                <Card.Header className="border-4 text-align-left">
                  <Card.Title>Action Center</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Container>
                    <Row>
                      <Button
                        variant="outline-primary"
                        onClick={() => setIsEditing(true)}
                      >
                        Edit Bin Info
                      </Button>
                    </Row>
                    <br />
                    <Row>
                      {isInWL ? (
                        <Button
                          variant="outline-primary"
                          onClick={changeBidWatchlist}
                        >
                          Delete from Watchlist
                        </Button>
                      ) : (
                        <Button
                          variant="outline-primary"
                          onClick={changeBidWatchlist}
                        >
                          Add To Watchlist
                        </Button>
                      )}
                    </Row>
                    <br />
                    <Row>
                      <Button
                        variant="outline-primary"
                        onClick={() => setGlobalIsShowGraph((prev) => !prev)}
                      >
                        See All Graph
                      </Button>
                    </Row>
                  </Container>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          {componentTree && componentTree.map((dataInRow) => (
            <Row key={JSON.stringify(dataInRow)}>
              {dataInRow.map((data) => (
                <Col key={JSON.stringify(data)}>
                  <SingleNumberBinInfoComponent {...data} globalIsShowGraph={globalIsShowGraph}/>
                </Col>
              ))}
            </Row>
          ))}
          {/* <Row>
            <Col>
              <SingleNumberBinInfoComponent
                binData={{ dataName: "humidity", value: 600 }}
                globalIsShowGraph={globalIsShowGraph}
              />
            </Col>
            <Col>
              <SingleNumberBinInfoComponent
                binData={{ dataName: "humidity", value: 100 }}
                globalIsShowGraph={globalIsShowGraph}
              />
            </Col>
            <Col>
              <SingleNumberBinInfoComponent
                binData={{ dataName: "humidity", value: 400 }}
                globalIsShowGraph={globalIsShowGraph}
              />
            </Col>
          </Row> */}
        </div>
      ) : (
        <BinPageEdit
          returnToMainPageFunction={() => navigate(0)}
          binHistory={binDataAndHistory}
        />
      )}
    </>
  );
}

export default BinPageSuccess;