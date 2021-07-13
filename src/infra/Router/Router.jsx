import React from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import Home from '../views/Home';

function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" default component={Home} />
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
