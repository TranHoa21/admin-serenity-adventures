import { RootState } from "../../app/store/store";
import { useDispatch, useSelector } from "react-redux";
import { selectConversation, setHasNewMessage } from "../../app/store/actions/messActions";
import "../../app/style/components/conversation.scss";
import axios from "axios";
import { removeShowChat } from "../../utils/cookies"
require('dotenv').config();
const Conversation = ({ conversation, lastIdx }: any) => {
    const dispatch = useDispatch();
    const selectedConversation = useSelector((state: RootState) => state.mess.selectedConversation);
    const onlineUsers = useSelector((state: RootState) => state.socket.onlineUsers);
    const isOnline = onlineUsers.includes(conversation.id);
    const isShow = conversation.admin === false;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const handleSelectConversation = async () => {
        try {
            dispatch(selectConversation(conversation));
            dispatch(setHasNewMessage(true));
            removeShowChat()
            await axios.put(`${apiUrl}/messages/${conversation.id}`, { admin: true });
        } catch (error) {
            console.error('Error updating message status:', error);
        }
    };

    return (
        <>
            <div
                className={`conversation ${selectedConversation?.id === conversation.id ? "bg" : ""}`}
                onClick={handleSelectConversation}
            >
                <div className={`avatar ${isOnline ? "online" : ""}`}>
                    <div className='user-A'>
                        <img className="img-av-user" src={conversation.avatar} alt='user avatar' />
                    </div>
                </div>
                <div className='side-mess'>
                    <div className='between'>
                        <p className='conver-name'>{conversation.name}</p>
                        {isShow && <span className='unread-badge'>...</span>}
                    </div>
                </div>
            </div>
            {!lastIdx && <div className='divider' />}
        </>
    );
};

export default Conversation;
