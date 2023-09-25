import React, { useState, useEffect } from "react";
import { Button, Card, ButtonGroup, Form, Container, Row, Col, Alert, Placeholder } from "react-bootstrap";
import "./bin-page-edit.css";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import { convertFileToBase64, isImage, testImage } from "../../util/imageProcessor";
import { editBinData } from "../../util/binApi";

/**
 * @typedef EditRequestBody
 * @property {string} bid 
 * @property {string} name 
 * @property {string[]} tags 
 * @property {string} pictureLink 
 * @property {string} lat
 * @property {string} long 
 */

/**
 * @param {object} props 
 * @param {() => void} props.returnToMainPageFunction 
 * @param {import("./BinPage").BinData} props.binHistory
 * @returns {React.ReactNode}
 */
const BinPageEdit = ({ returnToMainPageFunction, binHistory }) => {
  const [isConfirmShowing, setConfirmModal]= useState(false);
  const [isCancelShowing, setCancelModal]= useState(false);
  const [isErrorAlertShowing, setIsErrorAlertShowing] = useState(false); 
  const [isSuccessAlertShowing, setIsSuccessAlertShowing] = useState(false); 
  const [alertErrorText, setAlertErrorText] = useState("")
  const [alertSuccessText, setAlertSuccessText] = useState("")
  const [name, setName] = useState("")
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");
  const [tagInput, setTagInput] = useState("");
  /**
   * @type {[File | null, React.Dispatch<React.SetStateAction<File | null>>]}
   */
  const [imageFile, setImageFile] = useState(null);
  /**
   * @type {[string | null, React.Dispatch<React.SetStateAction<string | null>>]}
   */
  const [imageURL, _setImageURL] = useState("")
  /**
   * @type {[string[], React.Dispatch<React.SetStateAction<string[]>>]} 
   */
  const [tagList, setTagList] = useState([]);

  useEffect(() => {
    setName(binHistory.name);
    setLat(binHistory.location.lat);
    setLong(binHistory.location.long);
    setTagList(binHistory.tags);     
    setImageURL(binHistory.pictureLink);
  }, [])

  useEffect(() => {
    if (!imageFile) {
      setImageURL(binHistory.pictureLink)
      return;
    }

    const objUrl = URL.createObjectURL(imageFile);
    setImageURL(objUrl);

    return () => URL.revokeObjectURL(objUrl)
  }, [imageFile])

  const handleNameChange = (event) => {
    setName(event.target.value);
  }

  const handleTagInputChange = (event) => {
    setTagInput(event.target.value)
  }

  /**
   * @param {import("react").SyntheticEvent<HTMLInputElement>} event 
   */
  const handleAddPicture = (event) => {
    if (event.target.files && event.target.files.length !== 0 && isImage(event.target.files[0])) {
      setImageFile(event.target.files[0])
      showSuccessAlert("Successfully added picture")
      return;
    }

    showErrorAlert("Inserting picture failed, Please check the file")
  }

  /**
   * @param {string} url 
   */
  const setImageURL = (url) => {
    testImage(url, 
      () => _setImageURL(url),
      () => _setImageURL(null))
  }

  const confirmEdit = async () => {
    // post info to server
    const base64Image = await convertFileToBase64(imageURL);

    /**
     * @type {EditRequestBody}
     */
    // const requestBody = {
    //   bid: binHistory.bid,
    //   pictureLink: base64Image,
    //   name: name,
    //   tags: tagList,
    //   lat: lat,
    //   long: long,
    // }

    try {
      await editBinData(binHistory.bid, name, tagList, lat, long, base64Image);            
      returnToMainPageFunction();
    } catch (e) {
      console.log(e);
      showErrorAlert("Oops, there is something wrong here, please retry confirming the edit")
    }
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
            showSuccessAlert("Location successfully obtained");
          } else {
            showErrorAlert("There is an error with obtaining location, please try again")
          }
        }, () => showErrorAlert("There is an error with obtaining location, please try again"));
      } catch (e) {
        showErrorAlert("There is an error with obtaining location, please try again")
      }
    } else {
      showErrorAlert("There is an error with obtaining location, please try again")
    }
  }

  const showErrorAlert = (text) => {
    setAlertErrorText(text)
    setIsErrorAlertShowing(true)
    setTimeout(() => {
      setIsErrorAlertShowing(false);
    }, 5000)
  }

  const showSuccessAlert = (text) => {
    setAlertSuccessText(text)
    setIsSuccessAlertShowing(true)
    setTimeout(() => {
      setIsSuccessAlertShowing(false);
    }, 5000)
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
                {
                  imageURL ? (
                    <img src={imageURL} className="preview-image"></img>
                  ) : (
                    <Placeholder></Placeholder>
                  )
                }
                <Form>
                  <Form.Group>
                    <Form.Label>
                      <b>Select Picture</b>
                    </Form.Label>
                    <Form.Control
                      type="file"
                      onChange={handleAddPicture}
                    ></Form.Control>
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
        <p>{alertErrorText}</p>
      </Alert>
      <Alert
        variant="success"
        dismissible={true}
        show={isSuccessAlertShowing}
        onClose={() => setIsSuccessAlertShowing(false)}
      >
        <p>{alertSuccessText}</p>
      </Alert>
    </div>
  );
};

export default BinPageEdit;