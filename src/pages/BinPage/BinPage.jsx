/**
 * @typedef BinHistoryTimelime
 * @property {number} gas
 * @property {number} weight
 * @property {number} timestamp
 * @property {number} humidity 
 * @property {number} capacity
 * 
 * @typedef BinHistory
 * @property {string} bid
 * @property {string[]} tags
 * @property {string} pictureLink
 * @property {string} name
 * @property {Object} location
 * @property {number} location.lat
 * @property {number} location.long
 * @property {BinHistoryTimelime[]} history
 * 
 */

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../util/axiosInstance";
import { Spinner } from "react-bootstrap";
import "./bin-page.css";
import BinPageSuccess from "./BinPageSuccess";

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
     * @type {[BinHistory | null, React.Dispatch<React.SetStateAction<BinHistory>>]}
     */
    const [binHistory, setBinHistory] = useState(null);

    useEffect(() => {
        if (!bid) {
          setPageStatus(-1);
          return;
        } 

        (async () => {
            try {
                /** @type {import("axios").AxiosResponse<BinHistory>} */
                const binHistoryFetchResult = await axiosInstance.get(`/binHistory/${bid}`);
                setBinHistory(binHistoryFetchResult.data);
            } catch (e) {
                console.error(e);
                setPageStatus(-1);
            }
        })()
    }, [])

    useEffect(() => {
      if (binHistory !== null) {
        setPageStatus(1);
      }
    }, [binHistory])

    return (
      <>
        {pageStatus == 0 ? (
          <div className="fullpage-container center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
             <div className="center">
              <p className="title-text">Loading...</p>
              <p>We are loading the bin data</p>
            </div>
          </div>
        ) : pageStatus == -1 ? (
          <div className="fullpage-container center">
            <ion-icon name="cloud-offline-outline"></ion-icon>
            <div className="center">
              <p className="title-text">Uh oh</p>
              <p>We dont know want went wrong Here?</p>
            </div>
          </div>
        ) : (
          <BinPageSuccess binHistory={binHistory}/>
        )}
      </>
    );
}

export default BinPage;