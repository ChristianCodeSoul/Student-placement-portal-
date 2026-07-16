import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ firstName: '', lastName: '', username: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};
    if (!form.firstName.trim()) nextErrors.firstName = 'First name is required';
    if (!form.lastName.trim()) nextErrors.lastName = 'Last name is required';
    if (!form.username.trim()) nextErrors.username = 'Username is required';
    else if (!/^[a-zA-Z][A-Za-z0-9]{5,}$/.test(form.username)) nextErrors.username = 'Username must start with a letter and be at least 6 letters/numbers';
    if (!form.email.trim()) nextErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Please enter a valid email';
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!form.password) nextErrors.password = 'Password is required';
    else if (!passwordRegex.test(form.password)) nextErrors.password = 'Password must contain upper, lower, number, special char and be 8+ chars';
    if (form.confirmPassword !== form.password) nextErrors.confirmPassword = 'Passwords must match';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const getStrength = () => {
    const value = form.password;
    let score = 0;
    if (value.length >= 8) score += 1;
    if (/[A-Z]/.test(value)) score += 1;
    if (/[a-z]/.test(value)) score += 1;
    if (/\d/.test(value)) score += 1;
    if (/[^A-Za-z0-9]/.test(value)) score += 1;
    return Math.min(score, 5);
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the form errors and try again');
      return;
    }
    try {
      setLoading(true);
      const res = await register(form);
      console.log('register response', res);
      toast.success(res?.message || 'You are registered!');
      // navigate to login after short delay so user sees toast
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error('Register error', err);
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const strengthPercent = `${(getStrength() / 5) * 100}%`;
  const strengthColor = ['#ff4d4f', '#ff9f43', '#f7b731', '#4cd137', '#2ecc71'][getStrength() - 1] || '#dfe6e9';

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <div className="auth-card glass">
        <h2 style={{ marginTop: 0 }}>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-2">
            <div className="form-group">
              <label>First Name</label>
              <input className="input" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
              {errors.firstName && <div className="small">{errors.firstName}</div>}
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input className="input" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
              {errors.lastName && <div className="small">{errors.lastName}</div>}
            </div>
          </div>
          <div className="form-group">
            <label>Username</label>
            <input className="input" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            {errors.username && <div className="small">{errors.username}</div>}
          </div>
          <div className="form-group">
            <label>Email</label>
            <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            {errors.email && <div className="small">{errors.email}</div>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="password-row">
              <input className="input" type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              <button type="button" className="btn btn-secondary" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaEyeSlash /> : <FaEye />}</button>
            </div>
            <div className="strength-bar"><div className="strength-fill" style={{ width: strengthPercent, background: strengthColor }} /></div>
            <div className="small">Use 8+ chars with uppercase, lowercase, number and special character.</div>
            {errors.password && <div className="small">{errors.password}</div>}
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <div className="password-row">
              <input className="input" type={showConfirm ? 'text' : 'password'} value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
              <button type="button" className="btn btn-secondary" onClick={() => setShowConfirm(!showConfirm)}>{showConfirm ? <FaEyeSlash /> : <FaEye />}</button>
            </div>
            {errors.confirmPassword && <div className="small">{errors.confirmPassword}</div>}
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', alignItems: 'center' }}>
            <p className="small" style={{ margin: 0 }}>Already have an account? <Link to="/login">Login</Link></p>
            <Link to="/" className="btn btn-secondary" style={{ padding: '8px 12px' }}>Back</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
