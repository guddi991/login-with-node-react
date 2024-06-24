
import React, { useState } from 'react';
import axios from 'axios';

function Signup() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/signup', { email, username, password });
      alert('Signup successful');
    } catch (error) {
        console.error('Error during signup:', error.response?.data || error.message);
        if (error.response && error.response.status === 400) {
          alert('Username already exists');
        } else {
        console.error('Error during signup:', error.response?.data || error.message);
          alert('Signup failed');
        }
      }
  };

  return (
    
    <form className="signup-form" onSubmit={handleSubmit}>
      <h2>Signup</h2>
      <div>
        <label>Email:</label>
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <button type="submit">Signup</button>
    </form>
  );
}

export default Signup;
