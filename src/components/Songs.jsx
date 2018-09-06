import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import shared components
import ArtistUnitRequiredScreen from './shared/ArtistUnitRequiredScreen';
import Icon from './shared/Icon';
import LoginRequiredScreen from './shared/LoginRequiredScreen';
import LoadingScreen from './shared/LoadingScreen';
// Import components
import CurrentArtistName from './widgets/CurrentArtistName';
// Import utilities
import { getLyricsSnippet } from '../utils';

class Songs extends Component {
  componentDidMount() {
    const reload = this.props.songs.songList.length < 0;
    this.props.loadSongs(reload);
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

    const APP = this.props.app;
    const SONGS = this.props.songs;
    const CURRENT_UNIT = APP.currentUnit;
    const { songList } = SONGS;

    if (CURRENT_UNIT && !CURRENT_UNIT.members) {
      return (
        <ArtistUnitRequiredScreen
          title="Songs"
          description="loading song lyrics"
        />
      );
    }

    const handleSongLoadClick = e => {
      // Get id of the closest tr element
      const song =
        SONGS.songList[
          [].indexOf.call(e.currentTarget.children, e.target.closest('tr'))
        ];
      this.props.loadSong(song);
      setTimeout(() => {
        this.props.toggleBrackets(false);
        this.props.history.push('/lyrics/');
      }, 500);
    };

    return (
      <main className="container">
        <h1>
          Songs<CurrentArtistName currentArtist={APP.currentArtist} />
        </h1>
        <p>
          Search for previously used songs and load its lyrics to the lyrics
          parser.
        </p>
        <p>
          <Icon type="used" size="small-inline" /> indicates songs already
          distributed by the selected artist.
        </p>

        <input
          className="search-bar"
          type="text"
          placeholder="Filter..."
          onChange={this.props.songsFilter}
        />
        <table className="table">
          <thead>
            <tr>
              <th />
              <th>Title</th>
              <th>Artist</th>
              <th>Snippet</th>
            </tr>
          </thead>
          <tbody onClick={e => handleSongLoadClick(e)}>
            {songList.length > 0 ? (
              songList.map(song => {
                const snippet = getLyricsSnippet(song.lyrics);
                return (
                  <tr key={song.id}>
                    <td>
                      {APP.currentUnit.songTitleDictionary[song.title] ? (
                        <Icon type="used" />
                      ) : null}
                    </td>
                    <td>{song.title}</td>
                    <td>{song.originalArtist}</td>
                    <td>{snippet}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td>No songs available within your search</td>
                <td />
                <td />
              </tr>
            )}
          </tbody>
        </table>
      </main>
    );
  }
}

Songs.propTypes = {
  app: PropTypes.object.isRequired,
  db: PropTypes.object.isRequired,
  songs: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  loadSong: PropTypes.func.isRequired,
  loadSongs: PropTypes.func.isRequired,
  songsFilter: PropTypes.func.isRequired,
  toggleBrackets: PropTypes.func.isRequired,
};

export default Songs;