"use client"
import "../../style/tour/style.scss"
import axios from 'axios';
import { useEffect, useState } from 'react';
import Link from "next/link";
import React from "react";
import { useRouter, useSearchParams } from 'next/navigation';
require('dotenv').config();
type Props = {};

type Payment = {
    id: number;
    title: string;
    link: string;
    places_name: string;
    price: string;
};

export default function Tour({ }: Props) {
    const [data, setData] = useState<Payment[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(5);
    const router = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/tour`);
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

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleUpdate = (tour: Payment) => {
        const link = tour.link;
        router.push(`/dashboard/tours/update/${link}`);
    };

    const handleDelete = (tour: Payment) => {
        axios
            .delete(`${apiUrl}/tour/${tour.id}`)
            .then((response) => {
                console.log('Tour deleted successfully');

                // Update the data list after successful deletion
                const updatedData = data.filter((item) => item.id !== tour.id);
                setData(updatedData);
            })
            .catch((error) => {
                console.error('Failed to delete tour:', error);
            });
    };

    return (
        <div className="tour-container">
            <h2 className="tourTitle">Tours</h2>
            <Link href="/dashboard/tours/create">
                <button className="btn-create">Create new tour</button>
            </Link>
            <table className="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Link</th>
                        <th>Places Name</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((tour, index) => (
                        <tr className="tour-item" key={index}>
                            <td>{tour.title}</td>
                            <td>{tour.link}</td>
                            <td>{tour.places_name}</td>
                            <td>${tour.price}</td>
                            <td>
                                <button className="delete" onClick={() => handleDelete(tour)}>
                                    {' '}
                                    Delete{' '}
                                </button>
                                <button className="update" onClick={() => handleUpdate(tour)}>
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
    );
}