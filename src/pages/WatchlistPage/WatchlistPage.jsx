import React, { useState } from 'react';
import axios from 'axios';
import "./watchlist-page.css";
import BinPanel from '../../components/BinPanel/BinPanel';
import mockData from '../../MockData'
import { readBID, } from '../../util/localStorageReadWrite';
import { useEffect } from 'react';

function WatchlistPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // get the data of bids in watchlist and store them in an array upon entering the page
  useEffect(() => {
    getWatchlistData();
    console.log('hello 1')
  }, []);

  const getWatchlistData = async () => {
    setLoading(true);
    try {
      const watchlistBids = readBID(); // array of string of bids
      const url = 'endpoint';
      const params = { watchlistBids };
      //const response = await axios.get(url, { params });
      const response = mockData;
      if (Array.isArray(response) && response.length === 0) {
        setResults([]);
      } else {
        setResults(response);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="page-limit-container">
        {results.length === 0 ? (
          <p>There is currently no item in your watchlist.</p>
        ) : (
          <div className="gallery-container">
            {results.map((result, index) => (
              <div className="gallery-item" key={index}>
                <BinPanel
                  bid={result.bid}
                  tags={result.tags}
                  name={result.name}
                  pictureLink={result.pictureLink}
                  capacity={result.capacity}
                  gas={result.gas}
                  weight={result.weight}
                  timestamp={result.timestamp}
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
