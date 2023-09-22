import React, { useMemo, useState } from "react";
import "./bin-page-success.css";
import BinPageEdit from "./BinPageEdit";
import SingleNumberBinInfoComponent from "../../components/BinInfoComponent/SingleNumberBinInfo";
import { Card, Col, Row, Image, Container, Button } from "react-bootstrap";

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
                    <div className="intro-card-container">
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
                      <div className="center-cropped">
                        <Image
                          src={binHistory.pictureLink}
                          alt="Bin Image"
                          rounded
                        ></Image>
                      </div>
                    </div>
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
                        <Button variant="outline-primary" onClick={() => setIsEditing(true)}>Edit Bin Info</Button>
                      </Row>
                      <br />
                      <Row>
                        <Button variant="outline-primary">
                          Add To Watchlist
                        </Button>
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
                  binData={{ dataName: "humidity", value: 300 }}
                />
              </Col>
            </Row>
          </div>
        ) : (
          <BinPageEdit />
        )}
      </>
    );
}

export default BinPageSuccess;