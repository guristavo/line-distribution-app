import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Icon from './icons';

const ArtistSongsTable = ({ songs, members, handleSongClick }) => {
  const sortedSongs = _.sortBy(songs, ['title']);

  const memberColors = {};
  members.forEach((member) => {
    memberColors[member.id] = member.color.class;
  });

  return (
    songs && songs.length > 0 ? (
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Lyrics</th>
            <th>Distribution</th>
          </tr>
        </thead>
        <tbody onClick={e => handleSongClick(e)}>
          {
            sortedSongs && sortedSongs.map((song) => {
              let type = 'Official';
              if (song.type === 'would') {
                type = `Originally by ${song.originalArtist}`;
              } else if (song.type === 'should') {
                type = "How it should've been";
              }
              // const songDistribution = this.props.parseSong(song);
              return (
                <tr
                  key={song.id}
                  id={song.id}
                >
                  <td>{song.title}</td>
                  <td>{type}</td>
                  <td><Icon type={song.lyrics ? 'yes' : 'no'} /></td>
                  <td>
                    {
                      song.result ?
                        (
                          <span className="unit-songs-dist">
                            {
                              song.result.map((instance) => {
                                const color = memberColors[instance.memberId];
                                const barWidth = instance.memberTotal;
                                return (
                                  <span
                                    key={`${song.id}-${color}-${instance.memberId}`}
                                    className={`unit-songs-member ${color} bar-width-${barWidth}`}
                                  >
                                    {barWidth}%
                                  </span>
                                );
                              })
                            }
                          </span>
                        )
                        :
                          <Icon type="no" />
                    }
                  </td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
    ) : (
      <p>No songs available</p>
    )
  );
};

ArtistSongsTable.propTypes = {
  songs: PropTypes.array.isRequired, // eslint-disable-line
  members: PropTypes.array.isRequired, // eslint-disable-line
  handleSongClick: PropTypes.func.isRequired,
};

export default ArtistSongsTable;
