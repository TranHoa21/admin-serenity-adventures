"use client"

import axios from 'axios';
import { useEffect, useState } from 'react';
import Link from "next/link";
import React from "react";
import { useRouter, useParams } from 'next/navigation';
import "../../../style/order/style.scss"
import moment from 'moment';
import { BookingSelect } from "../booking"
require('dotenv').config();
type Props = {};


type Payment = {
    id: number;
    tour_name: string;
    name: string;
    email: string;
    start_day: string;
    booking_status: string;
    payment_status: string;
    people: number;
    phone_number: string;
    userId: number;

};


export default function Order() {
    const [bookingDetails, setBookingDetails] = useState<Payment | null>(null);
    const [bookingStatus, setBookingStatus] = useState('');
    const { id } = useParams();
    const router = useRouter();
    const userId = bookingDetails?.userId;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    useEffect(() => {
        axios.get<Payment>(`${apiUrl}/booking/${id}`)
            .then(response => {
                setBookingDetails(response.data);
            })
            .catch(error => {
                console.error('Lỗi khi lấy thông tin tour:', error);
            });
    }, [id]);


    const handleGenderChange = (value: string) => {
        setBookingStatus(value);
    };

    const handleUpdateId = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, booking: Payment) => {
        event.preventDefault();
        console.log("check >>>", bookingStatus)
        const id = booking.id;
        const booking_status = bookingStatus
        Promise.all([
            axios.put(`${apiUrl}/booking/${id}`, { booking_status }),
            router.push("/dashboard/orders")
        ]).then(([putResponse, _]) => {
            setBookingDetails(putResponse.data);
            return axios.post(`${apiUrl}/notificationclient`, {
                userId: userId,
                bookingId: id,
                message: `The customer has just created a new order ${booking_status}`
            });
        }).catch(error => {
            console.error('Failed to fetch booking details:', error);
        });
    };


    return (
        <>

            <div className="view-container">
                <h2>Order Update</h2>
                {bookingDetails && (
                    <div>
                        <p><strong>Tour Name:</strong> <i>{bookingDetails.tour_name}</i></p>
                        <p><strong>Email:</strong> <i>{bookingDetails.email}</i></p>
                        <p><strong>Name:</strong> <i>{bookingDetails.name}</i></p>
                        <p><strong>Number of people:</strong> <i>{bookingDetails.people}</i></p>
                        <p><strong>Phone Number:</strong> <i>{bookingDetails.phone_number}</i></p>
                        <p><strong>Start Day:</strong> <i>{moment(bookingDetails.start_day).format('YYYY-MM-DD')}</i></p>
                        <p><strong>Payment Status:</strong> <i>{bookingDetails.payment_status ? 'Payment success' : 'Payment in cash'}</i></p>
                        <div>
                            <p className="stt-book" ><strong>Booking status:</strong>
                                <BookingSelect
                                    value={bookingDetails.booking_status}
                                    onChange={handleGenderChange}
                                />
                            </p>
                        </div>
                        <button className="sub-update" onClick={(event) => handleUpdateId(event, bookingDetails)}>Update</button>
                    </div>
                )}
            </div>
        </>

    );
}