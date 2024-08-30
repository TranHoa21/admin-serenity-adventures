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
    like: number;
    comment: number;
};

export default function Blog({ }: Props) {
    const [data, setData] = useState<Payment[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(5);
    const router = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/post`);
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

    const handleUpdate = (post: Payment) => {
        const link = post.link;
        router.push(`/dashboard/blogs/update/${link}`);
    };

    const handleDelete = (post: Payment) => {
        axios
            .delete(`${apiUrl}/tour/${post.id}`)
            .then((response) => {
                console.log('Tour deleted successfully');

                // Update the data list after successful deletion
                const updatedData = data.filter((item) => item.id !== post.id);
                setData(updatedData);
            })
            .catch((error) => {
                console.error('Failed to delete tour:', error);
            });
    };

    return (
        <div className="tour-container">
            <h2 className="tourTitle">Tours</h2>
            <Link href="/dashboard/blogs/create">
                <button className="btn-create">Create new tour</button>
            </Link>
            <table className="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Link</th>
                        <th>Like</th>
                        <th>Comment</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((post, index) => (
                        <tr className="tour-item" key={index}>
                            <td>{post.title}</td>
                            <td>{post.link}</td>
                            <td>{post.like}</td>
                            <td>{post.comment}</td>
                            <td>
                                <button className="delete" onClick={() => handleDelete(post)}>
                                    {' '}
                                    Delete{' '}
                                </button>
                                <button className="update" onClick={() => handleUpdate(post)}>
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