import { Link } from 'react-router-dom';
import { FaRocket, FaUserGraduate, FaBriefcase } from 'react-icons/fa';
import ThemeToggle from '../components/ThemeToggle';

const Home = () => {
  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}><ThemeToggle /></div>
      <section className="hero glass">
        <div>
          <h1>Student Placement Portal</h1>
          <p>Helping Students Find Their Dream Career.</p>
          <div className="hero-actions">
            <Link to="/login" className="btn btn-primary">Login</Link>
            <Link to="/register" className="btn btn-secondary">Register</Link>
          </div>
          <div className="flex mt" style={{ marginTop: '24px' }}>
            <div className="glass" style={{ padding: '18px 20px', borderRadius: '16px' }}><FaBriefcase size={22} /> <div className="small">Top Opportunities</div></div>
            <div className="glass" style={{ padding: '18px 20px', borderRadius: '16px' }}><FaUserGraduate size={22} /> <div className="small">Career Growth</div></div>
            <div className="glass" style={{ padding: '18px 20px', borderRadius: '16px' }}><FaRocket size={22} /> <div className="small">Fast Track</div></div>
          </div>
        </div>
        <div className="glass" style={{ padding: '24px', borderRadius: '24px' }}>
          <h3>Why students love it</h3>
          <ul style={{ color: 'var(--muted)', lineHeight: '1.7' }}>
            <li>Modern profile management</li>
            <li>Track applied jobs and notes</li>
            <li>Seamless experience with secure authentication</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Home;
