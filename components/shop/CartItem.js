import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Platform} from 'react-native'


const CartItem = (props) => {
    return (
        <View style={styles.cartItem}>
            <View style={styles.itemData}>
                <Text style={styles.quantity}>{props.quantity}  </Text><Text style={styles.mainText}>{props.title}</Text>
            </View>
            <View style = {styles.itemData}>
                <Text style={styles.mainText}>${ props.amount}</Text>
                {props.onRemove && <TouchableOpacity onPress={props.onRemove} style={styles.deleteButton}>
                    <Ionicons
                        name={Platform.OS === 'android' ? "md-trash" : 'ios-trash'}
                        size={23}
                        color={'red'}
                    />
                </TouchableOpacity>}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    cartItem: {
        padding: 10,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: "space-between",
        marginHorizontal : 20
    },
    itemData: {
        flexDirection: "row",
        alignItems: "center",
    },
    quantity: {
        color: "#888",
        fontSize : 16
    },
    mainText: {
        fontSize: 16,
        maxWidth : '100%'
    },
    deleteButton: {
        marginLeft: 20,
    }
})

export default CartItem