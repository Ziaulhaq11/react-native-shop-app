import React, { useState }from "react";
import { View, Text, StyleSheet, Button, FlatList,ActivityIndicator } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import CartItem from "../../components/shop/CartItem";
import Card from "../../components/UI/Card";
import Colors from "../../constants/Colors";
import * as cartActions from "../../store/actions/cart";
import * as orderActions from '../../store/actions/orders'

const CartScreen = (props) => {
  const [isLoading,setIsLoading] = useState(false)
  const cartTotalAmount = useSelector((state) => state.cart.totalAmount);
  const cartItems = useSelector((state) => {
    const transformedCartItems = [];
    for (const key in state.cart.items) {
      transformedCartItems.push({
        productId: key,
        productTitle: state.cart.items[key].productTitle,
        productPrice: state.cart.items[key].productPrice,
        quantity: state.cart.items[key].quantity,
        sum: state.cart.items[key].sum,
        productPushToken : state.cart.items[key].pushToken
      });
    }
    return transformedCartItems.sort((a,b) => a.productId > b.productId ? 1 : -1);
  });
  const dispatch = useDispatch();

  const sendOrderHandler = async () => {
    console.log(cartItems)
    setIsLoading(true)
    await dispatch(orderActions.addOrder(cartItems, cartTotalAmount))
    setIsLoading(false)
  }
  return (
    <View style={styles.screen}>
      <Card style={styles.summary}>
        <Text style={styles.summaryText}>
          Total :
          <Text style={styles.amount}>${Math.round(cartTotalAmount.toFixed(2) * 100) / 100}</Text>
          {/* This approach is to fix the issue of "-" when cart value is 0 */}
        </Text>
        {isLoading ? <ActivityIndicator color={Colors.primary} size='small' /> :
          <Button
            color={Colors.accent}
            title="Order Now"
            disabled={cartItems.length === 0}
            onPress={sendOrderHandler}
          />}
      </Card>
      <FlatList
        data={cartItems}
        key={(item) => item.productId}
        renderItem={(itemData) => (
          <CartItem
            quantity={itemData.item.quantity}
            title={itemData.item.productTitle}
            amount={itemData.item.sum}
            onRemove={() =>
              dispatch(cartActions.removeFromCart(itemData.item.productId))
            }
          />
        )}
      />
    </View>
  );
};

CartScreen.navigationOptions = {
  headerTitle : 'Your Cart'
}

const styles = StyleSheet.create({
  screen: {
    margin: 20,
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10,
  },
  summaryText: {
    fontSize: 18,
  },
  amount: {
    color: Colors.primary,
  },
});

export default CartScreen;
