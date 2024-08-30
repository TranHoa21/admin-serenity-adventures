"use client"
//tours/create/places
import React, { useState, useRef, ChangeEvent, FormEvent, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';

import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { PlaceSelect } from "../../create/places"
import axios from 'axios';
import { useRouter } from 'next/navigation';
import "../../../../style/tour/update.scss";
require('dotenv').config();
interface Tour {
    id: number;
    title: string;
    places_name: string;
    description: string;
    link: string;
    image: string;
    price: number;

}

const ClientComponent = () => {
    const reactQuillRef = useRef<ReactQuill>(null);
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState<number>(0);
    const [places_name, setPlaces_Name] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const router = useRouter();
    const [tour, setTour] = useState<Tour | null>(null);
    const { link } = useParams();
    const [editorValue, setEditorValue] = useState('');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    useEffect(() => {
        if (tour) {
            setTitle(tour.title);
            setPlaces_Name(tour.places_name);
            setDescription(tour.description);
        }
    }, [tour])

    const onChange = (newValue: string, delta: any, source: any, editor: any) => {
        if (source === 'user') {
            setEditorValue(newValue); // Update editorValue
            const text = editor?.getText() || '';
            setDescription(text); // Update description
        }
    };

    const handleTitleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setTitle(e.target.value);
    };

    const handlePlacesChange = (value: string) => {
        setPlaces_Name(value);
    };
    const handlePriceChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const value = parseFloat(e.target.value); // Chuyển đổi giá trị từ string sang number
        setPrice(value);
    };
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('places_name', places_name);
            formData.append('description', editorValue);
            if (image) {
                formData.append('file', image); // Sửa 'image' thành 'file'
            }

            const response = await axios.put(`${apiUrl}/tour/${link}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('check:', title, places_name, editorValue, image);
            router.push('/dashboard/tours');
        } catch (error) {
            console.error('Lỗi:', error);
        }
    };
    useEffect(() => {
        if (link) {
            axios.get<Tour>(`${apiUrl}/tour/${link}`)
                .then(response => {

                    setTour(response.data);
                    setPlaces_Name(response.data.places_name);
                    setDescription(response.data.description);
                    setEditorValue(response.data.description); // Set editorValue as well

                })
                .catch(error => {
                    console.error('Lỗi khi lấy thông tin tour:', error);
                });
        } else {
            // Handle invalid id or show 404 page
        }
    }, [link]);

    return (

        <div className="tour-link-container">
            <form className="update" onSubmit={handleSubmit}>
                {tour ? (
                    <div>
                        <h1>Update Tour </h1>

                        <span className='inputText'>Title: <textarea
                            name="title"
                            defaultValue={tour?.title || ''}
                            onChange={handleTitleChange}

                        /></span>


                        <PlaceSelect onChange={handlePlacesChange} value={places_name} />

                        <img src={image ? URL.createObjectURL(image) : tour?.image} alt={tour?.image} className="avatar" />
                        <input className="image-file" type="file" name="image" onChange={handleImageChange} />

                        <div className="description">
                            <ReactQuill
                                ref={reactQuillRef}
                                theme="snow"
                                placeholder="Start writing..."
                                modules={{
                                    toolbar: {
                                        container: [
                                            [{ header: "1" }, { header: "2" }, { font: [] }],
                                            [{ size: [] }],
                                            ["bold", "italic", "underline", "strike", "blockquote"],
                                            [
                                                { list: "ordered" },
                                                { list: "bullet" },
                                                { indent: "-1" },
                                                { indent: "+1" },
                                            ],
                                            ["link", "image", "video"],
                                            ["code-block"],
                                            ["clean"],
                                        ],
                                    },
                                    clipboard: {
                                        matchVisual: false,
                                    },
                                }}
                                formats={[
                                    "header",
                                    "font",
                                    "size",
                                    "bold",
                                    "italic",
                                    "underline",
                                    "strike",
                                    "blockquote",
                                    "list",
                                    "bullet",
                                    "indent",
                                    "link",
                                    "image",
                                    "video",
                                    "code-block",
                                ]}
                                value={editorValue}
                                onChange={onChange}
                            />
                        </div>
                        <span className='inputText'>Price:
                            <textarea className='price'
                                name="price"
                                defaultValue={tour?.price || ''}
                                onChange={handlePriceChange}

                            />
                        </span>

                        <button className="btn" type="submit" onClick={handleSubmit}  >Save</button>

                    </div>
                )
                    : (
                        <div>Loading...</div>
                    )
                }
            </form>
        </div>

    );
};

export default ClientComponent;
