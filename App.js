import React, {useEffect, useState} from 'react';
import { createStore,combineReducers } from 'redux';
import { Provider } from 'react-redux'
import productsReducer from './store/reducers/products';
import cartReducer from './store/reducers/cart';
import ShopNavigator from './navigation/ShopNavigator';
import AppLoading  from 'expo-app-loading';
import {composeWithDevTools} from 'redux-devtools-extension'
import ordersReducer from './store/reducers/orders';

const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  orders : ordersReducer
});

const store = createStore(rootReducer)//composeWithDevTools()
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
          <ShopNavigator/>
      </Provider>
    );
}
