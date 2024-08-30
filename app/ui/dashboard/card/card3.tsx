"use client"

import "../../../style/dashboard/card.scss";
import { MdSupervisedUserCircle } from "react-icons/md";
import { useState, useEffect } from 'react';
import axios from 'axios';
require('dotenv').config();
interface Booking {
    createdAt: string;
}

export default function CardTotalOrders() {
    const [numberOfOrders, setNumberOfOrders] = useState(0);
    const [percentIncrease, setPercentIncrease] = useState(0);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/booking`);
                const data = response.data as Booking[];

                // Lấy tháng hiện tại và tháng trước
                const currentMonth = new Date().getMonth();
                const previousMonth = currentMonth - 1;

                const ordersInCurrentMonth = data.filter(booking => {
                    const createdAt = new Date(booking.createdAt);
                    return createdAt.getMonth() === currentMonth;
                });

                const ordersInPreviousMonth = data.filter(booking => {
                    const createdAt = new Date(booking.createdAt);
                    return createdAt.getMonth() === previousMonth;
                });

                // Tính số lượng đơn hàng trong tháng hiện tại và tháng trước
                const numberOfOrdersInCurrentMonth = ordersInCurrentMonth.length;
                const numberOfOrdersInPreviousMonth = ordersInPreviousMonth.length;

                // Tính phần trăm tăng so với tháng trước
                let percentIncrease = 0;
                if (numberOfOrdersInPreviousMonth !== 0) {
                    percentIncrease = ((numberOfOrdersInCurrentMonth - numberOfOrdersInPreviousMonth) / numberOfOrdersInPreviousMonth) * 100;
                } else if (numberOfOrdersInCurrentMonth !== 0) {
                    percentIncrease = 100;
                }

                setNumberOfOrders(numberOfOrdersInCurrentMonth);
                setPercentIncrease(percentIncrease);
            } catch (error) {
                console.error("Error fetching total orders:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="card-container">
            <MdSupervisedUserCircle size={24} />
            <div className="texts">
                <span className="card-title">Total Orders</span>
                <span className="number">{numberOfOrders}</span>
                <span className="card-detail">
                    <span className={percentIncrease >= 0 ? "positive" : "negative"}>
                        {isFinite(percentIncrease) ? `${Math.abs(percentIncrease)}%` : 'N/A'}
                    </span>
                    {percentIncrease >= 0 ? " more" : " less"} than the previous week
                </span>
            </div>
        </div>
    );
}