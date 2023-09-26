import React from "react";
import "./error-screen.css"

const ErrorScreen = () => {
  return (
    <div className="fullpage-container center">
      <ion-icon name="cloud-offline-outline"></ion-icon>
      <div className="center">
        <p className="title-text">Uh oh</p>
        <p>We encountered an error when trying to get your data. Please ensure you are inputting the right bin ID</p>
      </div>
    </div>
  );
}

export default ErrorScreen;