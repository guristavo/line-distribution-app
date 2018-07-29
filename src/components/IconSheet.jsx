import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import shared components
import AdminOnlyScreen from './shared/AdminOnlyScreen';
import Icon, { ICONS_LIST } from './shared/Icon';
import LoadingScreen from './shared/LoadingScreen';
import LoginRequiredScreen from './shared/LoginRequiredScreen';

class IconSheet extends Component {
  componentWillUpdate(nextProps) {
    if (nextProps.db.loaded !== this.props.db.loaded) {
      this.render();
    }
  }

  render() {
    // LOGIN Check if user is logged in
    if (this.props.user.isAuthenticated === false) {
      return <LoginRequiredScreen props={this.props} redirect="/artists" />;
    }

    // DB Check if db is ready
    if (this.props.db.loaded === false) {
      return <LoadingScreen />;
    }

    // ADMIN Check if user has access to this page
    if (this.props.user.isAdmin === false) {
      return <AdminOnlyScreen />;
    }

    return (
      <main className="container">
        <h1>Icons Sheet</h1>
        <div className="icon-sheet-list-container">
          {ICONS_LIST.map(item => (
            <div className="icon-sheet-list-item">
              <Icon type={item} size="x-large" />
              <h3>{item}</h3>
            </div>
          ))}
        </div>
      </main>
    );
  }
}

IconSheet.propTypes = {
  db: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

export default IconSheet;
