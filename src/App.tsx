import { ReactElement } from 'react';
import { Provider } from 'react-redux';
import store from './infra/store/store';
import Router from './infra/Router/Router';

function App(): ReactElement {
  return (
    <Provider store={store}>
      <Router />
    </Provider>
  );
}

export default App;
