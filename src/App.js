import './App.css';
import { Provider } from 'react-redux';
import store from './infra/store/store.ts';

function App() {
  return (
    <Provider store={store}>

      <div className="App">
        initial
      </div>
    </Provider>
  );
}

export default App;
