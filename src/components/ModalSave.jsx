import React from 'react';

import NoIcon from './icons/NoIcon';
import YesIcon from './icons/YesIcon';

const SaveModal = ({props}) => {
  const { results, distribute, lyrics } = props;

  return (
    <section className="modal">
      <div className="modal-save">
        <h1>Save Song</h1>
        <p>Your distributions will be public for every user, but only you can modify your distributions.</p>
        <div className="modal-group">
          <label htmlFor="songTitle">Song Title*:</label>
          <input
            type="text"
            name="songTitle"
            value={results.songTitle}
            onChange={props.handleSongTitle}
          />
        </div>
        <div className="modal-group">
          <label htmlFor="songType">Type*:</label>
          <select
            name="songType"
            value={results.songType}
            onChange={props.handleSongType}
          >
            <option value="">Select type...</option>
            <option value="official">Official</option>
            <option value="would">How They Would Sing...</option>
            <option value="should">How They Should Sing...</option>
          </select>
        </div>
        {
          results.songType === 'would' ? (
            <div className="modal-group">
              <label htmlFor="originalArtist">Original Artist*:</label>
              <input
                type="text"
                name="originalArtist"
                value={results.originalArtist}
                onChange={props.handleOriginalArtist}
              />
            </div>
          ) : null
        }
        <p>Contains Distribution:
          {
            distribute.history.length > 0 ? (
              <YesIcon />
            ) : (
              <span>
                <NoIcon />
                <span className="label-red">You must have a distribution to save a song.</span>
              </span>
            )
          }
        </p>
        <p>Contains Lyrics:
          {
            lyrics.lyrics.length > 0 ? (
              <YesIcon />
            ) : (
              <span>
                <NoIcon />
                <span className="label-red">You must have lyrics to save a song.</span>
              </span>
            )
          }
        </p>
        <ul className="controls">
          <li>
            <button className="btn-lg btn-100" onClick={props.openSaveModal}>
              Cancel
            </button>
          </li>
          <li>
            <button className="btn-lg btn-100" onClick={() => props.saveSong(false)}>
              Copy to clipboard...
            </button>
          </li>
          <li>
            {
              distribute.history.length > 0 && lyrics.lyrics.length > 0 ? (
                <button className="btn-lg btn-100" onClick={props.saveSong}>
                  Save
                </button>
              ) : (
                <button className="btn-lg btn-100" disabled>
                  Save
                </button>
              )
            }
          </li>
        </ul>
        <small>If you are modifying one song created by you, by clicking save we will update it for you.</small>
      </div>
      {
        results.tempInput ? (
          <textarea className="temp-input-save" id="temp-input" value={results.tempInput} readOnly />
        ) : null
      }
    </section>
  );
};

export default SaveModal;
