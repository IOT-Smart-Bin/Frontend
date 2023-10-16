/**
 * @typedef BinHistory
 * @property {number} gas
 * @property {number} weight
 * @property {number} timestamp
 * @property {number} humidityInside 
 * @property {number} humidityOutside
 * @property {number} capacity
 * 
 * @typedef BinData
 * @property {string} bid
 * @property {string[]} tags
 * @property {string} pictureLink
 * @property {string} name
 * @property {Object} location
 * @property {string} location.lat
 * @property {string} location.long
 * 
 * @typedef BinTimeline
 * @property {BinHistory[]} history
 */

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import { Spinner } from "react-bootstrap";
// import "./bin-page.css";
import BinPageSuccess from "./BinPageSuccess";
import { getBinDataAndHistory } from "../../util/binApi";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import ErrorScreen from "../ErrorScreen/ErrorScreen";
import moment from "moment/moment";

/**
 * Bin Page Component
 * @returns {React.ReactNode}
 */
const BinPage = () => {
    const { bid } = useParams()
    /**
     * @type {[ -1 | 0 | 1 , React.Dispatch<React.SetStateAction<-1 | 0 | 1>>]}
     */
    const [pageStatus, setPageStatus] = useState(0)
    /**
     * @type {[BinData | null, React.Dispatch<React.SetStateAction<BinData>>]}
     */
    const [binDataAndHistory, setBinDataAndHistory] = useState(null);

    useEffect(() => {
        if (!bid) {
          setPageStatus(-1);
          return;
        } 
        
        (async () => {
            try {
                const binDataAndHistoryFetchResult = await getBinDataAndHistory(bid, moment().add(-14, "days").format("YYYY-MM-DDTHH:mm:ss"))
                setBinDataAndHistory(binDataAndHistoryFetchResult);
            } catch (e) {
                console.error(e);
                setPageStatus(-1);
            }
        })()
    }, [])

    useEffect(() => {
      if (binDataAndHistory !== null) {
        setPageStatus(1);
      }
    }, [binDataAndHistory])

    return (
      <>
        {pageStatus == 0 ? (
            <LoadingScreen/>
        ) : pageStatus == -1 ? (
            <ErrorScreen/>
        ) : (
          <BinPageSuccess binDataAndHistory={binDataAndHistory}/>
        )}
      </>
    );
}

export default BinPage;
