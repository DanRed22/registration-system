import React, { useState } from 'react';
import ViewTable from '../components/ViewTable';
import Notification from '../components/Notification';
import { useNavigate } from 'react-router-dom';
export default function View() {
    const navigate = useNavigate();
    const [showNotif, setShowNotif] = useState(false);
    const [message, setMessage] = useState('');

    const goHome = () => {
        navigate('/');
    };
    const hideNotif = () => {
        setShowNotif(false);
    };
    return (
        <div className="flex items-center flex-col justify-center ">
            {showNotif && (
                <Notification hideNotif={hideNotif} message={message} />
            )}

            <button
                className="p-2 bg-green-500 m-2 rounded-md text-white transition duration-200 font-bold hover:bg-green-800 hover:shadow-lg"
                onClick={goHome}
            >
                Go Home
            </button>
            <div className="flex w-full flex-col justify-center items-center">
                <ViewTable showNotif={setShowNotif} setMessage={setMessage} />
            </div>
        </div>
    );
}
