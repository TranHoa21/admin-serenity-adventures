"use client"

import React, { useState, useRef, ChangeEvent, FormEvent, useEffect } from 'react';
import { useParams } from 'next/navigation';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import "../../../../style/blog/update.scss";
require('dotenv').config();
interface Post {
    id: number;
    title: string;
    content: string;
    description: string;
    link: string;
    image: string;

}

const ClientComponent = () => {
    const reactQuillRef = useRef<ReactQuill>(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<File | null>(null); // Thay đổi kiểu dữ liệu của state image
    const router = useRouter();
    const [post, setPost] = useState<Post | null>(null);
    const { link } = useParams();
    const [editorValue, setEditorValue] = useState('');
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const [selectedImageAlt, setSelectedImageAlt] = useState('');
    const quillRef = useRef<ReactQuill>(null);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;






    useEffect(() => {
        if (post) {
            setTitle(post.title);
            setContent(post.content);
            setDescription(post.description);
        }
    }, [post])

    const onChange = (newValue: string, delta: any, source: any, editor: any) => {
        if (source === 'user') {
            setEditorValue(newValue); // Update editorValue
            const text = editor?.getText() || '';
            setContent(text); // Update description
        }
    };

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
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('content', editorValue);
            if (image) {
                formData.append('file', image); // Sửa 'image' thành 'file'
            }

            const response = await axios.put(`${apiUrl}/post/${link}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data' // Đảm bảo cài đặt 'Content-Type' là 'multipart/form-data'
                }
            });
            console.log('check:', title, description, editorValue, image);
            router.push('/dashboard/blogs');
        } catch (error) {
            console.error('Lỗi:', error);
        }
    };

    useEffect(() => {
        if (link) {
            axios.get<Post>(`${apiUrl}/post/${link}`)
                .then(response => {

                    setPost(response.data);
                    setEditorValue(response.data.content); // Set editorValue as well

                })
                .catch(error => {
                    console.error('Lỗi khi lấy thông tin tour:', error);
                });
        } else {
            // Handle invalid id or show 404 page
        }
    }, [link]);

    return (

        <form className="update" onSubmit={handleSubmit}>
            {post ? (
                <div>
                    <h1>Update Post  </h1>
                    <span className="up-title">Title: <textarea
                        name="title"
                        defaultValue={post?.title || ''}
                        onChange={handleTitleChange}

                    /></span>
                    <span className="description" >Description: <textarea
                        className="inputText"
                        defaultValue={post?.description || ''}
                        onChange={handleDescriptionChange}
                        autoComplete="description"
                        placeholder=""
                        required /></span>
                    <br />


                    <img src={image ? URL.createObjectURL(image) : post?.image} alt={post?.image} className="img-blog" />
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
                    <button className="btn" type="submit" onClick={handleSubmit}  >Save</button>

                </div>
            )
                : (
                    <div>Loading...</div>
                )
            }
        </form>

    );
};

export default ClientComponent;
