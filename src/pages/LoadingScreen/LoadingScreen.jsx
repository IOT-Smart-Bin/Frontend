import React from "react"
import "./loading-screen.css"
import { Spinner } from "react-bootstrap"

const LoadingScreen = () => {
  return (
    <div className="fullpage-container center">
      <Spinner animation="border" className="big-logo" role="status" as="div">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      <div className="center">
        <p className="title-text">Loading...</p>
        <p>We are loading the bin data</p>
      </div>
    </div>
  )
}

export default LoadingScreen;
