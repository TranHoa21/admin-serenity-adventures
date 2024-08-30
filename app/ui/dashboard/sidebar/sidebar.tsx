"use client"
import "../../../style/dashboard/sidebar.scss";
import {
    MdDashboard,
    MdPeopleAlt,
    MdOutlineDirectionsTransit,
    MdOutlineLocalGroceryStore,
    MdContentPaste,
    MdPeople,
    MdOutlineSettings,
    MdHelpCenter,
    MdLogout,
    MdNotifications, MdOutlineChat, MdPublic,
} from "react-icons/md";
import MenuLink from "./menuLink/menuLink";
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from "react";
import { logout } from '../../../store/actions/authActions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import axios from 'axios';
import { getAuthCookie, removeAuthCookie } from "../../../../utils/cookies";
require('dotenv').config();
const menuItem = [

    {
        title: "Pages",
        list: [
            {
                title: "Dashboard",
                path: "/dashboard",
                icon: <MdDashboard />
            },
            {
                title: "User",
                path: "/dashboard/users",
                icon: <MdPeopleAlt />
            },
            {
                title: "Tours",
                path: "/dashboard/tours",
                icon: <MdOutlineDirectionsTransit />
            },
            {
                title: "Orders",
                path: "/dashboard/orders",
                icon: <MdOutlineLocalGroceryStore />
            },
            {
                title: "Blogs",
                path: "/dashboard/blogs",
                icon: <MdContentPaste />
            },
            {
                title: "Chat",
                path: "/dashboard/chat",
                icon: <MdOutlineChat />,
            },
            {
                title: "Notification",
                path: "/dashboard/notifications",
                icon: <MdNotifications />
            },
        ],

    },
    {
        title: "User",
        list: [
            {
                title: "Settings",
                path: "/dashboard/settings",
                icon: <MdOutlineSettings />
            },
            {
                title: "Help",
                path: "/dashboard/help",
                icon: <MdHelpCenter />
            },
            {
                title: "Tears",
                path: "/dashboard/tears",
                icon: <MdPeople />
            },
        ]
    }
]

interface User {
    name: string;
    id: string;
    avatar: string;
}

export default function SideBar() {
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);
    const [storedUser, setStoredUser] = useState<User | null>(null);
    const { isShowChat, isShowNotification, userId } = getAuthCookie()
    const handleLogout = () => {
        removeAuthCookie();
        router.push('/login');
    };
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<User[]>(`${apiUrl}/user/${user.id}`);
                const userData = response.data[0]
                setStoredUser(userData);


            } catch (error) {
                console.error('Lỗi khi lấy thông tin người dùng:', error);
            }
        };

        fetchData()

    }, [userId]);



    return (
        <div className="side-container">
            <div className="user">
                {storedUser && (
                    <>
                        <img src={storedUser.avatar} alt="avatar" className="userImage" width="50" height="50" />
                        <div className="userDetail">
                            <span className="userName">{storedUser.name}</span>
                            <span className="userTitle">Administrator</span>
                        </div>
                    </>
                )}
            </div>
            <ul className="list">
                <li key="Dashboard">
                    <MenuLink
                        item={{
                            title: "Dashboard",
                            path: "/dashboard",
                            icon: <MdDashboard />
                        }}
                    />
                </li>
                <li key="users">
                    <MenuLink
                        item={{
                            title: "User",
                            path: "/dashboard/users",
                            icon: <MdPeopleAlt />
                        }}
                    />
                </li>
                <li key="tours">
                    <MenuLink
                        item={{
                            title: "Tours",
                            path: "/dashboard/tours",
                            icon: <MdOutlineDirectionsTransit />
                        }}
                    />
                </li>
                <li key="orders">
                    <MenuLink
                        item={{
                            title: "Orders",
                            path: "/dashboard/orders",
                            icon: <MdOutlineLocalGroceryStore />
                        }}
                    />
                </li>
                <li key="blogs">
                    <MenuLink
                        item={{
                            title: "Blogs",
                            path: "/dashboard/blogs",
                            icon: <MdContentPaste />
                        }}
                    />
                </li>

                <li className="notification" key="chat">
                    <MenuLink
                        item={{
                            title: "Chat",
                            path: "/dashboard/chat",
                            icon: <MdOutlineChat />,
                        }}
                    />
                    {isShowChat === true && <div className="new-notification"></div>}
                </li>
                <li className="notification" key="Notification">
                    <MenuLink
                        item={{
                            title: "Notification",
                            path: "/dashboard/notifications",
                            icon: <MdNotifications />
                        }}
                    />
                    {isShowNotification === true && <div className="new-notification"></div>}

                </li>
            </ul>
            <button className="logout" onClick={handleLogout}>
                <MdLogout />
                Logout</button>
        </div>
    );
}