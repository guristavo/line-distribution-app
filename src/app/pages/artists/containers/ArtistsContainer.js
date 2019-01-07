import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Artists from '../components/Artists';

import { artistsOperations } from '../../../../reducers/artists';
import { authOperations } from '../../../../reducers/auth';

const mapStateToProps = state => ({
  app: state.app,
  artists: state.artists,
  auth: state.auth,
  db: state.db,
});

const mapDispatchToProps = {
  ...artistsOperations,
  ...authOperations,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Artists)
);