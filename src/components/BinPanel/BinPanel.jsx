import React from 'react';
import PropTypes from 'prop-types';
import './bin-panel.css';

function BinPanel({ bid, tags, name, pictureLink, capacity, gas, weight, timestamp, humidity, lat, long }) {
  BinPanel.propTypes = {
    bid: PropTypes.string,
    tags: PropTypes.array,
    name: PropTypes.string,
    pictureLink: PropTypes.string,
    capacity: PropTypes.number,
    gas: PropTypes.float,
    weight: PropTypes.float,
    timestamp: PropTypes.string,
    humidity: PropTypes.number,
    lat: PropTypes.number,
    long: PropTypes.number,
  };

  const link = `/bin/${bid}`;

  // if timestamp is not empty, change it to YYYY/MM/DD HH/MM/SS pattern
  function formatTimestamp(timestamp) {
    if (!timestamp || timestamp === 'N/A') return 'N/A';

    const dateObj = new Date(timestamp);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    const seconds = String(dateObj.getSeconds()).padStart(2, '0');

    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  }

  let capacityClass;
  if (capacity >= 0 && capacity < 40) {
    capacityClass = 'low-capacity';
  } else if (capacity >= 40 && capacity < 75) {
    capacityClass = 'medium-capacity';
  } else if (capacity >= 75){
    capacityClass = 'high-capacity';
  } else {
    capacityClass = 'invalid-capacity';
  }

  let gasClass;
  if (gas >= 0 && gas < 40) {
    gasClass = 'low-capacity';
  } else if (gas >= 40 && gas < 75) {
    gasClass = 'medium-capacity';
  } else if (gas >= 75){
    gasClass = 'high-capacity';
  } else {
    gasClass = 'invalid-capacity';
  }


  return (
    <a href={link}>
      <div className="square-box">
        <div className="top">
          <h5 className='truncate-text'><strong>{name ?? 'N/A'}</strong></h5>
        </div>
        <div className="middle">
          <div className="left-side">
            <img src={pictureLink || 'https://via.placeholder.com/200x200?text=Placeholder'}
              width="200px"
              height="200px"
            />
          </div>
        </div>
        <div className="bottom">
          <p className='truncate-text'><strong>Tags:</strong> {tags?.join(', ') || 'N/A'}</p>
          <div className="column-container">
            <p className={`column ${capacityClass}`}> <strong>Capacity:</strong> {capacity ?? 'N/A'}% </p>
            <p className={`column ${gasClass}`}><strong>Gas:</strong> {gas ?? 'N/A'}%</p>
          </div>
          <p className='small-font'>Last updated: {formatTimestamp(timestamp) ?? 'N/A'}</p>
        </div>
      </div>
    </a>
  );
}

export default BinPanel;
