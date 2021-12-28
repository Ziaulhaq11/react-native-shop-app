import React, { useState, useEffect, useCallback, useReducer } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import CustomHeaderButton from "../../components/UI/HeaderButton";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";
import * as productActions from "../../store/actions/products";
import Input from '../../components/UI/Input'

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";
//Created outside to prevent unnecessary renders
const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      console.log(updatedFormIsValid)
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key]; //if one is false the entire thing will false

    }
    return {
      // ...state,not required
      formIsValid: updatedFormIsValid,
      inputValues: updatedValues,
      inputValidities: updatedValidities,
    };
  }
  return state;
};



const EditProductScreen = (props) => {
  const prodId = props.navigation.getParam("productId");

  const editedProduct = useSelector((state) =>
    state.products.userProducts.find((prod) => {
      return prod.id === prodId;
    })
  );

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedProduct ? editedProduct.title : "",
      imageUrl: editedProduct ? editedProduct.imageUrl : "",
      description: editedProduct ? editedProduct.description : "",
      price: "",
    },
    inputValidities: {
      title: editedProduct ? true : false,
      imageUrl: editedProduct ? true : false,
      description: editedProduct ? true : false,
      price: editedProduct ? true : false,
    },
    formIsValid: editedProduct ? true : false,
  });

const { title, description, price, imageUrl } = formState.inputValues;

  const submitHandler = useCallback(() => {
    if (!formState.formIsValid) {
      Alert.alert("Wrong Input!", "Please check errors in form", [
        { text: "OK" },
      ]);
      return;
    }
    if (editedProduct) {
      dispatch(
        productActions.updateProduct(prodId, title, description, imageUrl)
      );
    } else {
      dispatch(
        productActions.createProduct(title, description, imageUrl, +price)
      );
    }
    props.navigation.goBack();
  }, [
    dispatch,
    editedProduct,
    prodId,
    formState
  ]);
  console.log(formState)

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

  const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
    dispatchFormState({
      type: FORM_INPUT_UPDATE,
      value: inputValue,
      isValid: inputValidity,
      input: inputIdentifier,
    });
  }, [dispatchFormState]);

  return (
    <ScrollView>
      <View style={styles.form}>
        <Input
          label="Title"
          errorText="Please enter a valid title!"
          keyboardType="default"
          autoCapitalize="sentences"
          autoCorrect
          returnKeyType="next" //it doesnt do anything it just icons
          onInputChange={inputChangeHandler.bind(this, "title")}
          initialValue={editedProduct ? editedProduct.title : ""}
          initialValid={!!editedProduct} //!! means here if value is there then true otherwise false
        />
        <Input
          label="Image Url"
          errorText="Please enter a valid image url!"
          keyboardType="default"
          returnKeyType="next"
          onInputChange={inputChangeHandler.bind(this, "imageUrl")}
          initialValue={editedProduct ? editedProduct.imageUrl : ""}
          initialValid={!!editedProduct}
        />
        {editedProduct ? null : (
          <Input
            label="Price"
            errorText="Please enter a valid price!"
            keyboardType="decimal-pad"
            returnKeyType="next"
            onInputChange={inputChangeHandler.bind(this, "price")}
          />
        )}
        <Input
          label="Description"
          errorText="Please enter a valid description!"
          keyboardType="default"
          autoCapitalize="sentences"
          autoCorrect
          multiline
          numberOfLines={3}
          onInputChange={inputChangeHandler.bind(this, "description")}
          initialValue={editedProduct ? editedProduct.description : ""}
          initialValid={!!editedProduct}
        />
      </View>
    </ScrollView>
  );
};

EditProductScreen.navigationOptions = (navData) => {
  const submitfn = navData.navigation.getParam("submit");
  return {
    headerTitle: navData.navigation.getParam("productId")
      ? "Edit Product"
      : "New Product",
    headerRight: (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="Save"
          iconName={
            Platform.OS === "android" ? "md-checkmark" : "ios-checkmark"
          }
          onPress={submitfn}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
  
});

export default EditProductScreen;

/**
const EditProductScreen = (props) => {
  const prodId = props.navigation.getParam('productId');

  const editedProduct = useSelector(state => state.products.userProducts.find(prod => {return prod.id === prodId}))
  // console.log(editedProduct)

  const [title, setTitle] = useState(editedProduct ? editedProduct.title : '');
  const [imageUrl, setImageUrl] = useState(
    editedProduct ? editedProduct.imageUrl : ""
  );
  const [price, setPrice] = useState(editedProduct ? editedProduct.price : "");
  const [description, setDescription] = useState(
    editedProduct ? editedProduct.description : ""
  );
  const [titleIsValid,setTitleIsValid] = useState(false)
  const dispatch = useDispatch()

  const submitHandler = useCallback(() => {
    if (!titleIsValid) {
      Alert.alert('Wrong Input!', 'Please check errors in form', [{text : "OK"}])      
      return
    }
    if (editedProduct) {
        dispatch(productActions.updateProduct(prodId,title,description,imageUrl))
    } else {
      dispatch(productActions.createProduct(title,description,imageUrl,+price))
    }
    props.navigation.goBack()
  }, [dispatch,editedProduct,prodId,title,imageUrl,description,titleIsValid])
  
  useEffect(() => {
    props.navigation.setParams({'submit' : submitHandler})
  },[submitHandler])
  
  const titleChangeHandler = text => {
    if (text.trim().length === 0) {
      setTitleIsValid(false)
    } else {
      setTitleIsValid(true)
    }
    setTitle(text)
  }

  return (
    <ScrollView>
      <View style={styles.form}>
        <View style={styles.formControl}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={titleChangeHandler}
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next" //it doesnt do anything it just icons
            onEndEditing={() => console.log('onendediting')} // works when editing ends even we go to next field
            onSubmitEditing={() => console.log('onSubmit')} //only works when enter press in keyboard
          />
          {!titleIsValid && <Text>Please enter a valid title!</Text>}
        </View>
        <View style={styles.formControl}>
          <Text style={styles.label}>Image Url</Text>
          <TextInput
            style={styles.input}
            value={imageUrl}
            onChangeText={(text) => setImageUrl(text)}
            keyboardType="default"
          />
        </View>
              {editedProduct ? null : <View style={styles.formControl}>
                  <Text style={styles.label}>Price</Text>
                  <TextInput
                      style={styles.input} 
                      value={price}
            onChangeText={(text) => setPrice(text)}
            keyboardType="decimal-pad"
                  />
              </View>}
        <View style={styles.formControl}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={(text) => setDescription(text)}
          />
        </View>
      </View>
    </ScrollView>
  );
};

EditProductScreen.navigationOptions = (navData) => {
  const submitfn = navData.navigation.getParam('submit')
  return {
    headerTitle: navData.navigation.getParam("productId")
      ? "Edit Product"
      : "New Product",
    headerRight: (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="Save"
          iconName={
            Platform.OS === "android" ? "md-checkmark" : "ios-checkmark"
          }
          onPress={submitfn}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
  formControl: {
    width: "100%",
  },
  label: {
    fontWeight: "bold",
    marginVertical: 8,
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
});

export default EditProductScreen; */
