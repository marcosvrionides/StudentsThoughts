import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from './App.js';
import Login from "./LoginScreen/Login.js";
import Home from "./Home/Home.js";
import NewCommunityForm from "./Communities/NewCommunityForm.js";
import { AuthContextProvider } from './Context/AuthContext.js';
import TermsAndConditions from './TermsAndConditions/TermsAndConditions.js';
import Account from './Account/Account.js';
import NewGroupChatForm from './Messages/NewGroupChatForm.js';
import Settings from './Settings/Settings.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthContextProvider>
    <BrowserRouter>
      <React.StrictMode>
        <Routes>
          <Route index element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/home/:community" element={<Home />} />
          <Route path="/new_community" element={<NewCommunityForm />} />
          <Route path='/terms_and_conditions' element={<TermsAndConditions />} />
          <Route path="/account" element={<Account />} />
          <Route path="/account/:userID" element={<Account />} />
          <Route path="/new_group_chat" element={<NewGroupChatForm />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </React.StrictMode>
    </BrowserRouter>
  </AuthContextProvider>
);
