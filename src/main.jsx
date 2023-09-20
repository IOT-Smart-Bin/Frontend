import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Placeholder from "./pages/Placeholder.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Placeholder text="This is the Home/Search page"/>
      },
      {
        path: "watchlist",
        element: <Placeholder text="This is the Watchlist page"/>,
      },
      {
        path: "map",
        element: <Placeholder text="This is the Map page"/>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
