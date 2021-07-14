import { ReactElement } from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import Home from '../../presentation/views/Home';

function Router(): ReactElement {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={Home} />
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
