import React, { useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';
import {userAuthorContextObj} from '../../contexts/UserAuthorContext';

function UserProfile() {
  const { currentUser } = useContext(userAuthorContextObj);

  return currentUser.isActive ? (
    <>
      <ul className="d-flex justify-content-around list-unstyled fs-1">
        <li className="nav-item">
          <Link to="articles" className="nav-link">Articles</Link>
        </li>
      </ul>
      <div className="mt-5">
        <Outlet />
      </div>
    </>
  ) : (
    <div className="d-flex justify-content-center align-items-center">
      <h1>Your account is blocked. Please contact admin</h1>
    </div>
  );
}

export default UserProfile;
