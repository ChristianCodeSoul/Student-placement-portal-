import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
    <div className="auth-card glass">
      <h1>404</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" className="btn btn-primary">Go Home</Link>
    </div>
  </div>
);

export default NotFound;
