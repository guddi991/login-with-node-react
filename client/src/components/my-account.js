
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './my-account.css';
import { fetchUserDetails } from "../utils/fetchUser";

function MyAccount({ setUsername }) {
    const [userDetails, setUserDetails] = useState({});
    const [newPassword, setNewPassword] = useState('')
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()

    const getData = async () => {
        const userData = await fetchUserDetails();
        setLoading(false)
        setUserDetails(userData)
    }

    useEffect(() => {
        getData();
    }, [])

    if (loading) {
        return <div>Loading...</div>;
    }

    // set new password start
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        try {
            //   const token = localStorage.getItem('token');
            const token = sessionStorage.getItem('token');
            await axios.post('http://localhost:5000/update-password',
                { password: newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            alert('Password updated successfully');
            setNewPassword('');
            navigate('/login')

        } catch (error) {
            console.error("Error updating password:", error);
            alert('Failed to update password');
        }
    };


    // set new password end
    return (
        <div className="account">
            <h1>Account</h1>
            <div className="user-details">
                <h2>User Details</h2>
                <p><strong>Username: </strong> {userDetails.username} </p>
                <p><strong>Email: </strong> {userDetails.email} </p>
            </div>
            <div className="reset-password-box">
                <h2>Set New Password</h2>
                <form onSubmit={handlePasswordChange}>
                    <div>
                        <label>New Password:</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Update Password</button>
                </form>
            </div>
        </div>

    )
}
export default MyAccount
