"use client"
import "../../../style/dashboard/transactions.scss";
import Image from "next/image";
//import avatar from "../../../../public/img/user_1177568.png"
import axios from 'axios';
import { useEffect, useState } from 'react';
import moment from 'moment';
require('dotenv').config();
type Payment = {
    id: number;
    name: string;
    total_amount: string;
    start_day: string;
    booking_status: string;
    payment_status: string;

};
export default function Transactions() {
    const [data, setData] = useState<Payment[]>([]);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/booking`);
                const sortedData = response.data.sort((a: Payment, b: Payment) => {
                    // Sort tours based on their id in descending order (newest first)
                    return b.id - a.id;
                });
                setData(sortedData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);
    return (
        <div className="tran-container">
            <h2 className="tran-title">Latest Transactions</h2>
            <table className="table">
                <thead>
                    <tr>
                        <td> Name
                        </td>
                        <td> Status
                        </td>
                        <td> Date
                        </td>
                        <td> Amount
                        </td>
                    </tr>
                </thead>
                <tbody>
                    {data.slice(0, 4).map((booking, index) => (
                        <tr className="order-item" key={index}>
                            <td>
                                <div className="tran-user">
                                    <Image className="userImg" src="https://res.cloudinary.com/dhjrrk4pg/image/upload/v1715060332/user_1177568_mxilzq.png" alt="" width={40} height={40} />
                                    {booking.name}
                                </div>
                            </td>
                            <td>
                                <div className={`booking-status-${booking.booking_status ? booking.booking_status.toLowerCase() : ''}`}>
                                    {booking.booking_status}
                                </div>
                            </td>
                            <td>{moment(booking.start_day).format('YYYY-MM-DD')}</td>
                            <td><em>${booking.total_amount}</em></td>
                        </tr>
                    ))}

                </tbody>

            </table>

        </div>
    );
}
