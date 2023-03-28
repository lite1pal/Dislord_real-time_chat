import React, { useState } from 'react';
import './SignUp.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

const SignUp = ({ isAuth }) => {
    const redirect = useNavigate();
    const [inputs, setInputs] = useState({
        username: '',
        email: '',
        age: '',
        password: ''
    });
    const { username, email, age, password } = inputs;
    const onChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const body = { username, email, age, password };
            if (username && email && password) {
                const requestOptions = {
                    method: "POST",
                    headers: { "Content-type": "application/json" },
                    body: JSON.stringify(body)
                }
                const response = await fetch('http://localhost:4001/api/users/signup', requestOptions);
                if (response.ok) {
                    const parseRes = await response.json();
                    document.cookie = `token=${parseRes}; path=/`;
                    console.log(parseRes);
                    redirect('/login');
                }
            }
        }
        catch (error) {
            console.error(error.message);
        }
    };

    return (
        <>
            <Navbar url={'/login'} inner={'Login'} isAuth={isAuth} />
            <div className="SignUp">
                <h1>Sign Up</h1>
                <form onSubmit={onSubmit}>
                    <input onChange={onChange} type='text' name='username' placeholder='Type your username' />
                    <input onChange={onChange} type='text' name='email' placeholder='Type your email' />
                    <input onChange={onChange} type='text' name='age' placeholder='Type your age' />
                    <input onChange={onChange} type='text' name='password' placeholder='Come up with a strong password' />
                    <button type='submit'>Sign up</button>
                </form>
            </div>
        </>
    )
}

export default SignUp;