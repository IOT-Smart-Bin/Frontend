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
    lat: PropTypes.number, // float
    long: PropTypes.number, // float

  };

  return (
    <div className="square-box">
      <div className="top">
        <h4><strong>{name ?? 'N/A'}</strong></h4>
      </div>
      <div className="bottom">
        <div className="left-side">
          <img
            src={pictureLink || 'https://via.placeholder.com/200x200?text=Placeholder'}
            width="100%"
            height="100%"
          />
        </div>
        <div className="right-side">
          <p><strong>Tags:</strong> {tags?.join(', ') || 'N/A'}</p>
          <p><strong>Capacity:</strong> {capacity ?? 'N/A'}%</p>
          <p><strong>Gas:</strong> {gas ?? 'N/A'}</p>
          <p><strong>Last updated:</strong> {timestamp ?? 'N/A'}</p>
        </div>
      </div>
    </div>

  );
}

export default BinPanel;
