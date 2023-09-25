import React from "react";
import "./error-screen.css"

const ErrorScreen = () => {
  return (
    <div className="fullpage-container center">
      <ion-icon name="cloud-offline-outline"></ion-icon>
      <div className="center">
        <p className="title-text">Uh oh</p>
        <p>We dont know want went wrong Here?</p>
      </div>
    </div>
  );
}

export default ErrorScreen;