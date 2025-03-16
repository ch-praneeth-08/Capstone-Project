import { useContext, useEffect, useState } from 'react';
import { userAuthorContextObj } from '../../contexts/UserAuthorContext';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Home() {
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj);
  const { isSignedIn, user, isLoaded } = useUser();
  const [error, setError] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPasswordField, setShowPasswordField] = useState(false);
  const navigate = useNavigate();

  async function onSelectRole(e) {
    setError('');
    const selectedRole = e.target.value;
    currentUser.role = selectedRole;

    if (selectedRole === 'admin') {
      setShowPasswordField(true);
      return;
    }

    try {
      let res = null;

      if (selectedRole === 'author') {
        res = await axios.post('http://localhost:3000/author-api/author', currentUser);
      } else if (selectedRole === 'user') {
        res = await axios.post('http://localhost:3000/user-api/user', currentUser);
      }

      if (res) {
        const { message, payload } = res.data;
        if (message === selectedRole) {
          setCurrentUser({ ...currentUser, ...payload });
          localStorage.setItem('currentuser', JSON.stringify(payload));
          navigate(`/${selectedRole}-profile/${currentUser.email}`);
        } else {
          setError(message);
        }
      }
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleAdminSubmit() {
    setError('');

    if (!adminPassword) {
      setError('Please enter the admin password.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:3000/admin-api/admin', {
        ...currentUser,
        password: adminPassword,
      });

      const { message, payload } = res.data;
      if(message === 'Invalid admin password') {
        setError(message);}
      if(message === 'This email is already registered as a User or Author') {
        setError(message);}
      if (message === 'Admin created' || message === 'Admin exists') {
        setCurrentUser({ ...currentUser, ...payload });
        localStorage.setItem('currentuser', JSON.stringify(payload));
        navigate(`/admin-profile/${currentUser.email}`);
      } else {
        setError(message);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    if (isSignedIn) {
      setCurrentUser({
        ...currentUser,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddresses[0].emailAddress,
        profileImageUrl: user.imageUrl,
      });
    }
  }, [isLoaded]);

  return (
    <div className='container'>
      {!isSignedIn && (
        <div>
          <p className="lead">Welcome! Please sign in to continue.</p>
        </div>
      )}

      {isSignedIn && (
        <div>
          <div className='d-flex justify-content-evenly align-items-center bg-info p-3'>
            <img src={user.imageUrl} width="100px" className='rounded-circle' alt="" />
            <p className="display-6">{user.firstName}</p>
            <p className="lead">{user.emailAddresses[0].emailAddress}</p>
          </div>

          <p className="lead">Select role</p>

          {error && (
            <p className="text-danger fs-5" style={{ fontFamily: 'sans-serif' }}>
              {error}
            </p>
          )}

          <div className='d-flex role-radio py-3 justify-content-center'>
            <div className="form-check me-4">
              <input type="radio" name="role" id="author" value="author" className="form-check-input" onChange={onSelectRole} />
              <label htmlFor="author" className="form-check-label">Author</label>
            </div>
            <div className="form-check">
              <input type="radio" name="role" id="user" value="user" className="form-check-input" onChange={onSelectRole} />
              <label htmlFor="user" className="form-check-label">User</label>
            </div>
            <div className="form-check">
              <input type="radio" name="role" id="admin" value="admin" className="form-check-input" onChange={onSelectRole} />
              <label htmlFor="admin" className="form-check-label">Admin</label>
            </div>
          </div>

          {showPasswordField && (
            <div className="mt-3">
              <label htmlFor="adminPassword" className="form-label">Enter Admin Password:</label>
              <input
                type="password"
                id="adminPassword"
                className="form-control"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              />
              <button className="btn btn-primary mt-2" onClick={handleAdminSubmit}>Submit</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
