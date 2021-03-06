import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ScrollSync, ScrollSyncPane } from 'react-scroll-sync';

// Import lyrics components
import LyricsOutput from './LyricsOutput';
// Import common components
import { Loading, PageTitle, RequirementWrapper } from '../../../common';
// Import lyric parser
import parseLyrics from '../parser';

class Lyrics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lyrics: {
        result: [],
        uses: {},
      },
    };
  }

  componentDidMount() {
    this.props.loadColors();
  }

  render() {
    const {
      app: { pending },
      db: { colors },
      distribute: { activeUnit },
    } = this.props;

    if (pending.REQUEST_COLORS) {
      return <Loading message="Fecthing Colors..." />;
    }

    const handleLyricsInput = event => {
      const { value } = event.target;

      this.setState({
        lyrics: parseLyrics(value, activeUnit.members || [], activeUnit.id),
      });
    };

    return (
      <RequirementWrapper requirements={['activeUnit']}>
        <main className="container container--lyrics">
          <PageTitle title="Lyrics" />
          {activeUnit.members ? (
            <ul className="lyrics__members-list">
              {Object.values(activeUnit.members).map(member => (
                <li
                  className={`pill background-color-${member.color || 0}`}
                  key={member.id}
                >
                  {member.name.toUpperCase()}{' '}
                  {this.state.lyrics.uses[member.name.toUpperCase()] &&
                    `(${this.state.lyrics.uses[member.name.toUpperCase()]})`}
                </li>
              ))}
            </ul>
          ) : (
            <section className="lyrics__members-list--empty">
              There is no Active Unit Selected.
            </section>
          )}
          <ScrollSync>
            <section className="lyrics__group">
              <ScrollSyncPane>
                <textarea
                  name="lyrics"
                  id=""
                  cols="30"
                  rows="10"
                  className="lyrics__input"
                  onChange={handleLyricsInput}
                />
              </ScrollSyncPane>
              <ScrollSyncPane>
                <LyricsOutput
                  lyrics={this.state.lyrics.result}
                  colorsDB={colors}
                />
              </ScrollSyncPane>
            </section>
          </ScrollSync>
        </main>
      </RequirementWrapper>
    );
  }
}

Lyrics.propTypes = {
  app: PropTypes.object.isRequired,
  db: PropTypes.object.isRequired,
  distribute: PropTypes.object.isRequired,
  loadColors: PropTypes.func.isRequired,
};

export default Lyrics;
