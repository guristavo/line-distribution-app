import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AdminOnlyScreen from './AdminOnlyScreen';
import LoadingScreen from './LoadingScreen';
import LoginRequiredScreen from './LoginRequiredScreen';

import Tabs from './Tabs';

import { ALTERNATIVE_COLOR_LIST } from '../constants';
import { makeSixDigit, makeIdNumber } from '../utils';

class ColorSheet extends Component {
  componentWillMount() {
    if (this.props.db.loaded) {
      this.props.initColorSheet();
    }
  }

  componentWillUpdate(nextProps) {
    if (nextProps.db.loaded !== this.props.db.loaded) {
      this.props.initColorSheet();
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

    const ADMIN = this.props.admin;
    const tabs = [{ id: 'list' }, { id: 'alternative' }];

    return (
      <div className="container">
        <h1>Color Sheet</h1>

        {
          ADMIN.colorSheetTab === 'list' ? (
            <p>The numbers indicate how many times each color appears in the database.</p>
          ) : null
        }
        {
          ADMIN.colorSheetTab === 'alternative' ? (
            <p>Each swatch has 3-5 automatically generated alternative colors.</p>
          ) : null
        }

        <Tabs
          tabs={tabs}
          active={ADMIN.colorSheetTab}
          action={this.props.toggleColorSheetTab}
        />

        {
          ADMIN.colorSheetTab === 'list' ? (
            <ul className="color-palette">
              {
                Object.keys(ADMIN.colors).map((key) => {
                  const color = ADMIN.colors[key];
                  return (
                    <li key={color.id} className={`palette ${color.class}`}>
                      {key}<br />
                      {color.name}<br />
                      {ADMIN.colorCount[key]} uses
                    </li>
                  );
                })
              }
            </ul>
          ) : null
        }
        {
          ADMIN.colorSheetTab === 'alternative' ? (
            <ul className="color-palette">
              {
              Object.keys(ADMIN.colors).map((key) => {
                const color = ADMIN.colors[key];
                return (
                  <li key={color.id} className="palette-alt">
                    <div className={`palette-main ${color.class}`}>
                      #{key}<br />
                      {color.name}
                    </div>
                    <div className="palette-alt-group">
                      {
                        ALTERNATIVE_COLOR_LIST[makeIdNumber(key)].map((num) => {
                          const altId = `col${makeSixDigit(num)}`;
                          return (
                            <div key={`${key}-${altId}`} className={`palette-alt-swatch color-${num}`}>
                              {makeIdNumber(altId)}
                            </div>
                          );
                        })
                      }
                    </div>
                  </li>
                );
              })
            }
            </ul>
          ) : null
        }
      </div>
    );
  }
}

ColorSheet.propTypes = {
  admin: PropTypes.object.isRequired, // eslint-disable-line
  db: PropTypes.object.isRequired, // eslint-disable-line
  user: PropTypes.object.isRequired, // eslint-disable-line
  initColorSheet: PropTypes.func.isRequired,
  toggleColorSheetTab: PropTypes.func.isRequired,
};

export default ColorSheet;
