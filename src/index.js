import React              from 'react';
import ReactDOM           from 'react-dom';
import { Provider }       from 'react-redux';
import { createStore }    from 'redux';
import { IntlProvider }   from 'react-intl';

import Main               from './components/Main/Main';
import Reducers           from './reducers';

import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <IntlProvider locale="en">
    <Provider store={ createStore(Reducers) }>
      <Main />
    </Provider>
  </IntlProvider>,
  document.getElementById('avalanche')
);

serviceWorker.unregister();
