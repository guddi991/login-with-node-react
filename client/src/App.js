
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import PrivateRoute from './components/privateroute';
import Login from './components/login'
import Signup from './components/signup'
import Dashboard from './components/dashboard';
import MyAccount from './components/my-account';
import AboutUs from './components/about-us';

function App() {
  return (
    <Router>
      <div className="App-react">
        <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/my-account" element={<PrivateRoute><MyAccount /></PrivateRoute>} />
        <Route path="/about-us" element={<PrivateRoute><AboutUs /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;

