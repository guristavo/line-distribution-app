import React, { Component } from 'react';
import { SwitchToggle } from './Widgets';
import ModalSave from './ModalSave';

import { getClosestIndex,  copyToClipboard } from '../utils';

class Results extends Component {
  componentDidMount() {
    this.props.calculateResults();
    this.props.setResultType(false);

    if (this.props.location.pathname === '/results' && this.props.app.currentUnit.members === undefined) {
      this.props.history.push('/artists');
    }
  }

  render() {
    const RESULTS = this.props.results;

    // Stats Calculations
    let fairDistribution = 0;
    let difference = 0;
    let closest = 'Nobody';

    if (RESULTS.results.length > 0) {
      // Fair Distribution percentage: 100/members +/- 2%
      fairDistribution = Math.round(100 / RESULTS.results.length);
      // Difference between first and last place
      difference = RESULTS.results[0].percentage - RESULTS.results[RESULTS.results.length - 1].percentage;
      // Member closest to fair amount
      closest = RESULTS.results[getClosestIndex(RESULTS.results, fairDistribution, 'percentage')].name;
    }

    // Define switch buttons lables
    const switchLabels = { left: 'Time', right: 'Percentage' };

    return (
      <section className="container">
        <h1 className="tiny-h1">Results</h1>
        <SwitchToggle action={this.props.handleSwitch} labels={switchLabels} />
        <ul className="results" id="ranking">
          {
            RESULTS.results.map((result, i) => (
              <li key={result.name} className="results-bar">

                <span className="results-bar-text">
                  {
                    RESULTS.showPercentage ?
                    `${i + 1}. ${result.name} [${result.percentage}%] ${Math.round(result.duration / 100) / 10} seconds`
                    :
                    `${i + 1}. ${result.name} [${Math.round(result.duration / 100) / 10} seconds]`
                  }
                </span>
                <span className={`results-bar-color color-${result.color} bar-width-${result.relativePercentage}`} />
              </li>
            ))
          }
        </ul>
        <div className="controls">
          <button className="btn" onClick={() => this.props.history.push('/distribute')}>Done</button>
          <button className="btn" onClick={() => this.props.openSaveModal()}>Save to LocalStorage</button>
        </div>
        <div className="group stats">
          <h3>Stats</h3>
          <ul>
            <li>Fair Distribution: { `${fairDistribution - 2}~${fairDistribution + 2}%` } per member</li>
            <li>Difference Between First and Last Place: { difference }%</li>
            <li>Member Closest To Fair Distribution: { closest }</li>
          </ul>
        </div>
        {
          RESULTS.saveModal ? (
            <ModalSave props={this.props} />
          ) : null
        }
        <textarea className="temp-input-save" id="temp-input" value={RESULTS.tempInput} readOnly />
      </section>
    );
  }
}

export default Results;