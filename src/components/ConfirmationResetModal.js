import React, { useState } from 'react';
import { FaWindowClose } from 'react-icons/fa';
import axios from 'axios';
import API from './Config';
import config from '../configuration';

export default function ConfirmationResetModal({ close, type }) {
    const [input, setInput] = useState('');

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };


    const handleClick = async () => {
        let endpoint = '';
        if(type === 'time'){
            endpoint = 'reset-all-time';
        }
        if(type === 'payment'){
            endpoint = 'reset-all-payments';
        }
        if(type === 'committee'){
            endpoint = 'resetCommitteeMembers';
        }
        try {
            console.log(input);
            const response = await axios.post(`${API}${endpoint}`, {
                secret: config.password,
                password: input,
            });
            alert(response.data.message);
            window.location.reload();
        } catch (error) {
            alert(error.message);
            console.error(error);
        } finally {
            close();
        }
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center">
            <div className="w-[50rem] rounded-xl flex justify-center items-center bg-white flex-col h-[20rem]">
                <div className="flex justify-end w-full px-10">
                    <button
                        onClick={close}
                        type="button"
                        className="mx-2 mt-4 cursor-pointer focus:outline-none text-white font-medium rounded-lg text-sm px-4 py-2.5 me-2 mb-2 bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-900"
                    >
                        <FaWindowClose />
                    </button>
                </div>
                <div>
                    <p>Please type your password to confirm</p>
                    <input
                        value={input}
                        onChange={handleInputChange}
                        type="password"
                        id="input"
                        class="bg-gray-50 border border-gray-300  text-sm rounded-lg  block w-full p-2.5  placeholder-gray-400 text-black "
                        placeholder="Enter Password"
                    />
                    <button
                        onClick={handleClick}
                        className="bg-red-700 p-2 hover:bg-red-900 text-white rounded-lg my-4"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}
