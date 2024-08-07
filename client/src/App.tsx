/* eslint-disable import/no-named-as-default */
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import theme from './assets/theme';
import { store, persistor } from './util/redux/store';
import NotFoundPage from './NotFound/NotFoundPage';
import HomePage from './Home/HomePage';
import AdminDashboardPage from './AdminDashboard/AdminDashboardPage';
import {
  UnauthenticatedRoutesWrapper,
  ProtectedRoutesWrapper,
  DynamicRedirect,
  AdminRoutesWrapper,
} from './util/routes';
import VerifyAccountPage from './Authentication/VerifyAccountPage';
import RegisterPage from './Authentication/RegisterPage';
import LoginPage from './Authentication/LoginPage';
import EmailResetPasswordPage from './Authentication/EmailResetPasswordPage';
import ResetPasswordPage from './Authentication/ResetPasswordPage';
import AlertPopup from './components/AlertPopup';
import InviteRegisterPage from './Authentication/InviteRegisterPage';
import DonorProfilePage from './donorProfile/DonorProfilePage';
import ReportsPage from './Reports/ReportsPage';
import CommunicationsPage from './Communications/CommunicationsPage';
import HomeDashboardPage from './HomeDashboard/HomeDashboard';
import EmailModal from './components/EmailModal';
import AddEditGroupsModal from './components/AddEditGroupsModal';
import NewDonationPage from './NewDonation/NewDonationPage';
import Sidebar from './Sidebar/Sidebar';
import DonationInfoPage from './DonationInfo/DonationInfoPage';
import PopupPage from './Popup/PopupPage';
import DonationDahsboard from './DonorDashboard/DonorDahsboard';

function App() {
  const showSidebarRoutes = [
    '/login',
    '/register',
    '/verify-account/:token',
    '/email-reset',
    '/reset-password/:token',
  ];

  return (
    <div className="App">
      <BrowserRouter>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ThemeProvider theme={theme}>
              <CssBaseline>
                <AlertPopup />
                <Routes>
                  {/* Routes accessed only if user is not authenticated */}
                  <Route element={<UnauthenticatedRoutesWrapper />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route
                      path="/verify-account/:token"
                      element={<VerifyAccountPage />}
                    />
                    <Route
                      path="/email-reset"
                      element={<EmailResetPasswordPage />}
                    />
                    <Route
                      path="/reset-password/:token"
                      element={<ResetPasswordPage />}
                    />
                  </Route>
                </Routes>
                <Sidebar
                  routesShown={showSidebarRoutes}
                  side={
                    <Routes>
                      <Route path="/test-sidebar" element={<Sidebar />} />
                      <Route
                        path="/new-donation"
                        element={<NewDonationPage />}
                      />
                      {/* <Route path="/popup" element={<PopupPage />} /> */}
                      <Route
                        path="/invite/:token"
                        element={<InviteRegisterPage />}
                      />
                      <Route
                        path="/donor-profile/:donatorId"
                        element={<DonorProfilePage />}
                      />
                      <Route path="/home" element={<HomeDashboardPage />} />

                      {/* Routes accessed only if user is authenticated */}
                      <Route element={<ProtectedRoutesWrapper />}>
                        <Route path="/home" element={<HomePage />} />
                        <Route
                          path="/donationInfo/:donationId"
                          element={<DonationInfoPage />}
                        />
                        <Route
                          path="/donorDashboard"
                          element={<DonationDahsboard />}
                        />
                        <Route path="/reports" element={<ReportsPage />} />
                        <Route
                          path="/communications"
                          element={<CommunicationsPage />}
                        />
                        <Route path="/emailmodal" element={<EmailModal />} />
                        <Route
                          path="/addeditgroupsmodal"
                          element={<AddEditGroupsModal />}
                        />
                      </Route>
                      <Route element={<AdminRoutesWrapper />}>
                        <Route path="/users" element={<AdminDashboardPage />} />
                      </Route>

                      {/* Route which redirects to a different page depending on if the user is an authenticated or not by utilizing the DynamicRedirect component */}
                      <Route
                        path="/"
                        element={
                          <DynamicRedirect
                            unAuthPath="/login"
                            authPath="/home"
                          />
                        }
                      />

                      {/* Route which is accessed if no other route is matched */}
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  }
                />
              </CssBaseline>
            </ThemeProvider>
          </PersistGate>
        </Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
