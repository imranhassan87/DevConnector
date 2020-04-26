import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    CLEAR_PROFILE
} from './types'
import { setAlert } from './alert'
import axios from 'axios'
import setAuthToken from '../utils/setAuthToken'


export const loadUser = () => async dispatch => {
    if (localStorage.token) {
        setAuthToken(localStorage.token)
    }

    try {
        const res = await axios.get('api/auth')
        dispatch({
            type: USER_LOADED,
            payload: res.data
        })
    } catch (error) {
        dispatch({
            type: AUTH_ERROR
        })
    }
}

//register user
export const resgister = ({ name, email, password }) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify({
        name,
        email,
        password
    })

    try {
        const res = await axios.post('/api/users', body, config)
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        })
        dispatch(loadUser())
    } catch (error) {
        const errors = error.response.data.errors
        if (errors) {
            errors.forEach(err => {
                dispatch(setAlert(err.msg, 'danger'))
            })
        }
        dispatch({
            type: REGISTER_FAIL
        })
    }
}

//login user

export const login = (email, password) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify({
        email,
        password
    })

    try {
        const res = await axios.post('/api/auth/login', body, config)
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        })
        dispatch(loadUser())
    } catch (error) {
        const errors = error.response.data.errors
        if (errors) {
            errors.forEach(err => {
                dispatch(setAlert(err.msg, 'danger'))
            })
        }
        dispatch({
            type: LOGIN_FAIL
        })
    }
}


//logout

export const logout = () => dispatch => {
    dispatch({
        type: CLEAR_PROFILE
    })
    dispatch({
        type: LOGOUT
    })
}