/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable global-require */
import React, { useEffect } from 'react';
import './sidebar.css';
import '../assets/westPark.png';
import { useLocation } from 'react-router-dom';
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
  const [show, setShow] = React.useState(false);
  const location = useLocation();

  useEffect(() => {
    if (props && props.routesShown) {
      const showSidebar = !props.routesShown.some((route: string) => {
        const regex = new RegExp(`^${route.replace(/:\w+/g, '\\w+')}$`);
        return regex.test(location.pathname);
      });
      setShow(showSidebar);
    }
  }, [props, location.pathname]);

  return (
    <div>
      {show && (
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
                          <div
                            className="sidebar-link"
                            onClick={() => navto('/')}
                          >
                            <i className="fa-solid fa-house" /> &nbsp;{' '}
                            <span className="sidebartext">Home</span>
                          </div>
                          <div
                            className="sidebar-link"
                            onClick={() => navto('/donorDashboard')}
                          >
                            <i className="fa-solid fa-table-columns" /> &nbsp;{' '}
                            <span className="sidebartext">Donor Dashboard</span>
                          </div>
                          <div
                            className="sidebar-link"
                            onClick={() => navto('/communications')}
                          >
                            <i className="fa-solid fa-envelope" /> &nbsp;{' '}
                            <span className="sidebartext">Communications</span>
                          </div>
                          <div
                            className="sidebar-link"
                            onClick={() => navto('/new-donation')}
                          >
                            <i className="fa-solid fa-plus" /> &nbsp;{' '}
                            <span className="sidebartext">New Donation</span>
                          </div>
                          <div
                            className="sidebar-link"
                            onClick={() => navto('/reports')}
                          >
                            <i className="fa-solid fa-sheet-plastic" /> &nbsp;{' '}
                            <span className="sidebartext">Reports</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <div className="sidebar-wrapper-container"> */}
                    <div className="sidebar-bottom">
                      <div className="sidebar-bottom-links">
                        <a
                          className="sidebar-log-out"
                          href="/"
                          onClick={() => logout()}
                        >
                          <i className="fa-solid fa-right-from-bracket" />{' '}
                          &nbsp;
                          <span className="sidebartext">Log Out</span>
                        </a>
                      </div>
                    </div>
                    {/* </div> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="main-content">{props.side}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
