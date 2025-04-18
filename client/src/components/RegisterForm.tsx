// client/src/components/RegisterForm.tsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function RegisterForm() {
  const auth     = useContext(AuthContext)!;
  const [email, setEmail]       = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // now passing email, username, password in the right order
      await auth.register(email, username, password);
      navigate('/login');
    } catch {
      alert('Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 360, margin: '2rem auto' }}>
      <div>
        <label>Email</label><br/>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <label>Username</label><br/>
        <input
          placeholder="yourusername"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <label>Password</label><br/>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" style={{ marginTop: 16, width: '100%' }}>
        Register
      </button>
    </form>
  );
}
