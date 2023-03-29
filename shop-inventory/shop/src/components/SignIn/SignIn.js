import React, { useEffect, useState } from 'react';
import { BsBuilding } from 'react-icons/bs';
import api from '../../api/api';
import './SignIn.css'
import { useNavigate } from "react-router-dom";

const SignIn = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("")
    const [saveLoader, setSaveLoader] = useState(false)

    const [error, setError] = useState({
        username: false,
        password: false
    })
    const [loginFailed, setLoginFailed] = useState(false)
    const navigate = useNavigate()
    const loginHandler = () => {
        if (username === "")
            setError((prev) => ({
                ...prev,
                username: true
            }))
        if (password === "")
            setError((prev) => ({
                ...prev,
                password: true
            }))

        if (!error.username && !error.password && username !== "" && password !== "") {
            setSaveLoader(true)
            api.post('/auth', { username, password }).then((response) => {
                setSaveLoader(false)
                if (response.data.message === "success") {
                    localStorage.setItem('auth', response.data.key)
                    navigate('/dashboard/home')
                    return
                }
                setLoginFailed(true)
                setTimeout(() => {
                    setLoginFailed(false)
                }, 3000)
            }).catch((error) => {
                setSaveLoader(false)
                console.log(error)
            })
        }
    }

    useEffect(() => {
        api.post('/auth/verify', { key: localStorage.getItem('auth') }).then((response) => {
            if (response.data === "success") {
                navigate('/dashboard/home')
            }
        }).catch((error) => {
            console.log(error)
        })
    }, [])

    const usernameHandler = (e) => {
        if (e.target.value === "")
            setError(prev => ({
                ...prev,
                username: true
            }))
        else {
            setUsername(e.target.value)
            setError(prev => ({
                ...prev,
                username: false
            }))
        }

    }
    const passwordHandler = (e) => {
        if (e.target.value === "")
            setError(prev => ({
                ...prev,
                password: true
            }))
        else {
            setPassword(e.target.value)
            setError(prev => ({
                ...prev,
                password: false
            }))
        }
    }
    return <div className="sign-in">
        {saveLoader && <div className='loader'>Please Wait...</div>}

        <div className='company'>
            <BsBuilding color="#407EF4" size="20" />
            <span className='company-name'>DKart</span>
        </div>
        {loginFailed && <div className='error'>Invalid Username or Password</div>}
        <form className='form'>
            <div className='form-group'>
                <label htmlFor='username'>Username</label>
                <input id="username" type="text" placeholder='John Doe' className={'form-item ' + (error.username ? 'error-border' : '')} onChange={(e) => usernameHandler(e)} />
                {error.username && <div className='error in-error'>Username cannot be empty</div>}
            </div>
            <div className='form-group'>
                <label htmlFor='password'>Password</label>
                <input id="password" type="password" className={'form-item ' + (error.password ? 'error-border' : '')} placeholder='********' onChange={(e) => passwordHandler(e)} autoComplete="true" />
                {error.password && <div className='error in-error'>Password cannot be empty</div>}
            </div>
        </form>
        <button className='sign-in-button' onClick={loginHandler}>Login</button>
    </div>;
};

export default SignIn;
