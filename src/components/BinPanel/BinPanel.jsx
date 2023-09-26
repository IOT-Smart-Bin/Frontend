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

  const link = `/bin/:${bid}`;

  return (
    <a href={link}>
      <div className="square-box">
        <div className="top">
          <h5 className='truncate-text'><strong>{name ?? 'N/A'}</strong></h5>
        </div>
        <div className="middle">
          <div className="left-side">
            <img
              src={pictureLink || 'https://via.placeholder.com/200x200?text=Placeholder'}
              width="100%"
              height="100%"
            />
          </div>
        </div>
        <div className="bottom">
          <p className='truncate-text'><strong>Tags:</strong> {tags?.join(', ') || 'N/A'}</p>
          <div className="column-container">
            <p className='column'><strong>Capacity:</strong> {capacity ?? 'N/A'}%</p>
            <p className='column'><strong>Gas:</strong> {gas ?? 'N/A'}%</p>
          </div>
          <p>Last updated: {timestamp ?? 'N/A'}</p>
        </div>
      </div>
    </a>
  );
}

export default BinPanel;
