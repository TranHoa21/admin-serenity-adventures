import axios from 'axios';

const axiosInstance = axios.create({
    withCredentials: true, // Tự động gửi và nhận cookie
    baseURL: 'https://sever-production-702f.up.railway.app/api/v1', // Điều chỉnh baseURL của Axios nếu cần thiết
});

export default axiosInstance;