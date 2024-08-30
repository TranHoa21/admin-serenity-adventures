import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import axiosInstance from "../app/api/axiosInstance"
import { getAuthCookie } from "../utils/cookies"
require('dotenv').config();
const useGetConversations = () => {
    const [loading, setLoading] = useState(false);
    const [conversations, setConversations] = useState([]);
    const currentUserID = getAuthCookie().userId;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    useEffect(() => {
        console.log("check >>>", currentUserID)
        const getConversations = async () => {
            setLoading(true);
            try {
                const res = await axiosInstance.get(`${apiUrl}/user`);
                const data = await res.data;
                if (data.error) {
                    throw new Error(data.error);
                }
                const filteredConversations = data.filter((user: any) => user.id.toString() !== currentUserID);
                setConversations(filteredConversations);
            } catch (error: any) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        getConversations();
    }, []);

    return { loading, conversations };
}

export default useGetConversations