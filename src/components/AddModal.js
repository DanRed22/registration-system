import React, { useState } from 'react';
import axios from 'axios';
import { FaWindowClose } from 'react-icons/fa';
import API from '../components/Config';

const AddModal = ({ hide }) => {
    const [name, setName] = useState('');
    const [course, setCourse] = useState('');
    const [email, setEmail] = useState('');
    const [year, setYear] = useState('');
    const [isStudent, setIsStudent] = useState(true);
    const [organization, setOrganization] = useState('NONE');
    const [remarks, setRemarks] = useState('');
    const [timeIn, setTimeIn] = useState('');
    const [timeOut, setTimeOut] = useState('');
    // const [showCoursesDropDown, setShowCoursesDropdown] = useState(false);
    // const [showOrganizationDropDown, setShowOrganizationDropDown] =
    //     useState(false);
    // const [showYearDropDown, setShowYearDropDown] = useState(false);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    // const handleCourseChange = (name) => {
    //     setCourse(name);
    //     setShowCoursesDropdown(false);
    //     console.log(course);
    // };

    const handleOrgnameChange = (name) => {
        setOrganization(name);
        // setShowOrganizationDropDown(false);
    };

    // const handleYearChange = (number) => {
    //     setYear(number);
    //     // setShowYearDropDown(false);
    // };

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
        const response = await axios.post(`${API}add`, {
            name: name,
            email: email,
            course: course,
            year: year,
            isStudent: isStudent,
            organization: organization,
            remarks: remarks,
            timeIn: timeIn,
            timeOut: timeOut,
        });
        if (response) {
            alert(response.data.message);
        }
        setEmail('');
        setName('');
        setCourse('');
        setTimeIn(null);
        setTimeOut(null);

        setOrganization('Normal');
        setIsStudent(true);
        setRemarks('');
        setTimeIn('');
        setTimeOut('');
        hide();
    };

    return (
        <div className="w-[50rem] shadow-2xl bg-gradient-to-r from-blue-900 to-blue-950 rounded-lg p-8 overflow-auto">
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
                <div>
                    <label
                        for="name"
                        class="block mb-2 text-sm font-medium  text-white"
                    >
                        Full Name
                    </label>
                    <input
                        value={name}
                        onChange={handleNameChange}
                        type="text"
                        id="name"
                        class="bg-gray-50 border border-gray-300  text-sm rounded-lg  block w-full p-2.5  placeholder-gray-400 text-black "
                        placeholder="John Doe "
                    />

                    <label
                        for="name"
                        class="block mb-2 mt-4 text-sm font-medium  text-white"
                    >
                        Email
                    </label>
                    <input
                        value={email}
                        onChange={handleEmailChange}
                        type="text"
                        id="email"
                        class="bg-gray-50 border border-gray-300  text-sm rounded-lg  block w-full p-2.5  placeholder-gray-400 text-black "
                        placeholder="email@example.com"
                    />
                </div>
                <div className="flex items-center justify-center flex-col">
                    <div>
                        <label
                            for="organization"
                            className="block mb-2 text-sm  text-start font-medium text-white"
                        >
                            Organization
                        </label>
                        <input
                            type="text"
                            value={organization}
                            onChange={(e) =>
                                handleOrgnameChange(e.target.value)
                            }
                            placeholder="Organization Name"
                            className="h-10 text-black bg-white border border-gray-300 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-start"
                        />
                    </div>
                </div>

                <div className="flex flex-col">
                    <label
                        for="course"
                        className="text-white block mb-2 text-sm font-medium text-start"
                    >
                        Program and Year
                    </label>
                    <input
                        type="text"
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        placeholder="Course - Year"
                        className="h-10 text-black bg-white border border-gray-300 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-start"
                    />
                </div>

                <div className="flex flex-row">
                    <input
                        value={isStudent}
                        checked={isStudent}
                        onClick={() => setIsStudent(!isStudent)}
                        type="checkbox"
                        id="isStudent"
                        class="bg-gray-50 border border-gray-300  text-sm rounded-lg mr-2 block w-4 p-2.5  placeholder-gray-400 text-black"
                        placeholder="example@gmail.com"
                    />
                    <label for="isStudent" className="text-white">
                        Are they a Student?{' '}
                    </label>
                </div>
                <div className="flex flex-row h-10">
                    <button
                        value={timeIn}
                        onClick={handleTimeInChange}
                        id="timein"
                        className={`bg-gray-50 border mx-2 border-gray-300 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 ${timeIn ? 'bg-green-700 hover:bg-green-800 text-white' : 'bg-blue-800 text-black'}`}
                    >
                        {timeIn ? timeIn : 'Time In'}
                    </button>
                </div>
                <div className="flex flex-row h-10">
                    <button
                        value={timeOut}
                        onClick={handleTimeOutChange}
                        id="timeout"
                        className={`bg-gray-50 border mx-2 border-gray-300 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 ${timeOut ? 'bg-green-700 hover:bg-green-800 text-white' : 'bg-blue-800 text-black'}`}
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
                class="w-[12rem] transition duration-200 focus:outline-none text-black hover:text-white bg-green-400 hover:bg-green-500 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
                Add Attendee
            </button>
        </div>
    );
};

export default AddModal;
