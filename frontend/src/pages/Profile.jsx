import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaCloudUploadAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

const Profile = () => {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    status: 'Student',
    state: '',
    city: '',
    university: '',
    course: '',
    yearStarted: '',
    yearGraduation: '',
    phone: '',
    address: '',
    secondaryEmail: '',
    linkedin: '',
    github: '',
    portfolio: '',
    skills: '',
    bio: '',
    profileImage: '',
    resume: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [loading, setLoading] = useState(false);
  const imageInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  // Expanded state -> city map (sample cities) and university suggestions
  const stateOptions = {
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
    'Karnataka': ['Bengaluru', 'Mysore', 'Mangalore', 'Hubli'],
    'Delhi': ['New Delhi'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai'],
    'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode'],
    'West Bengal': ['Kolkata', 'Siliguri', 'Durgapur'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Varanasi'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara'],
    'Rajasthan': ['Jaipur', 'Udaipur', 'Jodhpur'],
    'Telangana': ['Hyderabad', 'Warangal'],
    'Andhra Pradesh': ['Vijayawada', 'Visakhapatnam'],
    'Punjab': ['Chandigarh', 'Ludhiana', 'Amritsar'],
    'Haryana': ['Gurugram', 'Faridabad', 'Panipat'],
    'Bihar': ['Patna', 'Gaya'],
    'Odisha': ['Bhubaneswar', 'Cuttack'],
    'Madhya Pradesh': ['Indore', 'Bhopal'],
    'Chhattisgarh': ['Raipur'],
    'Jharkhand': ['Ranchi'],
    'Assam': ['Guwahati'],
    'Goa': ['Panaji'],
    'Himachal Pradesh': ['Shimla'],
    'Uttarakhand': ['Dehradun'],
    'Jammu & Kashmir': ['Srinagar', 'Jammu'],
    'North East': ['Imphal', 'Aizawl', 'Shillong', 'Agartala'],
    'Sikkim': ['Gangtok'],
    'Puducherry': ['Puducherry']
  };

  const universityOptions = {
    Mumbai: ['University of Mumbai', 'IIT Bombay', 'St. Xavier\u2019s College'],
    Pune: ['Savitribai Phule Pune University', 'COEP', 'Symbiosis International University'],
    Nagpur: ['RTM Nagpur University', 'Gurunanak Institute'],
    Nashik: ['Yashwantrao Chavan Maharashtra Open University'],
    Bengaluru: ['Bangalore University', 'IIIT Bangalore', 'IISc Bangalore'],
    Mysore: ['University of Mysore'],
    Mangalore: ['Mangalore University', 'NITK Surathkal'],
    Chennai: ['Anna University', 'IIT Madras'],
    Coimbatore: ['Anna University Coimbatore', 'PSG Tech'],
    Madurai: ['Madurai Kamaraj University'],
    Thiruvananthapuram: ['University of Kerala', 'IIT Palakkad (nearby)'],
    Kochi: ['Cochin University of Science and Technology'],
    Kozhikode: ['Calicut University'],
    Kolkata: ['University of Calcutta', 'Jadavpur University'],
    Siliguri: ['North Bengal University'],
    Lucknow: ['University of Lucknow'],
    Kanpur: ['IIT Kanpur'],
    Varanasi: ['Banaras Hindu University'],
    Ahmedabad: ['IIT Gandhinagar', 'Gujarat University'],
    Surat: ['Sardar Vallabhbhai National Institute'],
    Jaipur: ['University of Rajasthan'],
    Hyderabad: ['University of Hyderabad', 'IIT Hyderabad', 'Osmania University'],
    Vijayawada: ['Acharya Nagarjuna University'],
    Visakhapatnam: ['Andhra University', 'IIT Vizag'],
    Chandigarh: ['Panjab University'],
    Ludhiana: ['Punjab Agricultural University'],
    Patna: ['Patna University'],
    Bhubaneswar: ['Utkal University', 'IIT Bhubaneswar'],
    Indore: ['DAVV (Devi Ahilya Vishwavidyalaya)'],
    Bhopal: ['Barkatullah University'],
    Raipur: ['IGNTU (nearby)'],
    Ranchi: ['Ranchi University'],
    Guwahati: ['Gauhati University', 'IIT Guwahati'],
    Panaji: ['Goa University'],
    Shimla: ['Himachal Pradesh University'],
    Dehradun: ['Doon University'],
    Srinagar: ['University of Kashmir'],
    Gangtok: ['Sikkim University'],
    Puducherry: ['Pondicherry University']
  };

  const api = axios.create({ baseURL: 'http://localhost:5000/api' });
  const token = localStorage.getItem('token');
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;

  const ensureAbsolute = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    // handle backend-relative uploads like '/uploads/..'
    const backendBase = api.defaults.baseURL.replace('/api', '');
    if (url.startsWith('/uploads/')) return `${backendBase}${url}`;
    return url;
  };

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const res = await api.get('/auth/profile');
        // merge server data into existing form state safely
        setProfileForm((prev) => ({ ...prev, ...res.data }));
        setPreviewImage(ensureAbsolute(res.data.profileImage) || '');
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      // If user selected an image or resume but didn't click the dedicated upload buttons,
      // upload them automatically first so the PUT saves backend paths.
      let payload = { ...profileForm };
      let imgRes = null;
      let resu = null;
        if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        imgRes = await api.post('/auth/uploadImage', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        payload.profileImage = imgRes.data.profileImage;
        setPreviewImage(ensureAbsolute(imgRes.data.profileImage));
      }
      if (resumeFile) {
        if (resumeFile.type !== 'application/pdf') {
          toast.error('Resume must be a PDF');
          return;
        }
        const formData = new FormData();
        formData.append('resume', resumeFile);
        resu = await api.post('/auth/uploadResume', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        payload.resume = resu.data.resume;
        setResumeFile(null);
        if (resumeInputRef.current) resumeInputRef.current.value = null;
      }

      const res = await api.put('/auth/profile', payload);
      toast.success('Profile saved');
      await refreshProfile();
      setProfileForm((prev) => ({ ...prev, ...res.data }));
    } catch (err) {
      toast.error('Could not save profile');
    }
  };

  const uploadImage = async () => {
    if (!imageFile) {
      toast.error('Please choose an image');
      return;
    }
    const formData = new FormData();
    formData.append('image', imageFile);
    const res = await api.post('/auth/uploadImage', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    setPreviewImage(ensureAbsolute(res.data.profileImage));
    setProfileForm((prev) => ({ ...prev, profileImage: res.data.profileImage }));
    toast.success('Profile image updated');
  };

  const uploadResume = async () => {
    if (!resumeFile) {
      toast.error('Please choose a resume');
      return;
    }
    if (resumeFile.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed');
      return;
    }
    const formData = new FormData();
    formData.append('resume', resumeFile);
    const res = await api.post('/auth/uploadResume', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    setProfileForm((prev) => ({ ...prev, resume: res.data.resume }));
    setResumeFile(null);
    if (resumeInputRef.current) resumeInputRef.current.value = null;
    toast.success('Resume uploaded');
  };

  return (
    <div className="container" style={{ padding: '24px 0 50px' }}>
      <div className="header-row">
        <ThemeToggle />
        <div>
          <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}><FaArrowLeft /> Back to Dashboard</button>
          <h2 style={{ margin: '12px 0 0' }}>My Profile</h2>
          <div className="small">Your saved registration and profile details.</div>
        </div>
      </div>

      {loading ? <div className="loading-screen">Loading profile...</div> : (
        <div className="modal-card glass" style={{ padding: '24px', width: '100%', maxWidth: '100%' }}>
          <form onSubmit={saveProfile}>
            <div className="form-group">
              <label>Profile Picture</label>
              {previewImage ? <img src={previewImage} alt="profile" style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', marginBottom: 8 }} /> : <div className="small">No image uploaded</div>}
              <input ref={imageInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setImageFile(file);
                  setPreviewImage(URL.createObjectURL(file));
                }
              }} />
              <div className="flex mt">
                <button type="button" className="btn btn-secondary" onClick={() => imageInputRef.current?.click()}>{imageFile ? 'Change Photo' : 'Choose Photo'}</button>
                <button type="button" className="btn btn-secondary" onClick={uploadImage} disabled={!imageFile}>Upload Image</button>
                <button type="button" className="btn btn-secondary" onClick={() => { setPreviewImage(''); setImageFile(null); if (imageInputRef.current) imageInputRef.current.value = null; }}>Remove</button>
              </div>
            </div>

            <div className="grid grid-2">
              <div className="form-group"><label>First Name</label><input className="input" value={profileForm.firstName || ''} onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })} /></div>
              <div className="form-group"><label>Last Name</label><input className="input" value={profileForm.lastName || ''} onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })} /></div>
              <div className="form-group"><label>Username</label><input className="input" value={profileForm.username || ''} onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })} /></div>
              <div className="form-group"><label>Email</label><input className="input" value={profileForm.email || ''} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} /></div>
            </div>

            <div className="form-group"><label>Current Status</label><select className="select" value={profileForm.status || 'Student'} onChange={(e) => setProfileForm({ ...profileForm, status: e.target.value })}><option>Student</option><option>Fresher</option><option>Looking for Job</option><option>Working Professional</option></select></div>
            {(profileForm.status === 'Student' || profileForm.status === 'Fresher') && <div className="grid grid-2"><div className="form-group"><label>State</label><select className="select" value={profileForm.state || ''} onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value, city: '', university: '' })}><option value="">Select state</option>{Object.keys(stateOptions).map((state) => <option key={state} value={state}>{state}</option>)}</select></div><div className="form-group"><label>City</label><select className="select" value={profileForm.city || ''} onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value, university: '' })} disabled={!profileForm.state}><option value="">Select city</option>{(stateOptions[profileForm.state] || []).map((city) => <option key={city} value={city}>{city}</option>)}</select></div></div>}
            {(profileForm.city || profileForm.university) && <div className="form-group"><label>University / College</label><select className="select" value={profileForm.university || ''} onChange={(e) => setProfileForm({ ...profileForm, university: e.target.value })} disabled={!profileForm.city}><option value="">Select university or college</option>{(universityOptions[profileForm.city] || []).map((school) => <option key={school} value={school}>{school}</option>)}</select></div>}
            {profileForm.status === 'Student' && <>
              <div className="grid grid-2">
                <div className="form-group"><label>Course</label><input className="input" value={profileForm.course || ''} onChange={(e) => setProfileForm({ ...profileForm, course: e.target.value })} /></div>
                <div className="form-group"><label>Year Started</label><input className="input" value={profileForm.yearStarted || ''} onChange={(e) => setProfileForm({ ...profileForm, yearStarted: e.target.value })} /></div>
              </div>
              <div className="form-group"><label>Year Graduation</label><input className="input" value={profileForm.yearGraduation || ''} onChange={(e) => setProfileForm({ ...profileForm, yearGraduation: e.target.value })} /></div>
            </>}

            <div className="form-group">
              <label>Resume (PDF only)</label>
              <input ref={resumeInputRef} type="file" accept="application/pdf" style={{ display: 'none' }} onChange={(e) => setResumeFile(e.target.files[0])} />
              <div className="flex" style={{ gap: '10px', flexWrap: 'wrap' }}>
                <button type="button" className="btn btn-secondary" onClick={() => resumeInputRef.current?.click()}>{resumeFile ? 'Change Resume' : 'Choose Resume'}</button>
                <button type="button" className="btn btn-secondary" onClick={uploadResume} disabled={!resumeFile}>Upload Resume</button>
                {profileForm.resume && <a className="btn btn-secondary" href={ensureAbsolute(profileForm.resume)} target="_blank" rel="noreferrer">View Uploaded Resume</a>}
              </div>
            </div>

            <div className="grid grid-2"><div className="form-group"><label>Phone Number</label><input className="input" value={profileForm.phone || ''} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} /></div><div className="form-group"><label>Address</label><input className="input" value={profileForm.address || ''} onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })} /></div><div className="form-group"><label>Secondary Email</label><input className="input" value={profileForm.secondaryEmail || ''} onChange={(e) => setProfileForm({ ...profileForm, secondaryEmail: e.target.value })} /></div><div className="form-group"><label>LinkedIn URL</label><input className="input" value={profileForm.linkedin || ''} onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })} /></div><div className="form-group"><label>GitHub URL</label><input className="input" value={profileForm.github || ''} onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })} /></div><div className="form-group"><label>Portfolio Website</label><input className="input" value={profileForm.portfolio || ''} onChange={(e) => setProfileForm({ ...profileForm, portfolio: e.target.value })} /></div></div>
            <div className="form-group"><label>Skills</label><input className="input" value={profileForm.skills || ''} onChange={(e) => setProfileForm({ ...profileForm, skills: e.target.value })} /></div>
            <div className="form-group"><label>Bio</label><textarea className="textarea" value={profileForm.bio || ''} onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })} /></div>
            <div className="flex"><button className="btn btn-primary" type="submit">Save Profile</button><button className="btn btn-secondary" type="button" onClick={() => navigate('/dashboard')}>Back</button></div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;
