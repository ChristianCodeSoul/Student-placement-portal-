import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEllipsisV, FaUser, FaStickyNote, FaSignOutAlt, FaBriefcase, FaBuilding, FaAward } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [notes, setNotes] = useState([]);
  const [noteForm, setNoteForm] = useState({ title: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5000/api' });
  const token = localStorage.getItem('token');
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [jobsRes, appliedRes, notesRes] = await Promise.all([
          api.get('/jobs'),
          api.get('/jobs/appliedJobs'),
          api.get('/notes'),
        ]);
        setJobs(jobsRes.data || []);
        setAppliedJobs(appliedRes.data || []);
        setNotes(notesRes.data || []);
      } catch (err) {
        console.error(err);
      } finally { setLoading(false); }
    };
    loadData();
  }, []);

  const handleApply = async (jobId) => {
    try {
      await api.post(`/jobs/apply/${jobId}`);
      toast.success('Applied successfully');
      const res = await api.get('/jobs/appliedJobs');
      setAppliedJobs(res.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not apply');
    }
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/notes/${editingId}`, noteForm);
        toast.success('Note updated');
      } else {
        await api.post('/notes', noteForm);
        toast.success('Note created');
      }
      const res = await api.get('/notes');
      setNotes(res.data || []);
      setNoteForm({ title: '', description: '' });
      setEditingId(null);
    } catch (err) {
      toast.error('Could not save note');
    }
  };

  const editNote = (note) => {
    setEditingId(note._id);
    setNoteForm({ title: note.title, description: note.description });
  };

  const deleteNote = async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      const res = await api.get('/notes');
      setNotes(res.data || []);
      toast.success('Note deleted');
    } catch (err) {
      toast.error('Could not delete note');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('You have successfully logged out.');
    navigate('/');
  };

  return (
    <div className="container" style={{ padding: '24px 0 50px' }}>
      <div className="header-row">
        <ThemeToggle />
        <div>
          <h2 style={{ margin: 0 }}>Welcome, {user?.firstName || 'Student'}!</h2>
          <div className="small">Track your placements and growth</div>
        </div>
        <div className="menu">
          <button className="btn btn-secondary" onClick={() => setMenuOpen(!menuOpen)}><FaEllipsisV /></button>
          {menuOpen && <div className="menu-list">
            <button onClick={() => { navigate('/profile'); setMenuOpen(false); }}><FaUser /> My Profile</button>
            <button onClick={() => { setNotesOpen(true); setMenuOpen(false); }}><FaStickyNote /> Notes</button>
            <button onClick={() => { setLogoutOpen(true); setMenuOpen(false); }}><FaSignOutAlt /> Logout</button>
          </div>}
        </div>
      </div>

      {loading ? <div className="loading-screen">Loading dashboard...</div> : (
        <div className="grid grid-2">
          <div className="dashboard-card glass">
            <h3><FaBriefcase /> Job Posted</h3>
            <p className="small">Discover the latest placement opportunities.</p>
            <button className="btn btn-primary" onClick={() => {}}>Apply Jobs</button>
          </div>
          <div className="dashboard-card glass">
            <h3><FaBriefcase /> Applied Jobs</h3>
            <p className="small">You have applied to {appliedJobs.length} jobs.</p>
            <button className="btn btn-secondary">View Applied Jobs</button>
          </div>
          <div className="dashboard-card glass">
            <h3><FaBuilding /> Companies</h3>
            <ul>
              {jobs.slice(0, 3).map((job) => <li key={job._id}>{job.companyName}</li>)}
            </ul>
            <button className="btn btn-secondary">View Companies</button>
          </div>
          <div className="dashboard-card glass">
            <h3><FaAward /> Sponsored</h3>
            <p className="small">Latest sponsored companies and opportunities.</p>
            <button className="btn btn-secondary">View Sponsors</button>
          </div>
        </div>
      )}

      {notesOpen && <div className="modal-backdrop" onClick={() => setNotesOpen(false)}><div className="modal-card glass" onClick={(e) => e.stopPropagation()}>
        <h3>Notes</h3>
        <form onSubmit={handleSaveNote}>
          <div className="form-group"><label>Title</label><input className="input" value={noteForm.title} onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })} /></div>
          <div className="form-group"><label>Description</label><textarea className="textarea" value={noteForm.description} onChange={(e) => setNoteForm({ ...noteForm, description: e.target.value })} /></div>
          <div className="flex"><button className="btn btn-primary" type="submit">Save Note</button><button className="btn btn-secondary" type="button" onClick={() => { setEditingId(null); setNoteForm({ title: '', description: '' }); }}>Clear</button></div>
        </form>
        <div style={{ marginTop: '20px' }}>
          {notes.map((note) => <div className="note-item" key={note._id}><strong>{note.title}</strong><p>{note.description}</p><div className="small">{note.date} • {note.time}</div><div className="flex mt"><button className="btn btn-secondary" onClick={() => editNote(note)}>Edit</button><button className="btn btn-secondary" onClick={() => deleteNote(note._id)}>Delete</button></div></div>)}
        </div>
      </div></div>}

      {logoutOpen && <div className="modal-backdrop" onClick={() => setLogoutOpen(false)}><div className="modal-card glass" onClick={(e) => e.stopPropagation()}>
        <h3>Logout Confirmation</h3>
        <p>Are you sure you want to logout?</p>
        <div className="flex"><button className="btn btn-primary" onClick={handleLogout}>Yes</button><button className="btn btn-secondary" onClick={() => setLogoutOpen(false)}>No</button></div>
      </div></div>}
    </div>
  );
};

export default Dashboard;
