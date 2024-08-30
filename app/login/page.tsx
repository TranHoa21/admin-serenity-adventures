"use client"

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
require('dotenv').config();
import "../style/login/login.scss"
import axiosInstance from '../api/axiosInstance'
import Cookies from 'js-cookie';

const Login = () => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();


    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const res = await axiosInstance.post(`${apiUrl}/auth/login`, {
                email,
                password,
            }, {
                withCredentials: true,
            });
            const userData = res.data.user;
            const role = userData.role;
            const userId = userData.id;
            Cookies.set('isLoggedIn', true.toString());
            Cookies.set('userId', userId);
            Cookies.set('accessToken', res.data.accessToken);
            if (role === true) {
                console.log("check", userData)
                router.push('/dashboard');
            } else {

                router.push('/...');

            }
        } catch (error) {
            console.error('Lỗi:', error);
        }
    };


    return (
        <div className="d1 w-100%">
            <form className="container">
                <div className="form" id="form">
                    <div className="content">
                        <h1>Log In</h1>
                        <div className="group">
                            <input
                                type="text"
                                className="inputText"
                                value={email}
                                onChange={handleEmailChange}
                                autoComplete="email"
                                placeholder=""
                                required
                            />
                            <label>Email</label>
                        </div>
                        <div className="group">
                            <input
                                type="password"
                                className="inputText"
                                value={password}
                                onChange={handlePasswordChange}
                                autoComplete="current-password"
                                placeholder=""
                                required
                            />
                            <label>Password</label>
                        </div>
                        <div className="group">
                            <input type="checkbox" />
                            <label>Save</label>
                        </div>
                        <button type="submit" onClick={handleSubmit}>LogIn</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Login;
