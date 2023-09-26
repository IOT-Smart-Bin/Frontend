import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import BinPage from './pages/BinPage/BinPage.jsx';
import MapPage from './pages/Map/MapPage.jsx';
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Placeholder from "./pages/Placeholder.jsx";
import SearchPage from './pages/SearchPage.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <SearchPage/>,
      },
      {
        path: "watchlist",
        element: <Placeholder text="This is the Watchlist page"/>,
      },
      {
        path: "map",
        element: <MapPage/>,
      },
      {
        path: "bin/:bid",
        element: <BinPage/>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)