import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaWindowClose } from 'react-icons/fa';
import API from './Config';
import { Oval } from 'react-loader-spinner';

const BatchProcessModal = ({ batchProcessData, hide, refreshData }) => {
    const [course, setCourse] = useState('');
    const [organization, setOrganization] = useState('NONE');
    const [remarks, setRemarks] = useState('');
    const [timeIn, setTimeIn] = useState('');
    const [timeOut, setTimeOut] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showCoursesDropDown, setShowCoursesDropdown] = useState(false);
    const [showOrganizationDropDown, setShowOrganizationDropDown] =
        useState(false);
    const [sections, setSections] = useState([]);
    const [selectedSections, setSelectedSections] = useState([]);
    const [showSectionsDropDown, setShowSectionsDropDown] = useState(false);

    useEffect(() => {
        getAllSections();
    }, []);

    const getAllSections = async () => {
        try {
            const response = await axios.get(`${API}sections`);
            console.log(response);
            setSections(response.data);
        } catch (error) {
            console.log(error.message);
            console.log(error);
            setSections([]);
        }
    };

    useEffect(() => {
        console.log('SELECTED SEction', selectedSections);
    }, [selectedSections]);

    const handleCourseChange = (name) => {
        setCourse(name);
        setShowCoursesDropdown(false);
        console.log(course);
    };

    const handleOrgnameChange = (name) => {
        setOrganization(name);
        setShowOrganizationDropDown(false);
    };

    const handleTimeInChange = () => {
        if (timeIn === '' || timeIn === null) {
            setTimeIn(
                new Date().toLocaleDateString() +
                    ' ' +
                    new Date().toLocaleTimeString()
            );
        } else {
            setTimeIn(null);
        }
    };

    const handleTimeOutChange = () => {
        if (timeOut === '' || timeOut === null) {
            setTimeOut(
                new Date().toLocaleDateString() +
                    ' ' +
                    new Date().toLocaleTimeString()
            );
        } else {
            setTimeOut(null);
        }
    };

    const handleIRemarksChange = (e) => {
        setRemarks(e.target.value);
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        const obj = {
            course,
            section_ids: JSON.stringify(selectedSections),
            timeIn,
            timeOut,
            remarks,
        };
        const id_array = batchProcessData.map((item) => item.id);

        try {
            const response = await axios.post(`${API}processData`, {
                data: obj,
                ids: id_array,
            });
            refreshData();
            alert(response.data.message);
        } catch (error) {
            console.log(error);
            alert(error.response.data.error_msg);
        }
        setCourse('');
        setOrganization('Normal');
        setRemarks('');
        setTimeIn('');
        setTimeOut('');
        setIsLoading(false);
        setSelectedSections([]);
        hide();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
            <div className="w-[50rem] shadow-2xl bg-blue-950 rounded-lg p-8 overflow-auto">
                <div className="grid">
                    <h2 className="text-white text-2xl font-bold mb-4">
                        Add Member
                    </h2>
                    <div className="grid ">
                        <button
                            onClick={hide}
                            type="button"
                            className="flex transition duration-200 ease-in-out w-10 justify-self-end text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-800 font-medium rounded-lg text-lg items-center justify-center py-2.5 text-center"
                        >
                            <FaWindowClose />
                        </button>
                    </div>
                    <div class="grid gap-6 mb-6 md:grid-cols-2">
                        <div className="flex items-center justify-center flex-col">
                            <div>
                                <label
                                    for="organization"
                                    className="block mb-2 text-sm font-medium text-white"
                                >
                                    Organization
                                </label>
                                <button
                                    value={organization}
                                    onClick={() =>
                                        setShowOrganizationDropDown(
                                            !showOrganizationDropDown
                                        )
                                    }
                                    type="button"
                                    id="organization"
                                    className="justify-center w-64 h-10 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    placeholder="Game Changer / Starter"
                                >
                                    {organization}
                                    <svg
                                        class="w-2.5 h-2.5 ms-3"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 10 6"
                                    >
                                        <path
                                            stroke="currentColor"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="m1 1 4 4 4-4"
                                        />
                                    </svg>
                                </button>
                                {showOrganizationDropDown && (
                                    <div
                                        id="orgdrop"
                                        class="p-2 z-0 absolute bg-white rounded-lg shadow-lg w-[20rem] dark:bg-gray-700 text-center border-solid border border-black"
                                    >
                                        <button
                                            onClick={() =>
                                                handleOrgnameChange('NONE')
                                            }
                                            className="p-1 h-10 border rounded-lg w-full hover:bg-blue-200"
                                        >
                                            NONE
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleOrgnameChange(
                                                    'SUPREME STUDENT COUNCIL'
                                                )
                                            }
                                            className="p-1 h-10 rounded-lg border w-full hover:bg-blue-200"
                                        >
                                            SUPREME STUDENT COUNCIL
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleOrgnameChange(
                                                    'THE AIRMEN TIMES'
                                                )
                                            }
                                            className="p-1 h-10 rounded-lg w-full border hover:bg-blue-200"
                                        >
                                            THE AIRMEN TIMES
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleOrgnameChange(
                                                    'DEPARTMENT OFFICER'
                                                )
                                            }
                                            className="p-1 h-10 rounded-lg border w-full hover:bg-blue-200"
                                        >
                                            DEPARTMENT OFFICER
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleOrgnameChange(
                                                    'EVENT COMMITTEE'
                                                )
                                            }
                                            className="p-1 h-10 rounded-lg border w-full hover:bg-blue-200"
                                        >
                                            EVENT COMMITTEE
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4">
                                <label
                                    for="sections"
                                    className="block mb-2 text-sm font-medium text-white"
                                >
                                    Section
                                </label>
                                <button
                                    value={selectedSections}
                                    onClick={() =>
                                        setShowSectionsDropDown(
                                            !showSectionsDropDown
                                        )
                                    }
                                    type="button"
                                    id="sections"
                                    className="justify-center w-64 h-10 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    placeholder="Section"
                                >
                                    {!selectedSections ||
                                    selectedSections.length === 0 ? (
                                        <span>No Section Selected</span>
                                    ) : null}
                                    {selectedSections.map((item, index) =>
                                        index === selectedSections.length - 1
                                            ? item.name
                                            : item.name + ', '
                                    )}
                                    <svg
                                        class="w-2.5 h-2.5 ms-3"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 10 6"
                                    >
                                        <path
                                            stroke="currentColor"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="m1 1 4 4 4-4"
                                        />
                                    </svg>
                                </button>
                                {showSectionsDropDown && (
                                    <div
                                        id="sectiondrop"
                                        class="p-2 z-0 absolute bg-white rounded-lg shadow-lg w-[9rem] dark:bg-gray-700 text-center border-solid border border-black"
                                    >
                                        {sections?.map((item, index) => {
                                            return (
                                                <div className="p-1 indent-2 border border-solid border-slate-400 rounded-lg my-1 space-x-1 flex justify-start items-center">
                                                    <input
                                                        id={`section_${item.id}`}
                                                        type="checkbox"
                                                        checked={
                                                            selectedSections.find(
                                                                (section) =>
                                                                    section.id ===
                                                                    item.id
                                                            )
                                                                ? true
                                                                : false
                                                        }
                                                        onChange={() => {
                                                            if (
                                                                selectedSections.includes(
                                                                    item
                                                                )
                                                            ) {
                                                                setSelectedSections(
                                                                    selectedSections.filter(
                                                                        (
                                                                            section
                                                                        ) =>
                                                                            section.id !==
                                                                            item.id
                                                                    )
                                                                );
                                                            } else {
                                                                setSelectedSections(
                                                                    [
                                                                        ...selectedSections,
                                                                        item,
                                                                    ]
                                                                );
                                                            }
                                                        }}
                                                    />
                                                    <label
                                                        for={`section_${item.id}`}
                                                    >
                                                        {item.name}
                                                    </label>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-center flex-row">
                            <div className="mx-2">
                                <button
                                    onClick={() =>
                                        setShowCoursesDropdown(
                                            !showCoursesDropDown
                                        )
                                    }
                                    class=" h-10 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    type="button"
                                >
                                    {course ? course : 'Select Course'}
                                    <svg
                                        class="w-2.5 h-2.5 ms-3"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 10 6"
                                    >
                                        <path
                                            stroke="currentColor"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="m1 1 4 4 4-4"
                                        />
                                    </svg>
                                </button>

                                {/* <!-- Dropdown menu --> */}
                                {showCoursesDropDown && (
                                    <div class="z-0 absolute bg-white rounded-lg shadow w-44 dark:bg-gray-700">
                                        <button
                                            onClick={() =>
                                                handleCourseChange(null)
                                            }
                                            className="h-10 rounded-lg w-full hover:bg-blue-200"
                                        >
                                            Select Course
                                        </button>
                                        <button
                                            name="AMT"
                                            onClick={() =>
                                                handleCourseChange('AMT')
                                            }
                                            className="h-10 rounded-lg w-full hover:bg-blue-200"
                                        >
                                            AMT
                                        </button>
                                        <button
                                            name="AE"
                                            onClick={() =>
                                                handleCourseChange('AE')
                                            }
                                            className="h-10 rounded-lg w-full hover:bg-blue-200"
                                        >
                                            AE
                                        </button>
                                        <button
                                            name="AMGT"
                                            onClick={() =>
                                                handleCourseChange('AMGT')
                                            }
                                            className="h-10 rounded-lg w-full hover:bg-blue-200"
                                        >
                                            AMGT
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-row h-10">
                            <button
                                value={timeIn}
                                onClick={handleTimeInChange}
                                id="timein"
                                class={`bg-gray-50 mx-2 border border-gray-300  text-xs rounded-lg  block w-full p-2.5  placeholder-gray-400 text-black ${timeIn ? 'bg-green-700 hover:bg-green-800 text-white' : 'bg-blue-800 '}`}
                            >
                                {timeIn ? timeIn : 'Time In'}
                            </button>
                            <button
                                value={timeIn}
                                onClick={handleTimeOutChange}
                                id="timeout"
                                className={`bg-gray-50 border mx-2  text-xs border-gray-300  rounded-lg  block w-full p-2.5  placeholder-gray-400 text-black ${timeOut ? 'bg-green-700 hover:bg-green-800 text-white' : 'bg-blue-800 '}`}
                            >
                                {timeOut ? timeOut : 'Time Out'}
                            </button>
                        </div>

                        <div>
                            <label
                                for="remarks"
                                class="block mb-2 text-sm font-medium  text-white"
                            >
                                Remarks
                            </label>
                            <input
                                value={remarks}
                                onChange={handleIRemarksChange}
                                type="textarea"
                                id="remarks"
                                class="bg-gray-50 border border-gray-300  text-sm rounded-lg  block w-full p-2.5  placeholder-gray-400 text-black"
                                placeholder="Remarks Here"
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleSubmit}
                        type="button"
                        class="flex flex-row items-center justify-center space-x-4 w-[12rem] transition duration-200 focus:outline-none text-black hover:text-white bg-green-400 hover:bg-green-500 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                    >
                        <p>Process Data</p>
                        <Oval
                            visible={isLoading}
                            height={20}
                            width={20}
                            secondaryColor="#000000"
                            strokeWidth={6}
                            color="#000000"
                        />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BatchProcessModal;
