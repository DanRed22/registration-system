import React, { useState, useEffect, useCallback, Fragment } from 'react';
import axios from 'axios';
import API from '../components/Config';
import BatchProcessModal from '../components/BatchProcessModal';
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import BatchTable from '../components/BatchTable';
import { IoTrash } from 'react-icons/io5';
import ConfirmationResetModal from '../components/ConfirmationResetModal';
import Notification from '../components/Notification';
export default function BatchProcess() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showBatchProcessModal, setShowBatchProcessModal] = useState(false);
    const [batchProcessData, setBatchProcessData] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [currentResultIndex, setCurrentResultIndex] = useState(0);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [notification, setNotification] = useState(false);
    const [message, setMessage] = useState('');
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

    const processData = async () => {
        setShowBatchProcessModal(true);
    };

    useEffect(() => {
        if (searchTerm && searchTerm.length > 1) {
            searchStudent();
        }
    }, [searchTerm, searchStudent]);

    useEffect(() => {
        if (searchResults.length > 0) {
            setShowResults(true);
            setCurrentResultIndex(0);
        }
        if (!searchTerm || searchTerm.length < 2) {
            setShowResults(false);
            setCurrentResultIndex(-1);
            setSearchResults([]);
        }
    }, [searchResults]);

    const refreshData = async () => {
        try {
            const studentIds = batchProcessData.map((student) => student.id);
            const response = await axios.get(`${API}searchStudent?searchTerm=`);

            if (response.data.error) {
                setMessage(response.data.error_msg);
                setNotification(true);
            } else {
                // Get fresh data for existing students
                const refreshedStudents = response.data.data.filter((student) =>
                    studentIds.includes(student.id)
                );

                setBatchProcessData(refreshedStudents);
                setMessage('Student data refreshed successfully');
                setNotification(true);
            }
        } catch (error) {
            setMessage(error.message);
            setNotification(true);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                showResults &&
                !event.target.closest('.search-results-container')
            ) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showResults]);

    return (
        <Fragment>
            {notification && (
                <Notification
                    message={message}
                    hideNotif={() => setNotification(false)}
                />
            )}
            {showBatchProcessModal && (
                <BatchProcessModal
                    batchProcessData={batchProcessData}
                    hide={() => setShowBatchProcessModal(false)}
                    refreshData={refreshData}
                />
            )}
            {showConfirmationModal && (
                <ConfirmationResetModal
                    {...showConfirmationModal}
                    type="batch-process-delete"
                    close={() => setShowConfirmationModal(false)}
                />
            )}
            <div className="p-4">
                <h2 className=" text-white text-2xl font-bold">
                    Batch Process
                </h2>
                <div className="w-full flex flex-col gap-4 border border-gray-700 p-4 rounded-md mt-2">
                    <div className="flex flex-row gap-2 h-14 items-center p-2 w-1/2">
                        <button
                            className="bg-green-500 text-white px-4 py-2 rounded-md h-full"
                            onClick={() => navigate('/')}
                        >
                            <FaHome />
                        </button>
                        <div className="relative search-results-container">
                            <input
                                type="text"
                                placeholder="Search Student"
                                className="w-96 h-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={() => setShowResults(true)}
                                onKeyDown={(e) => {
                                    if (e.key === 'ArrowDown') {
                                        if (
                                            currentResultIndex <
                                            searchResults.length - 1
                                        ) {
                                            setCurrentResultIndex(
                                                currentResultIndex + 1
                                            );
                                        }
                                    }
                                    if (e.key === 'ArrowUp') {
                                        if (currentResultIndex > 0) {
                                            setCurrentResultIndex(
                                                currentResultIndex - 1
                                            );
                                        }
                                    }
                                    if (e.key === 'Enter') {
                                        if (
                                            currentResultIndex >= 0 &&
                                            searchResults.length > 0
                                        ) {
                                            batchProcessData.push(
                                                searchResults[
                                                    currentResultIndex
                                                ]
                                            );
                                        }
                                    }
                                }}
                            />
                            {showResults && searchResults.length > 0 && (
                                <div
                                    className="absolute z-10 w-96 mt-1 bg-white rounded-md shadow-lg"
                                    onBlur={(e) => {
                                        if (
                                            !e.currentTarget.contains(
                                                e.relatedTarget
                                            )
                                        ) {
                                            setShowResults(false);
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'ArrowDown') {
                                            if (
                                                currentResultIndex <
                                                searchResults.length - 1
                                            ) {
                                                setCurrentResultIndex(
                                                    currentResultIndex + 1
                                                );
                                            }
                                        }
                                        if (e.key === 'ArrowUp') {
                                            if (currentResultIndex > 0) {
                                                setCurrentResultIndex(
                                                    currentResultIndex - 1
                                                );
                                            }
                                        }
                                        if (e.key === 'Enter') {
                                            if (
                                                currentResultIndex >= 0 &&
                                                searchResults.length > 0
                                            ) {
                                                const isDuplicate =
                                                    batchProcessData.some(
                                                        (dataItem) =>
                                                            dataItem.id ===
                                                            searchResults[
                                                                currentResultIndex
                                                            ].id
                                                    );

                                                if (isDuplicate) {
                                                    alert(
                                                        'This student is already in the batch list'
                                                    );
                                                } else {
                                                    batchProcessData.push(
                                                        searchResults[
                                                            currentResultIndex
                                                        ]
                                                    );
                                                }
                                            }
                                        }
                                    }}
                                    tabIndex={-1}
                                >
                                    {searchResults.map((result, index) => (
                                        <button
                                            key={index}
                                            className={`w-full px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                                                index === currentResultIndex
                                                    ? 'bg-blue-200'
                                                    : ''
                                            }
                                            ${
                                                batchProcessData.some(
                                                    (dataItem) =>
                                                        dataItem.id ===
                                                        result.id
                                                )
                                                    ? 'bg-green-500'
                                                    : ''
                                            }`}
                                            onClick={() => {
                                                if (
                                                    !batchProcessData.some(
                                                        (dataItem) =>
                                                            dataItem.id ===
                                                            result.id
                                                    )
                                                ) {
                                                    batchProcessData.push(
                                                        result
                                                    );
                                                }
                                            }}
                                        >
                                            {result.name} - {result.year}{' '}
                                            {result.course}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-md"
                            onClick={searchStudent}
                        >
                            Search
                        </button>

                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded-md h-full w-full"
                            onClick={processData}
                        >
                            Process Data
                        </button>
                        <div className="flex flex-row justify-end h-8 w-full">
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded-md"
                                onClick={() => setShowConfirmationModal(true)}
                            >
                                <IoTrash />
                            </button>
                        </div>
                    </div>
                    <div className="w-[90%] p-2 flex justify-center items-center">
                        <BatchTable
                            key={batchProcessData.length}
                            data={batchProcessData}
                            setData={setBatchProcessData}
                        />
                    </div>
                </div>
            </div>
        </Fragment>
    );
}
