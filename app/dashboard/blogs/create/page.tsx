"use client"

import React, { useState, ChangeEvent, FormEvent, } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import "../../../style/blog/create.scss";
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
require('dotenv').config();
const ClientComponent = () => {
    const [value, setValue] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [reviewImageUrl, setPreviewImageUrl] = useState('');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();

    const handleTitleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setTitle(e.target.value);
    };

    const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setImage(file);
            const imageUrl = URL.createObjectURL(file);
            setPreviewImageUrl(imageUrl);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', value);
            formData.append('description', description);
            if (image) {
                formData.append('file', image);
            }

            const response = await axios.post(`${apiUrl}/post`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('check:', title, content, value, image);
            router.push('/blogs');
        } catch (error) {
            console.error('Lỗi:', error);
        }
    };

    const handleChange = (content: string) => {
        setValue(content);
        setContent(content);
    };

    return (
        <div className="create">
            <h1>Create New Tour</h1>
            <span className="in-title">Title:
                <textarea
                    value={title}
                    onChange={handleTitleChange}
                    autoComplete="title"
                    placeholder=""
                    required />
            </span>
            <img src={reviewImageUrl} className="img-blog" />
            <input
                className="image-file"
                type="file"
                name="image"
                onChange={handleImageChange}
            />
            <div>
                <span className="sp-description">Description:
                    <textarea
                        className="inputText"
                        value={description}
                        onChange={handleDescriptionChange}
                        autoComplete="description"
                        placeholder=""
                        required />
                </span>
            </div>
            <div className="content">
                <SunEditor
                    defaultValue={value}
                    onChange={handleChange}
                    setOptions={{
                        height: 'auto',
                        buttonList: [
                            ['undo', 'redo'],
                            ['font', 'fontSize', 'formatBlock'],
                            ['bold', 'italic', 'underline', 'strike', 'subscript', 'superscript'],
                            ['fontColor', 'hiliteColor'],
                            ['removeFormat'],
                            '/', // Line break
                            ['outdent', 'indent'],
                            ['align', 'horizontalRule', 'list', 'lineHeight'],
                            ['table', 'link', 'image', 'video']
                        ]
                    }}
                />
            </div>
            <button className="btn" type="submit" onClick={handleSubmit}>Save</button>
        </div>
    );
};

export default ClientComponent;
