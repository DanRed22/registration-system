import React, { useEffect } from 'react';
import Table from '../components/Table';
import AddModal from '../components/AddModal';
import { useState } from 'react';
import Notification from '../components/Notification';
import axios from 'axios';
import API from '../components/Config';
import { useNavigate } from 'react-router-dom';
import config from '../configuration';
import ConfirmationResetModal from '../components/ConfirmationResetModal';

export const Attendance = () => {
    const navigate = useNavigate();
    const [showAddModal, setShowAddModal] = useState(false);
    const [showNotif, setShowNotif] = useState(false);
    const [message, setMessage] = useState('');
    const [showConfirmationResetModal, setShowConfirmationResetModal] =
        useState(false);
    const [paymentData, setPaymentData] = useState({
        totalPaid: 0,
        totalAmountPaid: 0,
        totalNotYetPaid: 0,
    });
    const [paymentData2, setPaymentData2] = useState({
        totalPaid: 0,
        totalAmountPaid: 0,
        totalNotYetPaid: 0,
    });
    const [data, setData] = useState({
        present: '100',
        absent: '50',
        total: '150',
    });
    const [showTotalPaid, setShowTotalPaid] = useState(false);

    const ExportPreview = () => {
        navigate('/view');
    };

    const refreshStatus = async () => {
        const response = await axios.get(`${API}status`);
        const paymentData = await axios.get(`${API}paymentTotal`);
        if (response.status === 200 && paymentData.status === 200) {
            setData(response.data);
            setPaymentData(paymentData.data);
        } else {
            setMessage('Error Connecting to Database!');
            setShowNotif(true);
        }
        const data = await axios.get(`${API}paymentTotal2`);
        if (response.status === 200 && data.status === 200) {
            setPaymentData2(data.data);
        } else {
            setMessage('Error Connecting to Database!');
            setShowNotif(true);
        }
    };

    const hideNotif = () => {
        setShowNotif(false);
        console.log('closed notif');
    };
    const hideAddModal = () => {
        setShowAddModal(false);
    };

    useEffect(() => {
        refreshStatus(); // Initial call
        const interval = setInterval(() => {
            refreshStatus(); // Refresh every 3 seconds
        }, 3000);

        return () => clearInterval(interval); // Cleanup
    }, []);

    return (
        <div>
            <div className="flex flex-col items-center overflow-auto">
                {showNotif && (
                    <Notification hideNotif={hideNotif} message={message} />
                )}
                {showConfirmationResetModal && (
                    <ConfirmationResetModal
                        type="revealPayment"
                        close={() => setShowConfirmationResetModal(false)}
                        action={setShowTotalPaid}
                    />
                )}
                <div>
                    <h1 class="mb-4 text-3xl font-extrabold text-white md:text-5xl lg:text-6xl">
                        <span class="bg-gradient-to-r from-green-700 to-yellow-500 text-transparent bg-clip-text font-bold py-2 px-4 rounded transition duration-300 hover:from-yellow-500 hover:to-green-700">
                            {' '}
                            {config.websiteName}{' '}
                        </span>
                    </h1>
                </div>
                <div>
                    <p class="text-lg font-normal text-gray-200 lg:text-xl dark:text-gray-100">
                        {config.subheader}
                    </p>
                </div>
                {showAddModal ? (
                    <div className=" fixed top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.8)] grid place-content-center z-50 overflow-auto">
                        <div className="w-[60%] ">
                            <AddModal className="" hide={hideAddModal} />
                        </div>
                    </div>
                ) : (
                    ''
                )}

                <div className="border border-white p-4 rounded-lg flex flex-row md:[40rem] lg:w-[60rem]">
                    <div className="w-1/4 my-2 items-center text-start">
                        <p className="text-white mr-4">
                            Present: {data.present}
                        </p>
                        <p className="text-white mr-4">Absent: {data.absent}</p>
                        <p className="text-white mr-4">Total: {data.total}</p>
                    </div>
                    <div className="flex flex-col w-1/4 my-2 items-start justify-start">
                        <p className="text-white font-bold">
                            {config.amount_1_name}
                        </p>
                        <p className="text-white">
                            Total Paid:{' '}
                            <b>
                                {showTotalPaid
                                    ? paymentData.totalPaid
                                    : '-------'}
                            </b>
                        </p>
                        <p className="text-white">
                            Total Amount Paid: PHP <br />
                            <b>
                                {showTotalPaid
                                    ? paymentData.totalAmountPaid
                                    : '--------'}
                            </b>
                        </p>
                    </div>
                    <div className="flex flex-col w-1/4 justify-start items-start">
                        <p className="text-white font-bold">
                            {config.amount_2_name}
                        </p>
                        <p className="text-white">
                            Total Paid:{' '}
                            <b>
                                {showTotalPaid
                                    ? paymentData2.totalPaid
                                    : '-------'}
                            </b>
                        </p>
                        <p className="text-white mr-4">
                            Total Amount Paid: PHP <br />
                            <b>
                                {showTotalPaid
                                    ? paymentData2.totalAmountPaid
                                    : '--------'}
                            </b>
                        </p>
                    </div>
                    <div className="flex flex-col w-1/4 justify-end space-y-2">
                        {!showTotalPaid ? (
                            <button
                                type="button"
                                className="h-12 w-24 focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
                                onClick={() =>
                                    setShowConfirmationResetModal(true)
                                }
                            >
                                Show
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="h-12 w-24 focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
                                onClick={() => setShowTotalPaid(false)}
                            >
                                Hide
                            </button>
                        )}

                        <button
                            type="button"
                            className="h-12 w-24 focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
                            onClick={ExportPreview}
                        >
                            Export
                        </button>

                        {
                            //this is hidden so the export capabilities will not be abused since it can significantly slow down the server
                        }
                    </div>
                </div>

                <Table
                    setShowAddModal={setShowAddModal}
                    showAddModal={showAddModal}
                    showNotif={setShowNotif}
                    setMessage={setMessage}
                    className=""
                />
            </div>
        </div>
    );
};
