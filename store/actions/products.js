export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";

export const deleteProduct = (productId) => {
  return { type: DELETE_PRODUCT, pid: productId };
};

export const createProduct = (title, description, imageUrl, price) => {
  return async dispatch => {
    console.log(title)
    //Any async code you can run 
    //Here in url products/json we added so firebase automatically create folder for this by the name
    const response = await fetch(
      "https://rm-shop-app-1c2e8-default-rtdb.firebaseio.com/products.json",
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
        })
      })
      
      // console.log(response)
    const resData = await response.json()
    console.log(resData)
      dispatch({
        type: CREATE_PRODUCT,
        productData: {
          id: resData.name,
          title: title,
          description,
          imageUrl,
          price,
        },
      });
  };
};

export const updateProduct = (id, title, description, imageUrl) => {
  return {
    type: UPDATE_PRODUCT,
    pid: id,
    productData: {
      title,
      description,
      imageUrl,
    },
  };
};
