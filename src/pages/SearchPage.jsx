
import React, { useState } from 'react';
import axios from 'axios';
import "./search-page.css";

function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (name, tag) => {
    try {
      const url = ``
      const params = {
        Name: name,
        tag: tag,
      };
      const response = await axios.get(url, { params });
      console.log('Search response is: ' + response)
      return response

    } catch (error) {
      console.error(error);
      return null;
    };
  };

  return (
    <div className='fullpage-container center'>
      <header className="fixed-header">
        <div>
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </header>
      <div>
        {results.length === 0 ? (
          <p>No results found.</p>
        ) : (
          <ul>
            {results.map((result, index) => (
              <li key={index}>{result}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
