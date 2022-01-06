import React , { useEffect ,useRef}from 'react'
import { NavigationActions } from 'react-navigation'
import { useSelector } from 'react-redux'
import ShopNavigator from './ShopNavigator'


const NavigationContainer = () => {
    const navRef = useRef() //we dont have access to navigate to screens bc we are outside of navigator so we can use this to acheive
    const isAuth = useSelector(state => !!state.auth.token) //!!will force it to boolean if data is there true otherwise false

    console.log(navRef.current)
    useEffect(() => {
        if (!isAuth) {
            navRef.current.dispatch(NavigationActions.navigate({
                routeName: "Auth"
            }))
        }
    }, [isAuth])
    return <ShopNavigator ref={ navRef}/>
}

export default NavigationContainer