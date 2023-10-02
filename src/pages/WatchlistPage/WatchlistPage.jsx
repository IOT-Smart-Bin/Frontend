import React, { useState } from 'react';
import axios from 'axios';
import "./watchlist-page.css";
import BinPanel from '../../components/BinPanel/BinPanel';
import { readBID, } from '../../util/localStorageReadWrite';
import { useEffect, useRef } from 'react';

function WatchlistPage() {
  const isMountedRef = useRef(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // get the data of bids in watchlist and store them in an array upon entering the page
  useEffect(() => {
     // use to stop activating twice when the page is loaded
    if (!isMountedRef.current) {
      isMountedRef.current = true;
    } else {
      return;
    }
    getWatchlistData();
  }, []);

  const getWatchlistData = async () => {
    setLoading(true);
    try {
      const url = 'http://13.229.60.73:8000/bins';
      const params = readBID(); // array of string of bids
      const response = await axios.post(url, params);

      if (Array.isArray(response.data) && response.data.length > 0) {
        setResults(response.data);
      } else {
        setResults([]);
      }

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="page-limit-container-watchlist">
        {results.length === 0 ? (
          <p>There is currently no item in your watchlist.</p>
        ) : (
          <div className="gallery-container-watchlist">
              {results.map((result, index) => (
                <div className="gallery-item" key={index}>
                  <BinPanel
                    bid={result.bid}
                    tags={result.tags}
                    name={result.name}
                    pictureLink={result.image} 
                    capacity={result.latest_data_point?.capacity ?? 'N/A'}
                    gas={result.latest_data_point?.gas ?? 'N/A'}
                    weight={result.latest_data_point?.weight ?? 'N/A'}
                    timestamp={result.latest_data_point?.timestamp ?? 'N/A'}
                  />
                </div>
              ))}
            </div>
        )}
      </div>
    </>
  );
}

export default WatchlistPage;
