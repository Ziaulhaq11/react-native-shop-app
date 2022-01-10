import React, {useEffect, useState} from 'react';
import { createStore,combineReducers,applyMiddleware } from 'redux';
import { Provider } from 'react-redux'
import ReduxThunk from 'redux-thunk'
import productsReducer from './store/reducers/products';
import cartReducer from './store/reducers/cart';
import AppLoading from 'expo-app-loading';
import {composeWithDevTools} from 'redux-devtools-extension'
import ordersReducer from './store/reducers/orders';
import authReducer from './store/reducers/auth'
import NavigationContainer from './navigation/NavigationContainer';
import * as Notifications from 'expo-notifications'

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert : true
    }
  }
})

const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  orders: ordersReducer,
  auth : authReducer
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk))//composeWithDevTools()
let customFonts = {
  'OpenSans': require("./assets/fonts/OpenSans-Regular.ttf"),
  'OpenSansBold': require("./assets/fonts/OpenSans-Bold.ttf"),
};
 
export default function App() {

  const [fontsLoaded, setFontsLoaded] = useState(false)
  //  async function _loadFontsAsync  () {
  //   await Font.loadAsync(customFonts);
  //   setFontsLoaded(true)
  //  }
  // useEffect(() => {
  //   _loadFontsAsync()
  // }, [])

  // if (!fontsLoaded) { 
  //   return <AppLoading/>
  // } else {}
    return (
      <Provider store={store}>
          <NavigationContainer/>
      </Provider>
    );
}
