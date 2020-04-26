import React, { Fragment, useState } from 'react'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { setAlert } from '../../actions/alert'
import { resgister } from '../../actions/auth'


const Register = ({ setAlert, resgister, isAuthenticated }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    })
    const { name, email, password, password2 } = formData
    const onChangeHandler = e => setFormData({ ...formData, [e.target.name]: e.target.value })

    const onSubmitHandler = async e => {
        e.preventDefault()

        if (password !== password2) {
            setAlert("Password did not match!", 'danger')
        } else {
            resgister({ name, email, password })
        }
    }

    if (isAuthenticated) {
        return <Redirect to='/dashboard' />
    }
    return (
        <Fragment>
            <h1 className="large text-primary">Sign Up</h1>
            <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
            <form className="form" onSubmit={e => onSubmitHandler(e)}>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Name"
                        name="name"
                        value={name}
                        required
                        onChange={e => onChangeHandler(e)} />
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        name="email"
                        required
                        onChange={e => onChangeHandler(e)} />
                    <small className="form-text">
                        This site uses Gravatar so if you want a profile image, use aGravatar email</small>
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        minLength="6"
                        required
                        value={password}
                        onChange={e => onChangeHandler(e)} />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name="password2"
                        required
                        minLength="6"
                        value={password2}
                        onChange={e => onChangeHandler(e)} />
                </div>
                <input type="submit" className="btn btn-primary" value="Register" />
            </form>
            <p className="my-1">
                Already have an account? <Link to="/login">Sign In</Link>
            </p>
        </Fragment>
    )
}

Register.prototype = {
    setAlert: PropTypes.func.isRequired,
    resgister: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
}
const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { setAlert, resgister })(Register)
