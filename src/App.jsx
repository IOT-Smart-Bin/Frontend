import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button, Navbar, Offcanvas, Nav } from "react-bootstrap";
import "./App.css";

const routeThatCanBeUsedInNavbar = [
  {name: "Home", route: "/", icon:"search-outline"},
  {name: "Watchlist", route: "/watchlist", icon:"eye-outline"},
  {name: "Map", route: "/map", icon:"map-outline"},
]

function App() {
  const [showNavbar, setNavbar] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
          <Button
            onClick={() => setNavbar(true)}
            as="button"
            className="center ml-10"
          >
            <ion-icon name="menu-outline"></ion-icon>
          </Button>
          <p className="nav-title-text">Trash App</p>
        </Navbar>
        <Offcanvas
          show={showNavbar}
          onHide={() => setNavbar(false)}
          backdrop="static"
        >
          <Offcanvas.Header closeButton>
            <div className="icon-and-tab-container">
              <ion-icon name="trash-outline"></ion-icon>
              <Offcanvas.Title>Trash App</Offcanvas.Title>
            </div>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="d-grid gap-2" as="div" fill >
              {routeThatCanBeUsedInNavbar.map((routeObject) => (
                <Button variant={location.pathname === routeObject.route ? "primary" : "secondary"}
                    onClick={handleRouteChange(routeObject.route)}
                    className="icon-and-tab-container"
                  >
                    <ion-icon name={routeObject.icon}></ion-icon>
                    {routeObject.name}
                </Button>
              ))}
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>
        <div className="outlet-container">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default App;
