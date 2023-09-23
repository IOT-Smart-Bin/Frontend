import React, { useState, useEffect } from "react";
import { Button, Card, ButtonGroup, Form, Container, Row, Col, Alert } from "react-bootstrap";
import "./bin-page-edit.css";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";

/**
 * @param {object} props 
 * @param {() => void} props.returnToMainPageFunction 
 * @param {import("./BinPage").BinHistory} props.binHistory
 * @returns {React.ReactNode}
 */
const BinPageEdit = ({ returnToMainPageFunction, binHistory }) => {
  const [isConfirmShowing, setConfirmModal]= useState(false);
  const [isCancelShowing, setCancelModal]= useState(false);
  const [isErrorAlertShowing, setIsErrorAlertShowing] = useState(false); 
  const [isSuccessAlertShowing, setIsSuccessAlertShowing] = useState(false); 
  const [name, setName] = useState("")
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [imageFile, setImageFile] = useState("");
  /**
   * @type {[string[], React.Dispatch<React.SetStateAction<string[]>>]} 
   */
  const [tagList, setTagList] = useState([]);

  useEffect(() => {
    setName(binHistory.name);
    setLat(binHistory.location.lat);
    setLong(binHistory.location.long);
    setTagList(binHistory.tags);     
  }, [])

  const handleNameChange = (event) => {
    setName(event.target.value);
  }

  const handleTagInputChange = (event) => {
    setTagInput(event.target.value)
  }

  const confirmEdit = async () => {
    // post info to server
    returnToMainPageFunction();
  }

  /**
   * @param {string} tag 
   * @returns {() => void}
   */
  const deleteTag = (tag) => {
    return () => {
      setTagList((previousTagList) => 
        previousTagList.filter((prev) => prev !== tag)
      )
    }
  }

  const addTag = () => {
    setTagList((previousTagList) => {
      const newTaglist = [...previousTagList];
      if (newTaglist.includes(tagInput)) {
        return newTaglist;
      }
      newTaglist.push(tagInput)
      return newTaglist;
    })
    setTagInput("");
  }

  const getLatAndLong = () => {
    if (navigator.geolocation) {
      try {
        navigator.geolocation.getCurrentPosition((position) => {
          if (position.coords.latitude && position.coords.longitude) {
            setLat(position.coords.latitude.toString());
            setLong(position.coords.longitude.toString());
          } else {
            setIsErrorAlertShowing(true)
          }
        }, () => setIsErrorAlertShowing(true));
      } catch (e) {
        setIsErrorAlertShowing(true)
      }
    } else {
      setIsErrorAlertShowing(true)
    }
  }

  return (
    <div className="page-limit-container-2">
      <div className="back-button-container">
        <Button
          variant="outline-primary"
          as="button"
          className="back-button-content"
          onClick={() => setCancelModal(true)}
        >
          <ion-icon name="arrow-back-outline"></ion-icon>
          <p className="no-margin">Back</p>
        </Button>
      </div>
      <Card as={"div"} className="edit-card">
        <Card.Header>
          <Card.Title>Bin Editor</Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="form-image-text-splitter">
            <div className="center">
              <Container>
                <img src={binHistory.pictureLink}></img>
                <Form>
                  <Form.Group>
                    <Form.Label><b>Select Picture</b></Form.Label>
                    <Form.Control type="file"></Form.Control>
                  </Form.Group>
                </Form>
              </Container>
            </div>
            <Container as="div" className="form-image-text-splitter">
              <Form as="form" className="form-container">
                <Form.Group>
                  <Form.Label>
                    <b>Name</b>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    onChange={handleNameChange}
                    value={name}
                  />
                  <Form.Text>Enter the name of the bin</Form.Text>
                </Form.Group>
                <Row>
                  <Form.Group as={Col}>
                    <Form.Label>
                      <b>Latitude</b>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={lat}
                      disabled
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>
                      <b>Longitude</b>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={long}
                      disabled
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>
                      <b>Get Location</b>
                    </Form.Label>
                    <Button className="form-control" onClick={getLatAndLong}>
                      Location
                    </Button>
                    <Form.Text>Automatically get location</Form.Text>
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group as={Col}>
                    <Form.Label>
                      <b>Add Tag</b>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      onChange={handleTagInputChange}
                      value={tagInput}
                    />
                    <Form.Text>Insert tag for easier search</Form.Text>
                    <div className="add-tag-button-container">
                      <Button onClick={addTag}>Add Tags</Button>
                    </div>
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>
                      <b>Tags List</b>
                    </Form.Label>
                    <div className="all-tag-container">
                      {tagList.map((tag, index) => (
                        <Button
                          variant="outline-danger"
                          onClick={deleteTag(tag)}
                          as="button"
                          className="add-tag-button-spacing"
                          key={tag + index}
                        >
                          <b>{tag}</b>
                          <ion-icon name="close-circle-outline"></ion-icon>
                        </Button>
                      ))}
                    </div>
                  </Form.Group>
                </Row>
              </Form>
            </Container>
          </div>
        </Card.Body>
        <Card.Footer as="div" className="align-right">
          <ButtonGroup>
            <Button
              variant="outline-primary"
              onClick={() => setConfirmModal(true)}
            >
              Confirm Edit
            </Button>
            <Button
              variant="outline-danger"
              onClick={() => setCancelModal(true)}
            >
              Cancel Edit
            </Button>
          </ButtonGroup>
        </Card.Footer>
      </Card>
      <div className="back-button-container invisible">
        <Button variant="outline-primary">
          <ion-icon name="arrow-back-outline"></ion-icon>
        </Button>
      </div>
      <ConfirmModal
        show={isConfirmShowing}
        setShow={setConfirmModal}
        title="Confirm Editing?"
        bodyText="Are you sure you want to edit"
        OkText="OK"
        cancelText="Cancel"
        onOk={confirmEdit}
      />
      <ConfirmModal
        show={isCancelShowing}
        setShow={setCancelModal}
        title="Cancel Editing?"
        bodyText="Are you sure you want to cancel the edit and discard the change?"
        OkText="OK"
        cancelText="Cancel"
        onOk={returnToMainPageFunction}
      />
      <Alert
        variant="danger"
        dismissible={true}
        show={isErrorAlertShowing}
        onClose={() => setIsErrorAlertShowing(false)}
      >
        <Alert.Heading>Oh Snap!</Alert.Heading>
        <p>
          We have problem getting your position, please make sure you have GPS
          enabled
        </p>
      </Alert>
      <Alert
        dismissible={true}
        show={isSuccessAlertShowing}
        onClose={() => setIsSuccessAlertShowing(false)}
      >
        <Alert.Heading>Location Successfully Obtained</Alert.Heading>
      </Alert>
    </div>
  );
};

export default BinPageEdit;