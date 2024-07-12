import React from 'react';
import { Provider } from 'react-redux';

import { store } from '@site/src/store';

// Default implementation, that you can customize
export default function Root({children}): JSX.Element {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}
