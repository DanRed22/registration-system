import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { CiSearch } from 'react-icons/ci';
import RemarksModal from '../components/RemarksModal';
import API from './Config';
import { FaPencilAlt, FaRegEye } from 'react-icons/fa';
import ClipLoader from 'react-spinners/ClipLoader';
import SignatureModal from './SignatureModal';
import ShowSignatureModal from './ShowSignatureModal';

const Table = ({ showAddModal, setShowAddModal, showNotif, setMessage }) => {
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [showRemarksModal, setShowRemarksModal] = useState(false);
    const [remarkID, setRemarkID] = useState('');
    const [selectedID, setSelectedID] = useState('');
    const [selectedIDNumber, setSelectedIDNumber] = useState('');
    const [selectedName, setSelectedName] = useState('');
    const [remark, setRemark] = useState('');
    const [remarkName, setRemarkName] = useState('');
    const [showSignatureModal, setShowSignatureModal] = useState(false);
    const [showUserSig, setShowUserSig] = useState(false);
    const [imageSrc, setImageSrc] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const hideRemarksModal = () => {
        setShowRemarksModal(false);
    };
    const [editingEntryId, setEditingEntryId] = useState(null);
    const [amountInput, setAmountInput] = useState('');

    const handleAmountInputChange = (e) => {
        setAmountInput(e.target.value);
    };

    const [show, setShow] = useState({
        name: true,
        course: true,
        email: true,
        year: true,
        isStudent: true,
        timeout: false, //default false if feature not needed
        remarks: true, //aka medical disclosure
        signature: true,
        amount: false,
        organization: true,
    });

    const handleFilterClick = (name) => {
        setShow((prevShow) => ({
            ...prevShow,
            [name]: !prevShow[name],
        }));
    };

    const handleShowRemarks = (id, name, remark) => {
        setShowRemarksModal(true);
        setRemarkID(id);
        setRemarkName(name);
        setRemark(remark);
    };
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleAmountClick = (entry) => {
        setEditingEntryId(entry.id);
        setAmountInput(entry.amount);
        setIsEditing(true); // Set editing mode to true
    };

    const handleAmountSave = async (entry) => {
        await handleUpdate(entry.id, amountInput); // Call your existing update function
        setEditingEntryId(null); // Reset editing entry
        setIsEditing(false); // Exit editing mode
    };

    const handleUpdate = async (id, amount) => {
        console.log(id, amount);
        setIsEditing(false);
        try {
            await axios.post(`${API}setPaidAmount`, {
                id: id,
                paid_amount: amount,
            });
            showNotif(true);
            setMessage(`Successfully set amount`);
            handleSearch();
        } catch (error) {
            showNotif(true);
            setMessage(`Error: ${error.message}`);
        }
    };

    const handleSignaturePress = (id, id_number, name) => {
        setSelectedID(id);
        setSelectedIDNumber(id_number);
        setSelectedName(name);
        setShowSignatureModal(!showSignatureModal);
    };

    const handleShowUserSignature = (id, id_number, name) => {
        setSelectedID(id);
        setSelectedIDNumber(id_number);
        setSelectedName(name);
        setShowUserSig(!showUserSig);
    };

    const handleSearch = async () => {
        if (search && search !== '') {
            setIsLoading(true); // Set isLoading to true when the search begins
            try {
                const response = await axios.get(`${API}search`, {
                    params: {
                        searchTerm: search,
                    },
                });
                setData(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(true); // Set isLoading to true if the request fails
            }
        }
    };

    const handleClaim = async (id, name) => {
        console.log(id);
        if (id) {
            try {
                setIsLoading(true);
                const data = await axios.post(`${API}claim`, {
                    id: id,
                });
                setIsLoading(false);
                handleSearch();
                showNotif(true);
                setMessage(`${name} has Claimed`);
            } catch (error) {
                console.error(error);
                setIsLoading(true);
            }
        } else {
            showNotif(true);
            setMessage('Please input id to Claim');
        }
    };

    const handleUnclaim = async (id, name) => {
        console.log(id);
        if (id) {
            try {
                setIsLoading(true);
                const data = await axios.post(`${API}unclaim`, {
                    id: id,
                });
                setIsLoading(false);
                handleSearch();
                showNotif(true);
                setMessage(`${name} has Unclaimed`);
            } catch (error) {
                setIsLoading(true);
                console.error(error);
            }
        } else {
            showNotif(true);
            setMessage('Please input id to Unclaim');
        }
    };

    const handleTimeIn = async (id, name) => {
        if (id) {
            try {
                setIsLoading(true);
                const data = await axios.post(`${API}update-timein`, {
                    id: id,
                });
                setIsLoading(false);
                showNotif(true);
                setMessage(`Set Time In ${name}`);
                handleSearch();
            } catch (error) {
                setIsLoading(true);
                console.error(error);
            }
        } else {
            showNotif(true);
            setMessage('Failed to Update Time');
        }
    };
    const handleTimeOut = async (id, name) => {
        if (id) {
            const data = await axios.post(`${API}update-timeout`, {
                id: id,
            });
            showNotif(true);
            setMessage(`Set Time Out ${name}`);
            handleSearch();
        } else {
            showNotif(true);
            setMessage('Failed to Update Time');
        }
    };
    const handleResetTimeIn = async (id, name) => {
        if (id) {
            const data = await axios.post(`${API}reset-timein`, {
                id: id,
            });
            showNotif(true);
            setMessage(`Reset Time In ${name}`);
            handleSearch();
        } else {
            showNotif(true);
            setMessage('Failed to Update Time');
        }
    };
    const handleResetTimeOut = async (id, name) => {
        if (id) {
            const data = await axios.post(`${API}reset-timeout`, {
                id: id,
            });
            showNotif(true);
            setMessage(`Reset T-Out - ${name}`);
            handleSearch();
        } else {
            showNotif(true);
            setMessage('Failed to Update Time');
        }
    };

    //console.log(data)
    return (
        <div className="w-[90%]">
            {showUserSig && (
                <ShowSignatureModal
                    id={selectedID}
                    idNumber={selectedIDNumber}
                    name={selectedName}
                    close={handleShowUserSignature}
                />
            )}
            {showSignatureModal && (
                <SignatureModal
                    id={selectedID}
                    name={selectedName}
                    close={handleSignaturePress}
                />
            )}
            {showRemarksModal && (
                <RemarksModal
                    hideModal={hideRemarksModal}
                    id={remarkID}
                    name={remarkName}
                    remark={remark}
                    refresh={handleSearch}
                />
            )}
            <div className="flex flex-col lg:flex-row justify-items-end border border-white rounded-lg border-solid w-full my-4">
                <div class="m-2 flex justify-center justify-items-center items-center">
                    <button
                        onClick={() => {
                            setShowAddModal(!showAddModal);
                        }}
                        type="button"
                        className="transition duration-300 ease-in-out text-white block mt-2 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                    >
                        {' '}
                        Add Attendee
                    </button>
                </div>

                <div class="m-2 flex flex-col lg:flex-row justify-items-center items-center ">
                    <label
                        for="search-input"
                        class="block ml-4 text-sm font-medium text-white"
                    >
                        Search{' '}
                    </label>
                    <div className="flex md:flex-row align-middle justify-center items-center mr-2">
                        <CiSearch className=" text-white mx-2 " />
                        <input
                            type="text"
                            id="search-input"
                            class=" w-72 border text-sm rounded-lg  block p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                            onChange={handleSearchChange}
                            onKeyPress={handleKeyPress}
                            value={search}
                        />
                    </div>

                    <button
                        onClick={handleSearch}
                        type="button"
                        class="mt-2 ml-4 p-2.5 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                    >
                        Search
                    </button>
                </div>

                <div className="grid grid-cols-4 lg:grid-cols-10 items-center">
                    {Object.keys(show)
                        .filter((key) => key !== 'name')
                        .map((key) => (
                            <div className="mx-4" key={key}>
                                <input
                                    type="checkbox"
                                    name={key}
                                    checked={show[key]}
                                    onChange={() => handleFilterClick(key)}
                                />
                                <label
                                    htmlFor={key}
                                    className="text-white text-xs mx-2"
                                >
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                </label>
                            </div>
                        ))}
                </div>
            </div>
            <div class="overflow-auto shadow-md w-full ">
                <table className="w-full divide-gray-400 dark:divide-gray-700">
                    <thead className="bg-gray-100 dark:bg-gray-800 border-b-2 border-black">
                        <tr className="bg-white divide-y w-full">
                            <th
                                scope="col"
                                className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                            >
                                Name
                            </th>
                            {show.email ? (
                                <th
                                    scope="col"
                                    className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                >
                                    Email
                                </th>
                            ) : (
                                ''
                            )}
                            {show.course ? (
                                <th
                                    scope="col"
                                    className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                >
                                    Program and Year
                                </th>
                            ) : (
                                ''
                            )}
                            {show.amount ? (
                                <th
                                    scope="col"
                                    className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                >
                                    Amount
                                </th>
                            ) : (
                                ''
                            )}
                            {show.organization ? (
                                <th
                                    scope="col"
                                    className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                >
                                    Organization
                                </th>
                            ) : (
                                ''
                            )}
                            {show.isStudent ? (
                                <th
                                    scope="col"
                                    className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                >
                                    Student/Professional
                                </th>
                            ) : (
                                ''
                            )}
                            <th
                                scope="col"
                                className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                            >
                                Time In
                            </th>
                            {show.timeout ? (
                                <th
                                    scope="col"
                                    className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                >
                                    Time Out
                                </th>
                            ) : (
                                ''
                            )}
                            {show.remarks ? (
                                <th
                                    scope="col"
                                    className=" px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                >
                                    Remarks
                                </th>
                            ) : (
                                ''
                            )}
                            {show.signature ? (
                                <th
                                    scope="col"
                                    className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                >
                                    Signature
                                </th>
                            ) : (
                                ''
                            )}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                        {!isLoading ? (
                            <>
                                {data.map((entry) => (
                                    <tr
                                        key={entry.id}
                                        className="border-b-2 border-gray-200 dark:border-gray-700 text-sm"
                                    >
                                        <td className="px-1 py-1 whitespace-nowrap">
                                            {entry.name}
                                        </td>
                                        {show.email && (
                                            <td className="px-1 py-1 whitespace-nowrap">
                                                {entry.email}
                                            </td>
                                        )}
                                        {show.course && (
                                            <td className="px-1 py-1 whitespace-nowrap">
                                                {entry.program_year}
                                            </td>
                                        )}
                                        {show.amount && (
                                            <td className="px-1 py-1 whitespace-nowrap">
                                                {editingEntryId === entry.id ? (
                                                    <input
                                                        type="number"
                                                        value={amountInput}
                                                        onChange={
                                                            handleAmountInputChange
                                                        }
                                                        onBlur={() =>
                                                            handleAmountSave(
                                                                entry
                                                            )
                                                        }
                                                        onKeyPress={(e) => {
                                                            if (
                                                                e.key ===
                                                                'Enter'
                                                            ) {
                                                                handleAmountSave(
                                                                    entry
                                                                );
                                                            }
                                                        }}
                                                        className="border rounded p-1"
                                                    />
                                                ) : (
                                                    <button
                                                        onClick={() =>
                                                            handleAmountClick(
                                                                entry
                                                            )
                                                        }
                                                        className={`${entry.paid ? 'bg-green-700' : 'bg-red-700'} text-white p-2 rounded-lg hover:shadow-xl`}
                                                    >
                                                        {entry.paid
                                                            ? `₱ ${entry.amount}`
                                                            : 'Not Paid'}
                                                    </button>
                                                )}
                                            </td>
                                        )}
                                        {show.organization && (
                                            <td className="overflow-clip px-1 py-1">
                                                {entry.organization}
                                            </td>
                                        )}
                                        {show.isStudent && (
                                            <td className="px-1 py-1 whitespace-nowrap">
                                                {entry.isStudent
                                                    ? 'Student'
                                                    : 'Professional'}
                                            </td>
                                        )}
                                        {entry.timeIn ? (
                                            <td className="px-1 py-1 whitespace-nowrap">
                                                <button
                                                    onClick={() =>
                                                        handleResetTimeIn(
                                                            entry.id,
                                                            entry.name
                                                        )
                                                    }
                                                    type="button"
                                                    className={` cursor-pointer focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-xs px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800`}
                                                >
                                                    {entry.timeIn}
                                                </button>
                                            </td>
                                        ) : (
                                            <td className="px-1 py-1 whitespace-nowrap">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleTimeIn(
                                                            entry.id,
                                                            entry.name
                                                        )
                                                    }
                                                    className=" cursor-pointer focus:outline-none text-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 "
                                                >
                                                    Time In
                                                </button>
                                            </td>
                                        )}

                                        {show.timeout &&
                                            (entry.timeOut ? (
                                                <td className="px-1 py-1 whitespace-nowrap">
                                                    <button
                                                        onClick={() =>
                                                            handleResetTimeOut(
                                                                entry.id,
                                                                entry.name
                                                            )
                                                        }
                                                        type="button"
                                                        className=" cursor-pointer text-xs focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                                                    >
                                                        {entry.timeOut}
                                                    </button>
                                                </td>
                                            ) : (
                                                <td className="px-1 py-1 whitespace-nowrap">
                                                    <button
                                                        onClick={() =>
                                                            handleTimeOut(
                                                                entry.id,
                                                                entry.name
                                                            )
                                                        }
                                                        type="button"
                                                        className=" cursor-pointer focus:outline-none text-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 "
                                                    >
                                                        Time Out
                                                    </button>
                                                </td>
                                            ))}
                                        {show.remarks && (
                                            <td className="px-1 py-1 whitespace-nowrap">
                                                <button
                                                    onClick={() =>
                                                        handleShowRemarks(
                                                            entry.id,
                                                            entry.name,
                                                            entry.remarks
                                                        )
                                                    }
                                                    type="button"
                                                    className="text-white cursor-pointer bg-gradient-to-br from-red-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                                >
                                                    <FaPencilAlt />
                                                </button>
                                            </td>
                                        )}

                                        {show.signature && (
                                            <td className="px-1 py-1 whitespace-nowrap">
                                                {' '}
                                                {entry.signature === null ||
                                                entry.signature === '' ? (
                                                    <button
                                                        onClick={() =>
                                                            handleSignaturePress(
                                                                entry.id,
                                                                entry.id_number,
                                                                entry.name
                                                            )
                                                        }
                                                        type="button"
                                                        className="text-white cursor-pointer bg-gradient-to-br from-red-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                                    >
                                                        <FaPencilAlt />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() =>
                                                            handleShowUserSignature(
                                                                entry.id,
                                                                entry.id_number,
                                                                entry.name
                                                            )
                                                        }
                                                        type="button"
                                                        className="text-black cursor-pointer bg-gradient-to-br focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                                    >
                                                        <FaRegEye />
                                                    </button>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </>
                        ) : (
                            ''
                        )}
                    </tbody>
                </table>
                {isLoading && (
                    <div className="flex flex-col items-center h-96 bg-white p-5">
                        <ClipLoader />
                        <p className="mt-2 text-sm">
                            Currently Processing. If this notification persists
                            for 5 seconds.
                        </p>
                        <p className=" text-sm">
                            Possible Problems: Failed to Connect to Server or
                            Internet is Slow
                        </p>
                        <p className="mt-2 text-sm italic">
                            Possible Solution: Refresh your Browser or Restart
                            your Device.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Table;
