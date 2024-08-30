"use client"

import axios from 'axios';
import { useEffect, useState } from 'react';
import Link from "next/link";
import React from "react";
import { useRouter } from 'next/navigation';
import "../../style/order/style.scss"
import moment from 'moment';
import { BookingSelect } from "./booking"
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
    const [data, setData] = useState<Payment[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(5);
    const router = useRouter();
    const [view, setView] = useState(false);
    const [bookingDetails, setBookingDetails] = useState<Payment | null>(null);
    const [bookingStatus, setBookingStatus] = useState('');
    const [reloadData, setReloadData] = useState(false);
    const userId = bookingDetails?.userId
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
    }, [reloadData]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleGenderChange = (value: string) => {
        setBookingStatus(value);
    };

    const handleUpdate = (booking: Payment) => {
        const id = booking.id;
        console.log("check id >>", id);
        setView(true);
        axios.get(`${apiUrl}/booking/${id}`)
            .then(response => {
                setBookingDetails(response.data);
            })
            .catch(error => {
                console.error('Failed to fetch booking details:', error);
            });
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
    const handleDelete = (booking: Payment) => {
        axios
            .delete(`${apiUrl}/booking/${booking.id}`)
            .then((response) => {
                console.log('Tour deleted successfully');

                // Update the data list after successful deletion
                const updatedData = data.filter((item) => item.id !== booking.id);
                setData(updatedData);
            })
            .catch((error) => {
                console.error('Failed to delete tour:', error);
            });
    };

    return (
        <>
            {!view && (
                <div className="order-container">
                    <h2 className="orderTitle">Order</h2>
                    <Link href="/dashboard/orders/create">
                        <button className="btn-create">Create new order</button>
                    </Link>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Tour Name</th>
                                <th>Email</th>
                                <th>Name</th>
                                <th>Start Day</th>
                                <th>Payment Status</th>
                                <th>Booking Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((booking, index) => (
                                <tr className="order-item" key={index}>
                                    <td>{booking.tour_name}</td>
                                    <td>{booking.email}</td>
                                    <td>{booking.name}</td>
                                    <td>{moment(booking.start_day).format('YYYY-MM-DD')}</td>
                                    <td>{booking.payment_status ? 'Payment success' : 'Payment in cash'}</td>
                                    <td >
                                        <div className={`booking-status-${booking.booking_status.toLowerCase()}`}>
                                            {booking.booking_status}
                                        </div>
                                    </td>
                                    <td>
                                        <button className="delete" onClick={() => handleDelete(booking)}>
                                            {' '}
                                            Delete{' '}
                                        </button>
                                        <button className="update" onClick={() => handleUpdate(booking)}>
                                            {' '}
                                            Update{' '}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <ul className="pagination">
                        {Array.from({ length: Math.ceil(data.length / itemsPerPage) }).map((_, index) => (
                            <li key={index} className={currentPage === index + 1 ? 'active' : ''}>
                                <button className="pagi-btn" onClick={() => paginate(index + 1)}>
                                    {index + 1}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {view && (
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
                                <p className="stt-book" ><strong >
                                    Booking status:
                                </strong>
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
            )}
        </>

    );
}