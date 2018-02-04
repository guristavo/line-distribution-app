import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';

import AppContainer from './containers/AppContainer';
import ArtistContainer from './containers/ArtistContainer';
import ArtistsContainer from './containers/ArtistsContainer';
import ColorSheetContainer from './containers/ColorSheetContainer';
import CreatorContainer from './containers/CreatorContainer';
import DatabaseContainer from './containers/DatabaseContainer';
import DistributeContainer from './containers/DistributeContainer';
import HomeContainer from './containers/HomeContainer';
import LyricsContainer from './containers/LyricsContainer';
import ResultsContainer from './containers/ResultsContainer';

import './stylesheets/index.css';

const routes = (
  <Router>
    <div className="app">
      <AppContainer />
      <Route path="/artist" component={ArtistContainer} />
      <Route path="/artists" component={ArtistsContainer} />
      <Route path="/colorsheet" component={ColorSheetContainer} />
      <Route path="/create" component={CreatorContainer} />
      <Route path="/database" component={DatabaseContainer} />
      <Route path="/distribute" component={DistributeContainer} />
      <Route path="/lyrics" component={LyricsContainer} />
      <Route path="/results" component={ResultsContainer} />
      <Route exact path="/" component={HomeContainer} />
    </div>
  </Router>
);

export default routes;