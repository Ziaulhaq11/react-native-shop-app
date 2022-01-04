import React , {useEffect,useState} from "react";
import { View, Text, FlatList, ActivityIndicator,StyleSheet } from "react-native";
import { useSelector , useDispatch} from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../../components/UI/HeaderButton";
import OrderItem from "../../components/shop/OrderItem";
import * as orderActions from '../../store/actions/orders'
import Colors from "../../constants/Colors";

const OrderScreen = (props) => {
  const [isLoading,setIsLoading] = useState(false)
  const orders = useSelector((state) => state.orders.orders);
  const dispatch = useDispatch()
  useEffect(() => {
    setIsLoading(true)
    dispatch(orderActions.fetchOrders()).then(() => {
      setIsLoading(false)
    })
  }, [dispatch])
  
  if (isLoading) {
    <View style={styles.centered}>
      <ActivityIndicator size='large' color={Colors.primary}/>
    </View>
  }
  return (
    <FlatList
      data={orders}
      renderItem={(itemData) => {
        // console.log(itemData.item.items[0].productId)
        return (

          <OrderItem
            key={itemData.item.productId}
            amount={itemData.item.totalAmount}
            date={itemData.item.readableDate}
            items={itemData.item.items}
          />
        )
      }}
    />
  );
};

OrderScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Your Orders",
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="Orders"
          iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems : "center"
  }
})

export default OrderScreen;
