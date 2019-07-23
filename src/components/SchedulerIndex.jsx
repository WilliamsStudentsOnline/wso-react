import React from 'react';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';
import Scheduler from './Scheduler';
import store from '../store';
import Layout from './Layout';

const SchedulerIndex = ({ notice, warning, currentUser }) => (
  <Layout
    bodyClass="scheduler"
    notice={notice}
    warning={warning}
    currentUser={currentUser}
  >
    <Provider store={store}>
      <Scheduler />
    </Provider>
  </Layout>
);

SchedulerIndex.propTypes = {
  currentUser: PropTypes.object,
  notice: PropTypes.string,
  warning: PropTypes.string,
};

SchedulerIndex.defaultProps = {
  currentUser: {},
  notice: '',
  warning: '',
};

export default SchedulerIndex;
