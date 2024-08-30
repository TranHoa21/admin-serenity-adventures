"use client"
import "../../../style/dashboard/card.scss";
import { MdSupervisedUserCircle } from "react-icons/md";
import { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
    createdAt: string;
    id: string;
    role: boolean;
}

export default function Card() {
    const [totalUsers, setTotalUsers] = useState(0);
    const [percentIncrease, setPercentIncrease] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('user');
                const data = response.data as User[];

                // Lấy tháng hiện tại và tháng trước
                const currentMonth = new Date().getMonth();
                const previousMonth = currentMonth - 1;

                const usersInCurrentMonth = data.filter(user => {
                    const startDay = new Date(user.createdAt);
                    return startDay.getMonth() === currentMonth;
                });

                const usersInPreviousMonth = data.filter(user => {
                    const startDay = new Date(user.createdAt);
                    return startDay.getMonth() === previousMonth;
                });

                // Tính tổng số lượng người đăng ký trong tháng hiện tại và tháng trước
                const totalUsersInCurrentMonth = usersInCurrentMonth.length;
                const totalUsersInPreviousMonth = usersInPreviousMonth.length;

                // Tính phần trăm tăng so với tháng trước
                let percentIncrease = 0;
                if (totalUsersInPreviousMonth !== 0) {
                    percentIncrease = ((totalUsersInCurrentMonth - totalUsersInPreviousMonth) / totalUsersInPreviousMonth) * 100;
                } else if (totalUsersInCurrentMonth !== 0) {
                    percentIncrease = 100;
                }

                setTotalUsers(totalUsersInCurrentMonth);
                setPercentIncrease(percentIncrease);
            } catch (error) {
                console.error("Error fetching total revenue:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="card-container">
            <MdSupervisedUserCircle size={24} />
            <div className="texts">
                <span className="card-title">Total Users</span>
                <span className="number">{totalUsers}</span>
                <span className="card-detail">
                    <span className={percentIncrease >= 0 ? "positive" : "negative"}>
                        {isFinite(percentIncrease) ? `${Math.abs(percentIncrease)}%` : 'N/A'}
                    </span>
                    {percentIncrease >= 0 ? " more" : " less"} than the previous month
                </span>
            </div>
        </div>
    );
}