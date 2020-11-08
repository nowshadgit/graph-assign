import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import DashBoard from './Containers/DashBoard';

const Routes = ({ childProps }) => {
  const props = {
    ...childProps
  };

  return (
    <BrowserRouter basename="">
      <>
        <Switch>
          <Route 
            path='/'
            exact
            component={DashBoard} 
            props={{...props}}
          />
        </Switch>
      </>
    </BrowserRouter>
  );
};

Routes.propTypes = {
  childProps: PropTypes.element
};

Routes.defaultProps = {
  childProps: <></>
};

export default Routes;
