/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable global-require */
import React from 'react';
import './sidebar.css';
import '../assets/westPark.png';
import { postData } from '../util/api';
/**
 * A page for showing a 404 error to the user and offering a rediect to the
 * the home page.
 */
function Sidebar(props: any) {
  const logout = async () => {
    const res = await postData('auth/logout');
  };

  const navto = (path: string) => {
    window.location.href = path;
  };
  return (
    <div className="sidebar overallwrapper">
      <div className="sidebar-parent-flex">
        <div className="sidewrapper">
          <div className="sidebar-inner">
            <div className="abs-wrapper">
              <div className="sidebar-direction-wrapper">
                <div className="sidebar-top-wrapper">
                  <div className="imgwrapper">
                    <img
                      src={require('../assets/westPark.png')}
                      alt="logo"
                      className="imglogo"
                    />
                  </div>
                  <div className="sidebar-menu">
                    <div className="sidebar-menu-links">
                      <div className="sidebar-link" onClick={() => navto('/')}>
                        <i className="fa-solid fa-house" /> &nbsp; Home
                      </div>
                      <div
                        className="sidebar-link"
                        onClick={() => navto('/donor-dashboard')}
                      >
                        <i className="fa-solid fa-table-columns" /> &nbsp; Donor
                        Dashboard
                      </div>
                      <div
                        className="sidebar-link"
                        onClick={() => navto('/communication')}
                      >
                        <i className="fa-solid fa-envelope" /> &nbsp;
                        Communications
                      </div>
                      <div
                        className="sidebar-link"
                        onClick={() => navto('/new-donation')}
                      >
                        <i className="fa-solid fa-plus" /> &nbsp; New Donation
                      </div>
                    </div>
                  </div>
                </div>
                <div className="sidebar-bottom">
                  <div className="sidebar-bottom-links">
                    <a
                      className="sidebar-log-out"
                      href="/"
                      onClick={() => logout()}
                    >
                      <i className="fa-solid fa-right-from-bracket" /> &nbsp;
                      Log Out
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="main-content">{props.side}</div>
      </div>
    </div>
  );
}

export default Sidebar;
