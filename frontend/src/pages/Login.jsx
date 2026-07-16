import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(form.username, form.password);
      toast.success("You're logged in!");
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <div className="auth-card glass">
        <h2 style={{ marginTop: 0 }}>Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input className="input" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="password-row">
              <input className="input" type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              <button type="button" className="btn btn-secondary" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaEyeSlash /> : <FaEye />}</button>
            </div>
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
          <div className="flex" style={{ justifyContent: 'space-between', marginTop: '12px' }}>
            <a href="#" className="small">Forgot Password (dummy)</a>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Link to="/register" className="small">Register</Link>
              <Link to="/" className="btn btn-secondary" style={{ padding: '8px 12px' }}>Back</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
