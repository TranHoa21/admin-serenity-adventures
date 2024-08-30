"use client"

import "../../../style/dashboard/card.scss";
import { MdSupervisedUserCircle } from "react-icons/md";
import { useState, useEffect } from 'react';
import axios from 'axios';
require('dotenv').config();
interface Booking {
    createdAt: string;
    total_amount: string;
}

export default function CardTotalRevenue() {
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [percentIncrease, setPercentIncrease] = useState(0);
    const [isPositive, setIsPositive] = useState(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/booking`);
                const data = response.data as Booking[];

                // Lấy tháng hiện tại và tháng trước
                const currentMonth = new Date().getMonth();
                const previousMonth = currentMonth - 1;

                const toursInCurrentMonth = data.filter(booking => {
                    const startDay = new Date(booking.createdAt);
                    return startDay.getMonth() === currentMonth;
                });

                const toursInPreviousMonth = data.filter(booking => {
                    const startDay = new Date(booking.createdAt);
                    return startDay.getMonth() === previousMonth;
                });

                // Tính tổng total_amount của các tour trong tháng hiện tại và tháng trước
                const totalAmountInCurrentMonth = toursInCurrentMonth.reduce((total: number, booking: Booking) => total + parseFloat(booking.total_amount), 0);
                const totalAmountInPreviousMonth = toursInPreviousMonth.reduce((total: number, booking: Booking) => total + parseFloat(booking.total_amount), 0);

                // Tính phần trăm tăng/giảm so với tháng trước
                let percentChange = 0;
                if (totalAmountInPreviousMonth !== 0) {
                    percentChange = ((totalAmountInCurrentMonth - totalAmountInPreviousMonth) / totalAmountInPreviousMonth) * 100;
                    setIsPositive(percentChange >= 0);
                } else if (totalAmountInCurrentMonth !== 0) {
                    percentChange = 100;
                    setIsPositive(true);
                }

                setTotalRevenue(totalAmountInCurrentMonth);
                setPercentIncrease(percentChange);
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
                <span className="card-title">Total Revenue</span>
                <span className="number" >
                    ${Math.abs(totalRevenue)}
                </span>
                <span className="card-detail">
                    <span className={isPositive ? 'positive' : 'negative'}>
                        {isFinite(percentIncrease) ? `${Math.abs(percentIncrease)}%` : 'N/A'}
                    </span>
                    {isPositive ? ' more' : ' less'} than the previous month
                </span>
            </div>
        </div>
    );
}