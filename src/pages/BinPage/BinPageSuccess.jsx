import React, { useEffect, useState } from "react";
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
                      <Image
                        as="img"
                        src={binDataAndHistory.pictureLink}
                        className="bin-image"
                        alt="Bin Image"
                      ></Image>
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
                        variant="warning"
                        onClick={() => setIsEditing(true)}
                      >
                        <b>Edit Bin Info</b>
                      </Button>
                    </Row>
                    <br />
                    <Row>
                      {isInWL ? (
                        <Button variant="danger" onClick={changeBidWatchlist}>
                          <b>Delete from Watchlist</b>
                        </Button>
                      ) : (
                        <Button variant="primary" onClick={changeBidWatchlist}>
                          <b>Add To Watchlist</b>
                        </Button>
                      )}
                    </Row>
                    <br />
                    <Row>
                      <Button
                        variant={isInWL ? "primary" : "outline-primary"}
                        onClick={() => setGlobalIsShowGraph((prev) => !prev)}
                      >
                        <b>See All Graph</b>
                      </Button>
                    </Row>
                    <br></br>
                    {isInWL && (
                      <Row>
                        <Button
                          variant="success"
                          onClick={() =>
                            navigate(`/map?focusBID=${binDataAndHistory.bid}`)
                          }
                        >
                          <b>See in Map</b>
                        </Button>
                      </Row>
                    )}
                  </Container>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          {componentTree && componentTree.length !== 0 ? (
            componentTree.map((dataInRow) => (
              <Row key={JSON.stringify(dataInRow)}>
                {dataInRow.map((data) => (
                  <Col key={JSON.stringify(data)}>
                    <SingleNumberBinInfoComponent
                      {...data}
                      globalIsShowGraph={globalIsShowGraph}
                    />
                  </Col>
                ))}
              </Row>
            ))
          ) : (
            <div>
              <hr></hr>
              <h1>No data</h1>
              <p className="no-margin">There are no data for this bin.</p>
              <p className="no-margin">
                Please wait for the data to automatically update.
              </p>
            </div>
          )}
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
