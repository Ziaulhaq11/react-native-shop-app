import AsyncStorage from "@react-native-async-storage/async-storage";
export const SIGNUP = "SIGNUP";
export const LOGIN = "LOGIN";
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT'

let timer;

export const authenticate = (userId, token,expiryTime) => {
  return dispatch => {
    dispatch(setLogoutTimer(expiryTime))
    dispatch({ type: AUTHENTICATE, userId: userId, token: token });
  }
  // return {type : AUTHENTICATE, userId : userId,token : token}
}

export const signup = (email, password) => {
  return async (dispatch) => {
    //Web api key
    //Check Rules in realtime database to know how authentication is working
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyC8RojiFwOj1tsBu686D5pxtsLhMzAQtz0",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorMessage = errorResData.error.message;
      let message = "Something went wrong!";
      if (errorMessage === "EMAIL_EXISTS") {
        message = "Email Already Exists";
      } else if (errorMessage === "OPERATION_NOT_ALLOWED") {
        message = "OPERATION_NOT_ALLOWED";
      } else if (errorMessage === "TOO_MANY_ATTEMPTS_TRY_LATER") {
        message = "TOO_MANY_ATTEMPTS_TRY_LATER";
      }
      throw new Error(message);
    }

    const resData = await response.json();
        dispatch(authenticate(resData.localId,resData.idToken,parseInt(resData.expiresIn) * 1000));
        const expirationDate = new Date(
          new Date().getTime() + parseInt(resData.expiresIn) * 1000
        );
        saveDataToStorage(resData.idToken, resData.localId, expirationDate);
  };
};

export const login = (email, password) => {
  return async (dispatch) => {
    //Web api key
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyC8RojiFwOj1tsBu686D5pxtsLhMzAQtz0",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorMessage = errorResData.error.message;
      let message = "Something went wrong!";
      if (errorMessage === "EMAIL_NOT_FOUND") {
        message = "This email could not be found";
      } else if (errorMessage === "INVALID_PASSWORD") {
        message = "Password is incorrect";
      } else if (errorMessage === "USER_DISABLED") {
        message = "User has been disabled";
      }
      throw new Error(message);
    }

    const resData = await response.json();
            dispatch(authenticate(resData.localId, resData.idToken,parseInt(resData.expiresIn) * 1000));

    //get time gives milliseconds from 1970 and we're adding expires in milliseconds to it and converting to seconds and creating a new Date
    const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
    saveDataToStorage(resData.idToken,resData.localId,expirationDate)
  };
};

export const logout = () => {
  clearLogoutTimer()
  AsyncStorage.removeItem('userData')
  return {type : LOGOUT}
}

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer)
  }
}

const setLogoutTimer = expirationTime => {
  return dispatch => {
    timer = setTimeout(() => {
      dispatch(logout())
    }, expirationTime)
    console.log(timer)
  }
}

const saveDataToStorage = (token,userId,expirationDate) => {
  AsyncStorage.setItem('userData', JSON.stringify({
    token: token,
    userId: userId,
    expire : expirationDate.toISOString()
    }))
}
