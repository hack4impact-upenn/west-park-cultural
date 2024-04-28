/* eslint-disable global-require */
import React from 'react';
import './sidebar.css';
import '../assets/westPark.png';
/**
 * A page for showing a 404 error to the user and offering a rediect to the
 * the home page.
 */
function Sidebar() {
  return (
    <div className="overallwrapper">
      <div className="sidebar-parent-flex">
        <div className="sidewrapper">
          <div className="sidebar-inner">
            <div className="imgwrapper">
              <img
                src={require('../assets/westPark.png')}
                alt="logo"
                className="imglogo"
              />
            </div>
            <div className="sidebar-links">
              <div className="sidebar-link">Home</div>
            </div>
          </div>
        </div>
        <div className="main-content">Main</div>
      </div>
    </div>
  );
}

export default Sidebar;
