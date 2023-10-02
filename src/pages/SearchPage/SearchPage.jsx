import React, { useState } from 'react';
import axios from 'axios';
import "./search-page.css";
import BinPanel from '../../components/BinPanel/BinPanel';

function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(undefined);
  const [loading, setLoading] = useState(false);

  // request for bin data using user's input name 
  const handleSearch = async () => {
    setLoading(true);

    try {
      const url = 'http://13.229.60.73:8000/search';
      const params = {
        name: query,
        tag: [],
      };
      const response = await axios.post(url, params);

      if (Array.isArray(response.data) && response.data.length > 0) {
        setResults(response.data);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error(error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="search-page-limit-container">
        <div className={`${!results && "page-content-container"}`}>
          {!results && (
            <div>
              <h1 className='title-box'>
                Welcome to Trash App.
              </h1>
              <h5 className='title-box'>
                Search with your bin's name to get started.
              </h5>
            </div>
          )}
          <div className="search-bar">
            <form onSubmit={handleSearch} className='form-container'>
              <input className="search-input" type="text" placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
              <button onClick={handleSearch} disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
              </button>
            </form>
          </div>
          {results && (
            <div className="page-limit-container">
              {results.length === 0 ? (
                <p>No results found.</p>
              ) : (
                <div className="gallery-container">
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
          )}
        </div>
      </div>
    </>
  );
}

export default SearchPage;
