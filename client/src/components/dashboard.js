
import React, { useEffect, useState } from "react";
import { NavLink,Route,Routes } from "react-router-dom";
import './dashboard.css';
import MyAccount from "./my-account";
import AboutUs from "./about-us";
import { fetchUserDetails } from "../utils/fetchUser";

function Dashboard(){
    const [username, setUsername] = useState("");

    const getData = async () => {
        const userData = await fetchUserDetails();
        setUsername(userData.username);
    }

    useEffect(() => {
        getData();
    }, [username])

    return (
        <div className="dashboard-container">
            <nav className="sidebar">
                <div className="sidebar-header">
                    <h2>Menu</h2>
                </div>

                <ul className="sidebar-menu">
                    <li>
                    <NavLink to="/my-account" activeClassName="active-link">My Account</NavLink>

                    {/* <a href="/my-account">My Account</a> */}
                    </li>
                    <li>
                    <NavLink to="/about-us" activeClassName="active-link">About Us</NavLink>
                    {/* <a href="/about-us">About Us</a> */}
                    </li>
                </ul>
            </nav>
            <div className="main-content">
                <header className="topbar">
                    <h1>Dashboard</h1>
                    <div className="user-info">
                        <p>Welcome {username ? username : ""}</p>
                        <a herf="#">Logout</a>
                    </div>
                </header>
                <div className="content">
                    <Routes>
                        <Route path="my-account" element={<MyAccount setUsername={setUsername} />}></Route>
                        <Route path="aboutus" element={<AboutUs />}></Route>
                        <Route path="/" element={<div className="card"><h3>Welcome!</h3></div>} />
                    </Routes>
                </div>
            </div>
        </div>
    )
}

export default Dashboard

