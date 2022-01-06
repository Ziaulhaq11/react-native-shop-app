import {
  createAppContainer,
  createSwitchNavigator,
} from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { Platform, SafeAreaView, Button, View } from "react-native";
import Colors from "../constants/Colors";
import ProductOverviewScreen from "../screens/shop/ProductsOverviewScreen";
import ProductDetailScreen from "../screens/shop/ProductDetailScreen";
import CartScreen from "../screens/shop/CartScreen";
import OrderScreen from "../screens/shop/OrderScreen";
import { createDrawerNavigator , DrawerNavigatorItems} from "react-navigation-drawer";
import { Ionicons } from "@expo/vector-icons";
import UserProductScreen from "../screens/user/UserProductsScreen";
import React from "react";
import EditProductScreen from "../screens/user/EditProductScreen";
import AuthScreen from "../screens/user/AuthScreen";
import startUpScreen from "../screens/StartUpScreen";
import { useDispatch } from "react-redux";
import * as authActions from '../store/actions/auth'


const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === "android" ? Colors.primary : "",
  },
  headerTitleStyle: {
    // fontFamily : "OpenSansBold"
  },
  headerBackTitleStyle: {
    // fontFamily : "OpenSans" for ios on back button there is a text of
  },
  headerTintColor: Platform.OS === "android" ? "white" : Colors.primary,
};

const ProductsNavigator = createStackNavigator(
  {
    ProductsOverview: ProductOverviewScreen,
    ProductDetail: ProductDetailScreen,
    Cart: CartScreen,
  },
  {
    //If this navigator is used inside or screen of another navigator then it will work. SO here Products Navigator is using inside Shop Navigator
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === "android" ? "md-cart" : "ios-cart"}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },
    defaultNavigationOptions: defaultNavOptions,
  }
);

const OrdersNavigator = createStackNavigator(
  {
    Orders: OrderScreen,
  },
  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === "android" ? "md-list" : "ios-list"}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },
    defaultNavigationOptions: defaultNavOptions,
  }
);

const AdminNavigator = createStackNavigator(
  {
    UserProducts: UserProductScreen,
    EditProduct: EditProductScreen,
  },
  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === "android" ? "md-create" : "ios-create"}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },
    defaultNavigationOptions: defaultNavOptions,
  }
);

const ShopNavigator = createDrawerNavigator(
  {
    Products: ProductsNavigator,
    Orders: OrdersNavigator,
    Admin: AdminNavigator,
  },
  {
    contentOptions: {
      activeTintColor: Colors.primary,
    },
    contentComponent: props => {
      const dispatch = useDispatch()
      return (
      <View style={{ flex: 1 ,paddingTop : 20}}>
        <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
          {/* if we dont write this line our menu items will be gone  */}
          <DrawerNavigatorItems {...props} /> 
            <Button title="Logout" color={Colors.primary} onPress={() => {
              dispatch(authActions.logout())
              // props.navigation.navigate('Auth') because we are doing this in navigationcontainer
          }}/>
        </SafeAreaView>
      </View>
      )
    }
  }
);

const AuthNavigator = createStackNavigator(
  {
    Auth: AuthScreen,
  },
  {
    defaultNavigationOptions: defaultNavOptions,
  }
);

const MainNavigator = createSwitchNavigator({
  Startup: startUpScreen,
  Auth: AuthNavigator,
  Shop: ShopNavigator,
});
// export default createAppContainer(ProductsNavigator)
export default createAppContainer(MainNavigator);
