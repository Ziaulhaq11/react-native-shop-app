import { ADD_TO_CART, REMOVE_FROM_CART } from "../actions/cart";
import CartItem from "../../models/cart-item";
import { ADD_ORDER } from "../actions/orders";
import { DELETE_PRODUCT } from "../actions/products";

const initialState = {
    items: {},
    totalAmount : 0
}

export default (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_CART: 
            const addedProduct = action.product
            const productPrice = addedProduct.price
            const productTitle = addedProduct.title
            let cartItem;
            if (state.items[addedProduct.id]) {
                cartItem = new CartItem(
                  state.items[addedProduct.id].quantity + 1,
                  productPrice,
                  productTitle,
                  state.items[addedProduct.id].sum + productPrice
                );
            } else {
                cartItem = new CartItem(
                  1,
                  productPrice,
                  productTitle,
                  productPrice
                );
            }
            return {
                ...state,//no need here
                items: { ...state.items, [addedProduct.id]: cartItem },
                totalAmount : state.totalAmount + productPrice
            }
        case REMOVE_FROM_CART:
            const selectedItem = state.items[action.productId];
            const currentQty = selectedItem.quantity;
            let updatedCartItems;
            if (currentQty > 1) {
                const updatedCartItem = new CartItem(
                    selectedItem.quantity - 1,
                    selectedItem.productPrice,
                    selectedItem.productTitle,
                    selectedItem.sum - selectedItem.productPrice
                )
                updatedCartItems = { ...state.items, [action.productId]: updatedCartItem }
            } else {
                updatedCartItems = { ...state.items }
                delete updatedCartItems[action.productId]
            }
            return {
                ...state,items : updatedCartItems,totalAmount : state.totalAmount - selectedItem.productPrice
            }
        case ADD_ORDER:
            return initialState;
        case DELETE_PRODUCT:
            if (!state.items[action.pid]) {
                return state;
            }
            const updatedItems = { ...state.items }
            const itemTotal = state.items[action.pid].sum;
            delete updatedItems[action.pid];
            return {
                ...state,
                items: updatedItems,
                totalAmount : state.totalAmount - itemTotal
            }
     }
    return state;
}