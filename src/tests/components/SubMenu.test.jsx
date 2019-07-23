import '@testing-library/jest-dom/extend-expect';
import { render, cleanup } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import SubMenu from '../../components/SubMenu';
import store from '../../store';

const renderComponent = () =>
  render(
    <Provider store={store}>
      <SubMenu />
    </Provider>
  );

afterEach(cleanup);

it('renders initial state', async () => {
  // Render new instance in every test to prevent leaking state
  const { getByText } = renderComponent();

  await getByText('Timetable');
});
