import React, { useEffect, useMemo, useState } from "react";
import "./bin-page-success.css";
import BinPageEdit from "./BinPageEdit";
import SingleNumberBinInfoComponent from "../../components/BinInfoComponent/SingleNumberBinInfo";
import { Card, Col, Row, Image, Container, Button } from "react-bootstrap";
import { isInWatchList, removeBID, addBID } from "../../util/localStorageReadWrite";
import { useNavigate } from "react-router-dom";

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
  const [isInWL, setIsInWL] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsInWL(isInWatchList(binHistory.bid));
    const handleStorageChange = () => {
      setIsInWL(isInWatchList(binHistory.bid));
    };

    window.addEventListener("bid_storage", handleStorageChange);
    return () => removeEventListener("bid_storage", handleStorageChange);
  }, []);

  const changeBidWatchlist = () => {
    if (isInWL === true) {
      removeBID(binHistory.bid);
    } else {
      addBID(binHistory.bid);
    }

    window.dispatchEvent(new Event("bid_storage"));
  };

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
                          src={binHistory.pictureLink}
                          alt="Bin Image"
                          rounded
                        ></Image>
                      </div>
                    </Col>
                    <Col>
                      <div className="flex-grow-1 text-align-left info-text-size">
                        <p>
                          <b>Name:</b> {binHistory.name}
                        </p>
                        <p>
                          <b>Bin ID:</b> {binHistory.bid}
                        </p>
                        <p>
                          <b>Tags:</b> {binHistory.tags.toString()}
                        </p>
                        <p>
                          <b>Location:</b>
                        </p>
                        <p className="indent">
                          Latitude: {binHistory.location.lat}
                        </p>
                        <p className="indent">
                          Longitude: {binHistory.location.long}
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
                      <Button variant="outline-primary">See All Graph</Button>
                    </Row>
                  </Container>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <SingleNumberBinInfoComponent
                binData={{ dataName: "humidity", value: 600 }}
              />
            </Col>
            <Col>
              <SingleNumberBinInfoComponent
                binData={{ dataName: "humidity", value: 100}}
              />
            </Col>
            <Col>
              <SingleNumberBinInfoComponent
                binData={{ dataName: "humidity", value: 400}}
              />
            </Col>
          </Row>
        </div>
      ) : (
        <BinPageEdit returnToMainPageFunction={() => navigate(0)} binHistory={binHistory}/>
      )}
    </>
  );
}

export default BinPageSuccess;