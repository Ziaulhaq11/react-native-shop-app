import React, { useReducer, useCallback, useState ,useEffect} from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Button,
    KeyboardAvoidingView,
    ActivityIndicator,
  Alert
} from "react-native";
import Card from "../../components/UI/Card";
import Input from "../../components/UI/Input";
import Colors from "../../constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";
import * as authActions from "../../store/actions/auth";

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
      // console.log(updatedFormIsValid);
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

const AuthScreen = (props) => {
    const [isSignup, setIsSignup] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [error,setError] = useState()
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: "",
      password: "",
    },
    inputValidities: {
      email: false, 
      password: false,
    },
    formIsValid: false,
  });
    
    useEffect(() => {
        if (error) {
            Alert.alert('An error occured', error, [{text : "Okay"}])
        }
    }, [error])

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );

  const authHandler = async () => {
    let action;
    if (isSignup) {
      action = authActions.signup(
        formState.inputValues.email,
        formState.inputValues.password
      );
    } else {
        action = authActions.login(
          formState.inputValues.email,
          formState.inputValues.password
        );
      }
      setError(null)
      setIsLoading(true)
      try {
          await dispatch(action);
          props.navigation.navigate('Shop')
      } catch (err) {
        setError(err.message)
        setIsLoading(false) //Previously it was outside try catch but problem is when we success at login then we will unmount from this component and getting a warning that cant perform state update if component unmounted
      }
    };
    
    
  return (
    <KeyboardAvoidingView
      behavior="height"
      keyboardVerticalOffset={50}
      style={styles.screen}
    >
      <LinearGradient colors={["#ffedff", "#ffe3ff"]} style={styles.gradient}>
        <Card style={styles.authContainer}>
          <ScrollView>
            <Input
              id="email"
              label="E-Mail"
              keyboardType="email-address"
              required
              email
              autoCapitalize="none"
              errorText="Please enter a valid Email!"
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <Input
              id="password"
              label="Password"
              keyboardType="default"
              secureTextEntry
              required
              minLength={5}
              autoCapitalize="none"
              errorText="Please enter a valid Password!"
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <View style={styles.buttonContainer}>
                          {isLoading ? <ActivityIndicator color={Colors.primary} size='small' /> : <Button
                              title={isSignup ? "Sign Up" : "Login"}
                              color={Colors.primary}
                              onPress={authHandler}
                          />}
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title={`Switch to ${isSignup ? "Login" : "Sign Up"} `}
                color={Colors.accent}
                onPress={() => {
                  setIsSignup((prevState) => !prevState);
                }}
              />
            </View>
          </ScrollView>
          <Input />
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

AuthScreen.navigationOptions = {
  headerTitle: "Authenticate",
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  authContainer: {
    width: "80%",
    maxWidth: 400,
    maxHeight: 400,
    padding: 20,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    marginTop: 10,
  },
});

export default AuthScreen;
