import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from "react-native";
import Card from "../UI/Card";

const ProductItem = (props) => {
  let TouchableCmp = TouchableOpacity;
  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback; //Touchable Opacity doesnt working properly on Android and only TouchableNativeFeedback working but its looking like image is not having that effect. To Fix that we used "useForeground" instead of background it effects on foreground
  }
  return (
    //Still we have small issue in Android that the Animation is not rounded.To Solve that we modify this. Check below commented code for difference
    <Card style={styles.product}>
      <View style={styles.touchable}>
        {/* Here due to image our card is not rounded on top for that we are wrapping in a container bc we cant directly round the image */}
        <TouchableCmp onPress={props.onSelect} useForeground>
          <View>
            <View style={styles.imageContainer}>
              <Image style={styles.image} source={{ uri: props.image }} />
            </View>
            <View style={styles.details}>
              <Text style={styles.title}>{props.title}</Text>
              <Text style={styles.price}>${props.price.toFixed(2)}</Text>
            </View>

            <View style={styles.actions}>
                {props.children}
                {/* <Button title="View Details" onPress={props.onViewDetail} />
                <Button title="To Cart" onPress={props.onAddToCart} /> */}
            </View>
          </View>
        </TouchableCmp>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  product: {
    height: 300,
    margin: 20,
    },
    touchable: {
        borderRadius : 10,
        overflow : "hidden"
    },
  imageContainer: {
    width: "100%",
    height: "60%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  details: {
    alignItems: "center",
    height: "15%",
    paddingVertical: 10,
  },
  title: {
    fontSize: 18,
    marginVertical: 4,
  },
  price: {
    fontSize: 14,
    color: "#888",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: "25%",
  },
});

export default ProductItem;

/**const ProductItem = props => {

    let TouchableCmp = TouchableOpacity
    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback; //Touchable Opacity doesnt working properly on Android and only TouchableNativeFeedback working but its looking like image is not having that effect. To Fix that we used "useForeground" instead of background it effects on foreground
    }
    return (
      <TouchableCmp onPress={props.onViewDetail} useForeground >
        <View style={styles.product}>
           Here due to image our card is not rounded on top for that we are wrapping in a container bc we cant directly round the image 
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={{ uri: props.image }} />
          </View>
          <View style={styles.details}>
            <Text style={styles.title}>{props.title}</Text>
            <Text style={styles.price}>${props.price.toFixed(2)}</Text>
          </View>

          <View style={styles.actions}>
            <Button title="View Details" onPress={props.onViewDetail} />
            <Button title="To Cart" onPress={props.onAddToCart} />
          </View>
        </View>
      </TouchableCmp>
    );
} */

/**const styles = StyleSheet.create({
    product: {
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation : 5, //to enable shadow on Android wont need for ios
        borderRadius: 10,
        backgroundColor: "white",
        height: 300,
        margin : 20
    },
    imageContainer: {
        width: '100%',
        height: "60%",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow : 'hidden'
    },
    image: {
        width: "100%",
        height: "100%",
    },
    details: {
        alignItems: 'center',
        height: '15%',
        paddingVertical : 10
    },
    title: {
        fontSize: 18,
        marginVertical : 4
    },
    price: {
        fontSize: 14,
        color : "#888"
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height : "25%"
    }
}) */
