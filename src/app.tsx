import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider} from 'react-redux';

import {RootRouter} from './navigation/RootRouter';
import {persistor, store} from './store/store';
import {LoadAppProvider} from './providers/LoadAppProvider';
import {StatusBar} from 'react-native';

const App = () => {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <LoadAppProvider>
            <NavigationContainer>
              <StatusBar barStyle={'light-content'} />
              <RootRouter />
            </NavigationContainer>
          </LoadAppProvider>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;
