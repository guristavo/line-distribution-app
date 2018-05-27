import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import logo from '../images/logo.svg';

const Header = ({ props }) => {
  const handleLogoClick = () => {
    props.history.push('/');
  };

  return (
    <header className="app-header">
      <div className="app-header-nav">
        <img className="app-logo" src={logo} alt="Logo" onClick={handleLogoClick} />
        <nav className="app-nav">
          <Link to="/artists">Artists</Link>
          <Link to="/distribute">Distribute</Link>
          <Link to="/lyrics">Lyrics</Link>
          <Link to="/songs">Songs</Link>
        </nav>
        {
          props.user.isAdmin ? (
            <nav className="app-nav-admin">
              <Link to="/create">Create</Link>
              <Link to="/colorsheet">Color Sheet</Link>
              <Link to="/database">Database</Link>
            </nav>
          ) : null
          }
      </div>
      {
        props.user.isAuthenticated ? (
          <div className="app-header-user">
            <img
              className="user-photo"
              src={props.user.user.photoURL}
              alt="user"
            />
            { props.user.user.displayName }
            <button
              className="app-header-btn"
              onClick={props.logout}
            >
              Sign out
            </button>
          </div>
        ) : (
          <div className="app-header-user">
            <button
              className="app-header-btn"
              onClick={props.login}
            >
              Sign in
            </button>
          </div>
        )
      }
    </header>
  );
};

Header.propTypes = {
  user: PropTypes.object, // eslint-disable-line
  history: PropTypes.object, // eslint-disable-line
  props: PropTypes.any.isRequired, // eslint-disable-line
  login: PropTypes.func, // eslint-disable-line
  logout: PropTypes.func, // eslint-disable-line
};

export default Header;