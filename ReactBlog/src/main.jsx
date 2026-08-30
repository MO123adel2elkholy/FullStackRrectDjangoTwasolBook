import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import './index.css';
import App from './App.jsx';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import SignUp from './components/AUthentication/SignUp.jsx';
import Login from './components/AUthentication/Login.jsx';
import Logout from './components/AUthentication/Logout.jsx';
import SinglePost from './components/post/SinglePost.jsx'

function RootApp() {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path="/register" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/post/:slug" element={<SinglePost/>} />
        <Route path="/*" element={<App />} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RootApp />
  </React.StrictMode>
);