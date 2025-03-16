import React from 'react'
import { NavLink, Outlet } from 'react-router-dom';
import {userAuthorContextObj} from '../../contexts/UserAuthorContext';
import { useContext } from 'react';
function AuthorProfile() {
  const { currentUser } = useContext(userAuthorContextObj)
  return (
    <div className="author-profile">
      {
        currentUser.isActive ? <><ul className="d-flex justify-content-around list-unstyled fs-3">
          <li className="nav-item">
            <NavLink to='articles' className="nav-link">Articles</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to='article' className="nav-link">Add new Article</NavLink>
          </li>
        </ul><div className="mt-5">
            <Outlet />
          </div></>:
          <>
          <div className='d-flex justify-content-center align-items-center'>
              <h1>Your account is blocked. Please contact admin</h1>
          </div>
          </>
      }
    </div>
  );

}

export default AuthorProfile