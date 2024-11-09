import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import API from '../components/Config';
export default function BatchProcess() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const searchStudent = useCallback(async () => {
        const response = await axios.get(
            `${API}searchStudent?searchTerm=${searchTerm}`
        );
        if (response.data.error) {
            alert(response.data.error_msg);
        } else {
            setSearchResults(response.data.data);
        }
    }, [searchTerm]);

    useEffect(() => {
        if (searchTerm) {
            searchStudent();
        }
    }, [searchTerm, searchStudent]);

    return (
        <div className="p-4">
            <h2 className=" text-white text-2xl font-bold">Batch Process</h2>
            <div className="flex flex-col gap-4 border border-gray-700 p-4 rounded-md mt-2">
                <div className="flex flex-row gap-2">
                    <input
                        type="text"
                        placeholder="Search Student"
                        className="w-96"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                        onClick={searchStudent}
                    >
                        Search
                    </button>
                </div>
            </div>
        </div>
    );
}
