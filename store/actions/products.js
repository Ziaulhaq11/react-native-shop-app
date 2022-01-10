import Product from "../../models/product";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const SET_PRODUCTS = "SET_PRODUCTS";


export const fetchProducts = () => {
  
  return async (dispatch,getState) => {
    const userId = getState().auth.userId
    try {
      const response = await fetch(
        "https://rm-shop-app-1c2e8-default-rtdb.firebaseio.com/products.json"
      );
  
      if (!response.ok) {
        throw new Error('Something went wrong!')
      }
      const resData = await response.json();
      const loadedProducts = [];
      for (const key in resData) {
        loadedProducts.push(
          new Product(
            key,
            resData[key].ownerId,
            resData[key].ownerPushToken,
            resData[key].title,
            resData[key].imageUrl,
            resData[key].description,
            resData[key].price,
          )
        );
      }
      dispatch({
        type: SET_PRODUCTS,
        products: loadedProducts,
        userProducts : loadedProducts.filter(prod => prod.ownerId === userId)
      })
    }
    
    catch (error) {
      //send data to analytics server
      throw error
    }
  }
}

export const deleteProduct = (productId) => {
  return async (dispatch,getState) => {
    const token = getState().auth.token;
      const response = await fetch(
        `https://rm-shop-app-1c2e8-default-rtdb.firebaseio.com/products/${productId}.json?auth=${token}`,
        {
          method: "DELETE"
        }
    );
    if (!response.ok) {
      throw new Error('Something went wrong')
    }
     dispatch({ type: DELETE_PRODUCT, pid: productId });
  }
};

export const createProduct = (title, description, imageUrl, price) => {
  return async (dispatch, getState) => {
    let pushToken;
    //Any async code you can run
    let statusObj = await Permissions.getAsync(Permissions.NOTIFICATIONS)
    if (statusObj.status !== 'granted') {
      const statusObj = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    }
    if (statusObj.status !== "granted") {
      pushToken = null;
    } else {
      pushToken = (await Notifications.getExpoPushTokenAsync()).data;
    }
    //Here in url products/json we added so firebase automatically create folder for this by the name
    const token = getState().auth.token;
    const userId = getState().auth.userId
    const response = await fetch(
      `https://rm-shop-app-1c2e8-default-rtdb.firebaseio.com/products.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          price,
          ownerId: userId,
          ownerPushToken : pushToken
        }),
      }
    );

    // console.log(response)
    const resData = await response.json();
    dispatch({
      type: CREATE_PRODUCT,
      productData: {
        id: resData.name,
        title: title,
        description,
        imageUrl,
        price,
        ownerId: userId,
        pushToken : pushToken
      },
    });
  };
};

export const updateProduct = (id, title, description, imageUrl) => {
  return async (dispatch,getState) => {
    const token = getState().auth.token //Because of Redux thunk we can able to get all redux store data
    const response = await fetch(
      `https://rm-shop-app-1c2e8-default-rtdb.firebaseio.com/products/${id}.json?auth=${token}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({  
          title,
          description,
          imageUrl,
        }),
      }
    );
    console.log(response)

    if (!response.ok) {
      throw new Error('Something went wrong!')
    }


    dispatch({
      type: UPDATE_PRODUCT,
      pid: id,
      productData: {
        title,
        description,
        imageUrl,
      },
    });
  }
};
