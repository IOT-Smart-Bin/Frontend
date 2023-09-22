import { useState } from 'react'
import { Outlet, useNavigate } from "react-router-dom";
import { Button, Navbar, Offcanvas } from "react-bootstrap";
import './App.css'

function App() {
  const [showNavbar, setNavbar] = useState(false);
  const navigate = useNavigate();

  /**
   *
   * @param {string} route
   */
  const handleRouteChange = (route) => {
    return () => {
      setNavbar(false);
      navigate(route);
    };
  };

  return (
    <>
      <div className="page-container">
        <Navbar className="bg-body-secondary">
          <Button onClick={() => setNavbar(true)}>Nav</Button>
        </Navbar>
        <Offcanvas
          show={showNavbar}
          onHide={() => setNavbar(false)}
          backdrop="static"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Trash App</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div className="d-grid gap-2">
              <Button
                variant="outline-primary"
                onClick={handleRouteChange("/")}
              >
                Home
              </Button>
              <Button
                variant="outline-primary"
                onClick={handleRouteChange("/watchlist")}
              >
                Watchlist
              </Button>
              <Button
                variant="outline-primary"
                onClick={handleRouteChange("/map")}
              >
                Map
              </Button>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
        <div style={{"flexGrow": "1"}}>
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default App;
