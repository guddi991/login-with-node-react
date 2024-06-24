
// useState = it's a react hook that allow us to add state to functional components
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 

// component definition

function Login(){

    // username, password is a state variable
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    // handle form submission
    const handleSubmit = async (e) =>{
        e.preventDefault();  // prevent default form submission

        try{
            const response = await axios.post('http://localhost:5000/login',{ username, password });

            if(response.data.token){
                // localStorage.setItem('token', response.data.token)
                sessionStorage.setItem('token',response.data.token)
                alert('Login Successfully.')
                navigate('/dashboard');
            }
            else{
                alert('Token Not Received.')
            }
        }catch(error){
            console.error(error); // Log the error for debugging
            alert('Invalid Credentials.')
        }
    };


    return(
        <div className="card">
        <form className="login-form" onSubmit={handleSubmit}>
            <h2>Login</h2>
            <div>
                <label>Username: </label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />

            </div>
            <div>
                <label>Password: </label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit">Login</button>

        </form>
        </div>
    )
}

export default Login



