import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

// Import common components
import {
  ActiveUnit,
  Icon,
  Switch,
  RequirementWrapper,
  ActiveSong,
} from '../../../common';
import ArtistsTable from './ArtistsTable';

class Artists extends Component {
  componentDidMount() {
    this.props.loadArtists();
    this.props.updateSearchQuery('');
  }
  render() {
    const {
      app: { pending },
      artists: { searchQuery, showFavoriteArtistsOnly },
      auth: { user },
      db,
      distribute: { activeSong, activeUnit },
    } = this.props;

    // Row click should send user to the selected artist page
    const handleTableClick = e => {
      const { id } = e.target.parentNode;
      const { className } = e.target;
      if (id && className !== 'artists-cell-favorite') {
        const artistId = id.substring(2);
        this.props.history.push(`/artists/${artistId}`);
      }
    };

    return (
      <RequirementWrapper>
        <main className="container container--artists">
          <h1>Artists</h1>

          <section className="active-widget__group">
            <ActiveUnit activeUnit={activeUnit} showMembers />
            <ActiveSong activeSong={activeSong} />
          </section>

          <section className="artists__section">
            <h2>All Artists</h2>
            <input
              className="artists__search-bar"
              type="text"
              placeholder="Filter..."
              onChange={e => this.props.updateSearchQuery(e.target.value)}
            />{' '}
            Show Favorite Artists Only:{' '}
            <Switch
              action={this.props.showFavoriteArtistsOnlyToggle}
              checked={showFavoriteArtistsOnly}
            />
            <ArtistsTable
              artists={db.artists}
              searchQuery={searchQuery}
              pending={pending.REQUEST_ARTISTS}
              rowAction={handleTableClick}
              favoriteAction={this.props.updateFavoriteArtists}
              showFavoriteArtistsOnly={showFavoriteArtistsOnly}
              user={user}
            />
          </section>
        </main>
      </RequirementWrapper>
    );
  }
}

Artists.propTypes = {
  app: PropTypes.object.isRequired,
  artists: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  db: PropTypes.object.isRequired,
  distribute: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  loadArtists: PropTypes.func.isRequired,
  showFavoriteArtistsOnlyToggle: PropTypes.func.isRequired,
  updateSearchQuery: PropTypes.func.isRequired,
  updateFavoriteArtists: PropTypes.func.isRequired,
};

Artists.defaultProps = {};

export default Artists;
