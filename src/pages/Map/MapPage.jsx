import React, { useState, useEffect } from "react";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import { readBID } from "../../util/localStorageReadWrite";
import { getMapData } from "../../util/binApi";
import ErrorScreen from "../ErrorScreen/ErrorScreen";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import "./map-page.css";

/**
 * @typedef MapData
 * @property {string} bid
 * @property {string} lat
 * @property {string} lng
 *
 * @typedef DefaultMapProps
 * @property {object} center
 * @property {number} center.lat
 * @property {number} center.lng
 * @property {number} zoom
 *
 * @returns {React.ReactNode}
 */

const MapPage = () => {
  /**
   * @type {[MapData[] | null, React.Dispatch<React.SetStateAction<MapData[] | null>>]}
   */
  const [mapData, setMapData] = useState(null);
  /**
   * -1 = fetch error, 0 = loading, 1 = no bin in wl, 2 = success, show map
   * @type {[-1 | 0 | 1 | 2, React.Dispatch<React.SetStateAction<-1 | 0 | 1 | 2>>]}
   */
  const [pageState, setPageState] = useState(0);
  /**
   * @type {[DefaultMapProps, React.Dispatch<React.SetStateAction<DefaultMapProps>>]}
   */

  const [defaultMapProps, setDefaultMapProps] = useState({
    center: { lat: 0, lng: 0 },
    zoom: 12,
  });

  const [URLSearchParams, setURLSearchParams] = useSearchParams()

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
  });
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const allBID = readBID();
      if (allBID && allBID.length != 0) {
        try {
          const allMapData = await getMapData(allBID);
          const [latAvg, lngAvg] = calculateCenterPoint(allMapData);
          setDefaultMapProps(prev => ({
            center: {
              lat: latAvg,
              lng: lngAvg,
            },
            zoom: prev.zoom,
          }));
          setMapData(allMapData);
        } catch (e) {
            console.error(e)
          setPageState(-1);
        }
      } else {
        setPageState(1);
      }
    })();
  }, []);

  /**
   * @param {MapData[]} allMapData
   * @returns {[number, number]}
   */
  const calculateCenterPoint = (allMapData) => {
    const focusBID = URLSearchParams.get("focusBID")
    if (focusBID) {
        const findFocus = allMapData.find((mapData) => mapData.bid === focusBID)
        if (findFocus) {
            return [findFocus.lat, findFocus.lng]
        }
    }

    let [latAvg, lngAvg] = [0, 0];
    for (let mapData of allMapData) {
      latAvg += mapData.lat;
      lngAvg += mapData.lng;
    }

    return [latAvg / allMapData.length, lngAvg / allMapData.length];
  };

  const checkLatLngWorking = (mapData) => {
    return mapData.lat && mapData.lng && Math.abs(mapData.lat) < 90 && Math.abs(mapData.lng) < 180; 
  }

  useEffect(() => {
    if (mapData) {
      setPageState(2);
    }
  }, [mapData]);

  return (
    <>
      {pageState === -1 ? (
        <ErrorScreen />
      ) : pageState === 0 ? (
        <LoadingScreen />
      ) : pageState === 1 ? (
          <div className="fullpage-container center">
              <ion-icon name="help-outline"></ion-icon>
             <div className="center">
              <p className="title-text">Watchlist is Empty</p>
              <p>Please add item to the watchlist to view them on the map</p>
              <Button onClick={() => navigate("/")}>Go To Search page</Button>
            </div>
          </div>
      ) : (
        isLoaded && (
          <GoogleMap
            mapContainerStyle={{
              width: "100%",
              height: "100%",
            }}
            bootstrapURLKeys={{
              key: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
            }}
            center={defaultMapProps.center}
            zoom={defaultMapProps.zoom}
            // onLoad={onload}
          >
            {mapData && 
              mapData.map(
                (data, index) =>
                  checkLatLngWorking(data) && (
                    <MarkerF
                      key={JSON.stringify(data) + index}
                      position={{
                        lat: data.lat,
                        lng: data.lng,
                      }}
                      label={"Bin ID:" + data.bid}
                      onClick={() => navigate(`/bin/${data.bid}`)}
                    ></MarkerF>
                  )
              )}
          </GoogleMap>
        )
      )}
    </>
  );
};

export default MapPage;
