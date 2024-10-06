import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { CiSearch } from 'react-icons/ci';
import RemarksModal from '../components/RemarksModal';
import API from './Config';
import { FaPencilAlt, FaRegEye } from 'react-icons/fa';
import ClipLoader from 'react-spinners/ClipLoader';
import ViewOnlyShowSignatureModal from './ViewOnlyShowSignatureModal';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ExportMatTableToCSV from './ExportMatTableToCSV';
import config from '../configuration';
import ConfirmationResetModal from './ConfirmationResetModal';
import { debounce } from 'lodash';
const ViewTable = ({ showNotif, setMessage }) => {
    const filePath = '/signatures/';
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]); // Ensure data is an array initially
    const [paginatedData, setPaginatedData] = useState([]);
    const itemsPerPage = 16; // adjust this if necessary
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const fileNameExport = config.eventName; //change this if necessary
    const [currentPage, setCurrentPage] = useState(0);
    const navigate = useNavigate();
    const optionsDropdownRef = useRef(null);
    const filtersDropdownRef = useRef(null);
    const [organizations, setOrganizations] = useState([]);

    //Options Toggles
    const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
    const [showSig, setShowSig] = useState(true);
    const [sig, setSig] = useState(true);
    const [showCourse, setShowCourse] = useState(true);
    const [showRegular, setShowRegular] = useState(false);
    const [showRemarks, setShowRemarks] = useState(true);
    const [showSignatureModal, setShowSignatureModal] = useState(false);
    const [selectedID, setSelectedID] = useState(0);
    const [showEmail, setShowEmail] = useState(true);
    const [truncTime, setTruncTime] = useState(true);
    const [showCoursesDropDown, setShowCoursesDropDown] = useState(false);
    const [showFiltersDropDown, setShowFiltersDropDown] = useState(false);
    const [showYearLevelDropDown, setShowYearLevelDropDown] = useState(false);
    const [showPaid, setShowPaid] = useState(true);
    const [showPaid2, setShowPaid2] = useState(true);
    const [showTimeOut, setShowTimeOut] = useState(true);

    //SelectedRecord
    const [selectedName, setSelectedName] = useState('');
    const [selectedIDNumber, setSelectedIDNumber] = useState('');
    const [isExporting, setIsExporting] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState('');

    //Utilities
    const [showReset, setShowReset] = useState(false);
    const [exportCSV, setExportCSV] = useState(false);
    const [resetType, setResetType] = useState('');
    const [exportData, setExportData] = useState([]);

    //Filters
    const [coursesFilter, setCoursesFilter] = useState({
        AMT: true,
        AMGT: true,
        AE: true,
    });
    const [yearLevelFilter, setYearLevelFilter] = useState({
        Freshman: true,
        Sophomore: true,
        Junior: true,
        Senior: true,
    });
    const [orgsFilter, setOrgsFilter] = useState({}); // State to hold organization filters
    const [onlyPresent, setOnlyPresent] = useState(false);
    const [orderBy, setOrderBy] = useState('asc');
    const [showOrgDropDown, setShowOrgDropDown] = useState(false);
    const [paidFilter, setPaidFilter] = useState('ALL'); //ALL, PAID, UNPAID
    const [showPaidDropDown, setShowPaidDropDown] = useState(false);
    const [showOrg, setShowOrg] = useState(false);

    const toggleOrder = () => {
        setOrderBy((prevOrder) => {
            if (prevOrder === 'asc') return 'desc';
            if (prevOrder === 'desc') return 'asc';
            return prevOrder; // Prevent unnecessary state updates
        });
    };

    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                const response = await axios.get(`${API}organizations`);
                setOrganizations(response.data);
                // Set initial org filter state after fetching organizations
                const initialFilterState = response.data.reduce((acc, org) => {
                    acc[org] = true; // All organizations checked initially
                    return acc;
                }, {});
                setOrgsFilter(initialFilterState);
            } catch (error) {
                console.error('Error fetching organizations:', error);
            }
        };

        fetchOrganizations();
    }, []);

    /*Filter Select HANDLES*/
    const handleOrgFilterSelect = (org) => {
        setOrgsFilter((prev) => {
            const newFilter = {
                ...prev,
                [org]: !prev[org], // Toggle the checked state
            };
            handleSearch(newFilter); // Trigger search with updated filters
            return newFilter;
        });
    };

    const handleCoursesFilterSelect = useCallback((course) => {
        setCoursesFilter((prev) => ({
            ...prev,
            [course]: !prev[course],
        }));
    }, []);

    const handleYearLevelFilterSelect = async (year) => {
        setYearLevelFilter((prev) => ({
            ...prev,
            [year]: !prev[year],
        }));
    };

    const handleSetOnlyPresentClick = () => {
        setOnlyPresent(!onlyPresent);
        setShowFiltersDropDown(false);
    };

    /*===================================*/

    useEffect(() => {
        refreshPaginatedData(); // Refresh when data or current page changes
    }, [data, currentPage]);

    const refreshPaginatedData = useCallback(() => {
        if (!Array.isArray(data)) return; // Guard for edge cases
        setPaginatedData(
            data.slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
            )
        );
    }, [data, currentPage]);

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleViewSignature = (id, idNumber, name) => {
        setSelectedID(id);
        setSelectedIDNumber(idNumber);
        setSelectedName(name);
        toggleViewSignatureModal();
    };

    const handleClickRemarks = () => {
        setShowRemarks(!showRemarks);
    };

    const handleTruncTime = () => {
        setTruncTime(!truncTime);
    };

    const handleShowEmail = () => {
        setShowEmail(!showEmail);
    };

    const toggleViewSignatureModal = () => {
        setShowSignatureModal(!showSignatureModal);
    };
    const exportTableToPDF = async () => {
        setIsExporting(true);
        setExportData(paginatedData);
        const input = document.getElementById('table-container');
        const pdf = new jsPDF('l', 'mm', 'letter');
        const margin = 12; //12mm
        const pageWidth = pdf.internal.pageSize.width;
        const pageHeight = pdf.internal.pageSize.height;
        const imgWidth = pageWidth - 2 * margin;
        const verificationText = `Verified from (Attendance System © CACI SSC 2024) on ${new Date().toLocaleString()}`;

        // Set the initial page to 1
        let currentPage = 2;

        // Function to capture and add a single page
        const addPageToPDF = async (pageNumber) => {
            setCurrentPage(pageNumber); // Make sure to define this function as per your logic to set the page view
            const canvas = await html2canvas(input, {
                scale: 2,
                useCORS: true,
            });
            const imageData = canvas.toDataURL('image/jpeg', 0.95);
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // If it's not the first page, add a new page to the PDF
            if (pageNumber > 1) {
                pdf.addPage();
            }

            pdf.addImage(
                imageData,
                'JPEG',
                margin,
                margin,
                imgWidth,
                imgHeight
            );
            pdf.setFontSize(8);
            pdf.text(
                verificationText,
                margin,
                pageHeight - margin / 2 // Position text at the bottom margin
            );
        };

        // Iterate over all pages and add them to the PDF
        for (currentPage; currentPage <= totalPages + 1; currentPage++) {
            await addPageToPDF(currentPage);
        }

        // Save the PDF
        pdf.save(`${fileNameExport}.pdf`);
        setIsExporting(false);
        setCurrentPage(1);
    };

    const handleClickShowSig = () => {
        setShowSig(!showSig);
    };

    const handleClickSig = () => {
        setSig(!sig);
    };

    const handleClickProgram = () => {
        setShowCourse(!showCourse);
    };

    const handleClickAdditional = () => {
        setShowRegular(!showRegular);
    };

    const goHome = () => {
        navigate('/');
    };

    const handleSearchChange = useCallback(
        debounce((value) => {
            setSearch(value);
            // handleSearch(); // Call the search function when the input changes
        }, 10),
        []
    ); // Use a reasonable debounce time, e.g., 300ms
    // Adjust debounce time

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };
    const handleCommitteeOnly = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API}committeeMembers`, {
                params: {
                    coursesFilter: JSON.stringify(coursesFilter),
                    yearLevelFilter: JSON.stringify(yearLevelFilter),
                    orgsFilter: JSON.stringify(orgsFilter),
                    onlyPresent,
                    searchParams: search,
                    orderName: orderBy,
                },
            });
            if (response.status !== 200) {
                throw new Error(response);
            }
            setData(response.data.data);
            setCurrentPage(1);
            refreshPaginatedData();
        } catch (error) {
            setMessage(error.message);
            showNotif(true);
        } finally {
            setIsLoading(false);
        }
    }, [
        coursesFilter,
        yearLevelFilter,
        onlyPresent,
        search,
        orderBy,
        orgsFilter,
    ]);

    const handleSearch = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API}searchFiltered`, {
                params: {
                    coursesFilter: JSON.stringify(coursesFilter),
                    yearLevelFilter: JSON.stringify(yearLevelFilter),
                    orgsFilter: JSON.stringify(orgsFilter),
                    onlyPresent: onlyPresent,
                    paidFilter: paidFilter,
                    searchParams: search,
                    orderName: orderBy,
                },
            });
            if (response.status !== 200) {
                throw new Error(response);
            }
            setData(response.data.data);
            setCurrentPage(1);
            refreshPaginatedData();
        } catch (error) {
            setMessage(error.message);
            showNotif(true);
        } finally {
            setIsLoading(false);
        }
    }, [
        coursesFilter,
        yearLevelFilter,
        onlyPresent,
        search,
        orderBy,
        orgsFilter,
        paidFilter,
    ]);

    const handleExportCSV = () => {
        setIsExporting(false);
        setExportData(data);
        try {
            setExportCSV(true);
            const tableId = '#table-container-csv';
            ExportMatTableToCSV(tableId, fileNameExport);
        } catch (err) {
            console.error(err);
        } finally {
            setIsExporting(false);
            setExportCSV(false);
        }
    };

    const handleShowReset = () => {
        setShowReset(!showReset);
    };

    const currentDataToDisplay = isLoading
        ? []
        : exportCSV
          ? exportData
          : paginatedData;

    useEffect(() => {
        // Initialize the orgsFilter state based on fetched organizations
        const initialFilterState = organizations.reduce((acc, org) => {
            acc[org] = true; // Set all organizations to be initially checked
            return acc;
        }, {});
        setOrgsFilter(initialFilterState);
    }, [organizations]);

    // Debounce search input changes to prevent immediate API calls on every keystroke

    useEffect(() => {
        handleSearch(); // Trigger search immediately when filters or sorting order changes
        setCurrentPage(1);
    }, [
        coursesFilter,
        yearLevelFilter,
        onlyPresent,
        orderBy,
        orgsFilter,
        paidFilter,
    ]); // Separate the filters and order logic from search input

    const handlePaidFilter = (value) => {
        setPaidFilter(value);
    };

    // Close the dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                optionsDropdownRef.current &&
                !optionsDropdownRef.current.contains(event.target)
            ) {
                // Only close options dropdown if clicking outside the dropdown
                setShowOptionsDropdown(false);
            }
            if (
                filtersDropdownRef.current &&
                !filtersDropdownRef.current.contains(event.target)
            ) {
                // Only close filters dropdown if clicking outside the dropdown
                setShowFiltersDropDown(false);
                setShowYearLevelDropDown(false);
                setShowCoursesDropDown(false);
                setShowOrgDropDown(false);
            }
        };
        // Add event listener when the component mounts
        document.addEventListener('mousedown', handleClickOutside);
        // Remove event listener when the component unmounts
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="w-[90%]">
            {showReset && (
                <ConfirmationResetModal
                    className="z-20"
                    close={handleShowReset}
                    type={resetType}
                />
            )}
            {showSignatureModal && (
                <ViewOnlyShowSignatureModal
                    id={selectedID}
                    name={selectedName}
                    idNumber={selectedIDNumber}
                    close={toggleViewSignatureModal}
                />
            )}
            <div className="flex justify-items-end border border-white rounded-lg border-solid w-full my-2">
                <div className="m-2 flex justify-items-center items-center">
                    <label
                        htmlFor="search-input"
                        className="block ml-4 text-sm font-medium text-white"
                    >
                        Search{' '}
                    </label>
                    <CiSearch className=" text-white mx-2" />
                    <input
                        type="text"
                        id="search-input"
                        className="w-72 border text-sm rounded-lg block p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Search..."
                    />

                    <button
                        onClick={() => handleSearch}
                        type="button"
                        className="mt-2 ml-4 p-2.5 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                    >
                        Search
                    </button>

                    <button
                        onClick={toggleOrder}
                        className="mt-2 ml-4 p-2.5 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                    >
                        Order: {orderBy === 'asc' ? 'A->Z' : 'Z->A'}
                    </button>

                    <button
                        onClick={exportTableToPDF}
                        type="button"
                        className="mt-2 ml-4 p-2.5 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                    >
                        Export to PDF
                    </button>

                    <button
                        onClick={() => {
                            setShowReset(true);
                            setResetType('time');
                        }}
                        type="button"
                        className="mt-2 ml-4 p-2.5 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                    >
                        Reset Time
                    </button>

                    <button
                        onClick={() => {
                            setShowReset(true);
                            setResetType('payment');
                        }}
                        type="button"
                        className="mt-2 ml-4 p-2.5 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                    >
                        Reset Payments
                    </button>

                    <button
                        onClick={() => {
                            setShowReset(true);
                            setResetType('committee');
                        }}
                        type="button"
                        className="mt-2 ml-4 p-2.5 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                    >
                        Reset Committee
                    </button>

                    <button
                        onClick={handleExportCSV}
                        type="button"
                        className="mt-2 ml-4 p-2.5 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                    >
                        Export to CSV
                    </button>
                    {isExporting ? (
                        <ClipLoader size={'2rem'} color="white" />
                    ) : (
                        ''
                    )}
                </div>
            </div>
            <div className=" items-center flex flex-row my-4 space-x-4 border-white border-solid border-2 rounded-lg p-4 text-white">
                <div ref={optionsDropdownRef}>
                    {' '}
                    {/*************************  OPTIONS *****************************************/}
                    <button
                        onClick={() =>
                            setShowOptionsDropdown(!showOptionsDropdown)
                        }
                        className="w-64 h-10 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
                        type="button"
                    >
                        Options
                        <svg
                            className="w-2.5 h-2.5 ms-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 10 6"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m1 1 4 4 4-4"
                            />
                        </svg>
                    </button>
                    {showOptionsDropdown && (
                        <div className="absolute bg-white rounded-lg shadow w-48 text-black p-2">
                            <div className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    name="sig"
                                    checked={sig}
                                    onClick={handleClickSig}
                                />
                                <label htmlFor="sig" className="ml-2">
                                    Show Signatures
                                </label>
                            </div>
                            {sig && (
                                <div className="flex items-center mb-2">
                                    <input
                                        type="checkbox"
                                        name="show-sig"
                                        checked={showSig}
                                        onClick={handleClickShowSig}
                                    />
                                    <label
                                        htmlFor="show-sig"
                                        className="ml-2 text-start"
                                    >
                                        Image Signatures{' '}
                                        <span className="text-[0.75rem] italic">
                                            (Uncheck for CSV)
                                        </span>
                                    </label>
                                </div>
                            )}
                            <div className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    name="show-amount"
                                    checked={showPaid}
                                    onClick={() => setShowPaid(!showPaid)}
                                />
                                <label htmlFor="show-amount" className="ml-2">
                                    {'Show ' + config.amount_1_name}
                                </label>
                            </div>
                            <div className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    name="show-amount2"
                                    checked={showPaid2}
                                    onClick={() => setShowPaid2(!showPaid2)}
                                />
                                <label htmlFor="show-amount2" className="ml-2">
                                    {'Show ' + config.amount_2_name}
                                </label>
                            </div>
                            <div className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    name="show-prog"
                                    checked={showCourse}
                                    onClick={handleClickProgram}
                                />
                                <label htmlFor="show-prog" className="ml-2">
                                    Course
                                </label>
                            </div>
                            <div className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    name="show-add"
                                    checked={showRegular}
                                    onClick={handleClickAdditional}
                                />
                                <label htmlFor="show-add" className="ml-2">
                                    Regular
                                </label>
                            </div>
                            <div className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    name="email"
                                    checked={showEmail}
                                    onClick={handleShowEmail}
                                />
                                <label htmlFor="email" className="ml-2">
                                    Emails
                                </label>
                            </div>
                            <div className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    name="org"
                                    checked={showOrg}
                                    onClick={() => setShowOrg(!showOrg)}
                                />
                                <label htmlFor="org" className="ml-2">
                                    Show Organizations
                                </label>
                            </div>
                            <div className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    name="email"
                                    checked={showTimeOut}
                                    onClick={() => setShowTimeOut(!showTimeOut)}
                                />
                                <label htmlFor="email" className="ml-2">
                                    Show Time Out
                                </label>
                            </div>
                            <div className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    name="truncTime"
                                    checked={truncTime}
                                    onClick={handleTruncTime}
                                />
                                <label htmlFor="truncTime" className="ml-2">
                                    Truncate Time
                                </label>
                            </div>
                            <div className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    name="remarks"
                                    checked={showRemarks}
                                    onClick={handleClickRemarks}
                                />
                                <label htmlFor="remarks" className="ml-2">
                                    Remarks
                                </label>
                            </div>
                        </div>
                    )}
                </div>

                {/*************************  FILTERS *****************************************/}
                <div ref={filtersDropdownRef}>
                    <button
                        onClick={() =>
                            setShowFiltersDropDown(!showFiltersDropDown)
                        }
                        className="w-64 h-10 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
                        type="button"
                    >
                        Filters
                        <svg
                            className="w-2.5 h-2.5 ms-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 10 6"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m1 1 4 4 4-4"
                            />
                        </svg>
                    </button>

                    {showFiltersDropDown && (
                        <div className="absolute bg-white rounded-lg shadow w-48 text-black p-2 ">
                            <button
                                className="hover:bg-blue-200 p-2 rounded-lg"
                                onClick={() =>
                                    setShowCoursesDropDown(!showCoursesDropDown)
                                }
                            >
                                {showCoursesDropDown ? (
                                    <div className="border border-black absolute ml-40 flex-col bg-white p-4 rounded-lg w-64 ">
                                        <div
                                            className="hover:bg-blue-200 flex items-center justify-start space-x-3 flex-row border rounded-lg p-2"
                                            onClick={() =>
                                                handleCoursesFilterSelect('AMT')
                                            }
                                        >
                                            <input
                                                type="checkbox"
                                                checked={coursesFilter.AMT}
                                                onChange={() =>
                                                    handleCoursesFilterSelect(
                                                        'AMT'
                                                    )
                                                }
                                            />
                                            <label>AMT</label>
                                        </div>
                                        <div
                                            className="hover:bg-blue-200 flex items-center justify-start space-x-3 flex-row border rounded-lg p-2"
                                            onClick={() =>
                                                handleCoursesFilterSelect(
                                                    'AMGT'
                                                )
                                            }
                                        >
                                            <input
                                                type="checkbox"
                                                checked={coursesFilter.AMGT}
                                                onChange={() =>
                                                    handleCoursesFilterSelect(
                                                        'AMGT'
                                                    )
                                                }
                                            />
                                            <label>AMGT</label>
                                        </div>
                                        <div
                                            className="hover:bg-blue-200 flex items-center justify-start space-x-3 flex-row border rounded-lg p-2"
                                            onClick={() =>
                                                handleCoursesFilterSelect('AE')
                                            }
                                        >
                                            <input
                                                type="checkbox"
                                                checked={coursesFilter.AE}
                                                onChange={() =>
                                                    handleCoursesFilterSelect(
                                                        'AE'
                                                    )
                                                }
                                            />
                                            <label>AE</label>
                                        </div>
                                    </div>
                                ) : null}
                                {'Select Courses >'}
                            </button>

                            <button
                                className="hover:bg-blue-200 p-2 rounded-lg"
                                onClick={() =>
                                    setShowYearLevelDropDown(
                                        !showYearLevelDropDown
                                    )
                                }
                            >
                                {showYearLevelDropDown ? (
                                    <div className="border border-black absolute ml-40 flex-col bg-white p-4 rounded-lg w-64">
                                        <div
                                            className="flex items-center justify-start space-x-3 flex-row border rounded-lg p-2 hover:bg-blue-200"
                                            onClick={() =>
                                                handleYearLevelFilterSelect(
                                                    'Freshman'
                                                )
                                            }
                                        >
                                            <input
                                                type="checkbox"
                                                checked={
                                                    yearLevelFilter.Freshman
                                                }
                                                onChange={() =>
                                                    handleYearLevelFilterSelect(
                                                        'Freshman'
                                                    )
                                                }
                                            />
                                            <label>1st</label>
                                        </div>
                                        <div
                                            className="flex items-center justify-start space-x-3  flex-row border rounded-lg p-2 hover:bg-blue-200"
                                            onClick={() =>
                                                handleYearLevelFilterSelect(
                                                    'Sophomore'
                                                )
                                            }
                                        >
                                            <input
                                                type="checkbox"
                                                checked={
                                                    yearLevelFilter.Sophomore
                                                }
                                                onChange={() =>
                                                    handleYearLevelFilterSelect(
                                                        'Sophomore'
                                                    )
                                                }
                                            />
                                            <label>2nd</label>
                                        </div>
                                        <div
                                            className="flex items-center justify-start space-x-3  flex-row border rounded-lg p-2 hover:bg-blue-200"
                                            onClick={() =>
                                                handleYearLevelFilterSelect(
                                                    'Junior'
                                                )
                                            }
                                        >
                                            <input
                                                type="checkbox"
                                                checked={yearLevelFilter.Junior}
                                                onChange={() =>
                                                    handleYearLevelFilterSelect(
                                                        'Junior'
                                                    )
                                                }
                                            />
                                            <label>3rd</label>
                                        </div>
                                        <div
                                            className="flex items-center justify-start space-x-3  flex-row border rounded-lg p-2 hover:bg-blue-200"
                                            onClick={() =>
                                                handleYearLevelFilterSelect(
                                                    'Senior'
                                                )
                                            }
                                        >
                                            <input
                                                type="checkbox"
                                                checked={yearLevelFilter.Senior}
                                                onChange={() =>
                                                    handleYearLevelFilterSelect(
                                                        'Senior'
                                                    )
                                                }
                                            />
                                            <label>4th</label>
                                        </div>
                                    </div>
                                ) : null}
                                {'Select Year Level >'}
                            </button>
                            <div
                                className="flex-row hover:bg-blue-200 p-2 rounded-lg "
                                onClick={() => handleSetOnlyPresentClick()}
                            >
                                <input
                                    type="checkbox"
                                    name="onlyPresent"
                                    checked={onlyPresent}
                                    onClick={() => setOnlyPresent(!onlyPresent)}
                                ></input>
                                <label for="onlyPresent">Present Only</label>
                            </div>
                            <button
                                className="hover:bg-blue-200 p-2 rounded-lg"
                                onClick={() =>
                                    setShowPaidDropDown(!showPaidDropDown)
                                }
                            >
                                Payment Filter &gt;
                            </button>
                            {showPaidDropDown && (
                                <div className="absolute ml-44 border-black border mt-[-2rem] flex-col bg-white p-4 rounded-lg w-[35rem] space-x-4">
                                    <button
                                        className={`border border-black hover:bg-blue-200 p-2 rounded-lg duration-100 ${paidFilter === 'PAID' ? 'bg-green-600 text-white' : ''}`}
                                        onClick={() => handlePaidFilter('PAID')}
                                    >
                                        Show Paid
                                    </button>
                                    <button
                                        className={`border border-black hover:bg-blue-200 p-2 rounded-lg duration-100 ${paidFilter === 'UNPAID' ? 'bg-green-600 text-white' : ''}`}
                                        onClick={() =>
                                            handlePaidFilter('UNPAID')
                                        }
                                    >
                                        Show Unpaid
                                    </button>
                                    <button
                                        className={`border border-black hover:bg-blue-200 p-2 rounded-lg duration-100 ${paidFilter === 'ALL' || paidFilter === null || paidFilter === undefined || paidFilter === '' ? 'bg-green-600 text-white' : ''}`}
                                        onClick={() => handlePaidFilter('ALL')}
                                    >
                                        Show All
                                    </button>
                                </div>
                            )}
                            <button
                                className="hover:bg-blue-200 p-2 rounded-lg"
                                onClick={() =>
                                    setShowOrgDropDown(!showOrgDropDown)
                                }
                            >
                                {' '}
                                {'Select Organizations >'}
                            </button>

                            {showOrgDropDown ? (
                                <div className="absolute ml-44 border-black border mt-[-2rem] flex-col bg-white p-4 rounded-lg w-[35rem]">
                                    <div className="flex flex-row flex-wrap justify-center">
                                        {organizations
                                            .slice(0, 4)
                                            .map((org, index) => (
                                                <div
                                                    key={index}
                                                    className="flex flex-col border rounded-lg p-2 hover:bg-blue-300 items-start space-y-2 my-2 mx-2"
                                                    onClick={() =>
                                                        handleOrgFilterSelect(
                                                            org
                                                        )
                                                    }
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            orgsFilter[org]
                                                        }
                                                        onChange={() =>
                                                            handleOrgFilterSelect(
                                                                org
                                                            )
                                                        }
                                                    />
                                                    <label>{org}</label>
                                                </div>
                                            ))}
                                    </div>
                                    {organizations.length > 4 && (
                                        <div className="flex flex-row flex-wrap">
                                            {organizations
                                                .slice(4)
                                                .map((org, index) => (
                                                    <div
                                                        key={index + 4}
                                                        className="flex flex-row border rounded-lg p-2 hover:bg-blue-300 items-center space-x-3 justify-start w-1/2"
                                                        onClick={() =>
                                                            handleOrgFilterSelect(
                                                                org
                                                            )
                                                        }
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                orgsFilter[org]
                                                            }
                                                            onChange={() =>
                                                                handleOrgFilterSelect(
                                                                    org
                                                                )
                                                            }
                                                        />
                                                        <label>{org}</label>
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                </div>
                            ) : null}
                        </div>
                    )}
                </div>
                <button
                    onClick={handleSearch}
                    type="button"
                    className="mt-2 ml-4 p-2.5 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                >
                    Display All
                </button>

                <button
                    onClick={handleCommitteeOnly}
                    type="button"
                    className="mt-2 ml-4 p-2.5 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                >
                    Only List Committee
                </button>
            </div>

            <div className="w-[100%] overflow-x-auto overflow-y-auto shadow-md flex flex-col justify-center items-center">
                <div className="flex flex-row">
                    <button
                        type="button"
                        onClick={prevPage}
                        class="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
                    >
                        Prev
                    </button>
                    <p className="text-white">
                        {currentPage} / {totalPages}
                    </p>
                    <button
                        type="button"
                        onClick={nextPage}
                        class="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
                    >
                        Next
                    </button>
                </div>
                <table
                    id="table-container"
                    className=" w-[80%] divide-gray-200 dark:divide-gray-700"
                >
                    {' '}
                    {/* Shirking the table makes it appear larger when printing */}
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th
                                scope="col"
                                className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                            >
                                {' '}
                            </th>
                            {showOrg ? (
                                <th
                                    scope="col"
                                    className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                >
                                    Organization
                                </th>
                            ) : null}
                            <th
                                scope="col"
                                className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                            >
                                Name
                            </th>
                            <th
                                scope="col"
                                className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                            >
                                Year
                            </th>
                            {showEmail ? (
                                <th
                                    scope="col"
                                    className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                >
                                    Email
                                </th>
                            ) : (
                                ''
                            )}
                            {showCourse ? (
                                <th
                                    scope="col"
                                    className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                >
                                    Course
                                </th>
                            ) : (
                                ''
                            )}
                            {showRegular ? (
                                <th
                                    scope="col"
                                    className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                >
                                    Regular
                                </th>
                            ) : (
                                ''
                            )}
                            {showPaid ? (
                                <th
                                    scope="col"
                                    className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                >
                                    {config.amount_1_name}
                                </th>
                            ) : (
                                ''
                            )}
                            {showPaid2 ? (
                                <th
                                    scope="col"
                                    className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                >
                                    {config.amount_2_name}
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
                            {showTimeOut && (
                                <th
                                    scope="col"
                                    className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                >
                                    Time Out
                                </th>
                            )}
                            {sig ? (
                                <th
                                    scope="col"
                                    className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                >
                                    Signature
                                </th>
                            ) : (
                                ''
                            )}
                            {showRemarks ? (
                                <th
                                    scope="col"
                                    className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                >
                                    Remarks
                                </th>
                            ) : (
                                ''
                            )}
                        </tr>
                    </thead>
                    <tbody className="bg-white  divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                        {!isLoading && currentDataToDisplay.length > 0 //change paginatedData to data if you want to export all in CSV
                            ? currentDataToDisplay.map((entry, idx) => (
                                  <tr
                                      key={entry.id}
                                      className="border-b border-gray-200 dark:border-gray-700 text-sm min-h-20"
                                  >
                                      <td className="px-1 py-1 whitespace-normal break-words overflow-wrap">
                                          {idx +
                                              1 +
                                              (currentPage - 1) * itemsPerPage}
                                      </td>
                                      {showOrg ? (
                                          <td className="px-1 py-1 whitespace-normal break-words overflow-wrap">
                                              {entry.organization}{' '}
                                              {entry.position
                                                  ? `: ${entry.position}`
                                                  : null}
                                          </td>
                                      ) : null}
                                      <td className="px-1 py-1 whitespace-normal break-words overflow-wrap">
                                          {entry.name}
                                      </td>
                                      <td className="px-1 py-1 whitespace-normal break-words overflow-wrap">
                                          {entry.year}
                                      </td>
                                      {showEmail ? (
                                          <td className="px-1 py-1 whitespace-normal break-words overflow-wrap ">
                                              {entry.email}
                                          </td>
                                      ) : (
                                          ''
                                      )}
                                      {showCourse ? (
                                          <td className="px-1 py-1 whitespace-normal break-words overflow-wrap">
                                              {entry.course}
                                          </td>
                                      ) : (
                                          ''
                                      )}
                                      {showRegular ? (
                                          <td className="px-1 py-1 whitespace-normal break-words overflow-wrap">
                                              {entry.regular ? '✅' : '❌'}
                                          </td>
                                      ) : (
                                          ''
                                      )}

                                      {showPaid ? (
                                          <td className="px-1 py-1 whitespace-normal break-words overflow-wrap">
                                              {entry.amount > 0
                                                  ? entry.amount
                                                  : '❌'}
                                          </td>
                                      ) : (
                                          ''
                                      )}

                                      {showPaid2 ? (
                                          <td className="px-1 py-1 whitespace-normal break-words overflow-wrap">
                                              {entry.amount_2 !== '' &&
                                              entry.amount_2 &&
                                              entry.amount_2 > 0
                                                  ? entry.amount_2
                                                  : '❌'}
                                          </td>
                                      ) : (
                                          ''
                                      )}

                                      {!truncTime ? (
                                          <td className="px-1 py-1 text-xs font-medium whitespace-normal break-words overflow-wrap">
                                              {entry.timeIn}
                                          </td>
                                      ) : (
                                          <td className="px-1 py-1 text-xs font-medium whitespace-normal break-words overflow-wrap">
                                              {entry.timeIn ? (
                                                  <span className="text-green-500">
                                                      YES
                                                  </span>
                                              ) : (
                                                  <span className="text-red-500">
                                                      NO
                                                  </span>
                                              )}
                                          </td>
                                      )}
                                      {showTimeOut &&
                                          (!truncTime ? (
                                              <td className="px-1 py-1 text-xs font-medium whitespace-normal break-words overflow-wrap">
                                                  {entry.timeOut}
                                              </td>
                                          ) : (
                                              <td className="px-1 py-1 text-xs font-medium whitespace-normal break-words overflow-wrap">
                                                  {entry.timeOut ? (
                                                      <span className="text-green-500">
                                                          YES
                                                      </span>
                                                  ) : (
                                                      <span className="text-red-500">
                                                          NO
                                                      </span>
                                                  )}
                                              </td>
                                          ))}

                                      {sig === true && (
                                          <td className="px-1 py-1 whitespace-nowrap ">
                                              {entry.signature &&
                                              entry.timeIn ? (
                                                  showSig ? (
                                                      <img
                                                          onClick={() =>
                                                              handleViewSignature(
                                                                  entry.id,
                                                                  entry.id_number,
                                                                  entry.name
                                                              )
                                                          }
                                                          src={`${filePath}${entry.id}.png`}
                                                          alt="Signature"
                                                          className="h-10 object-fill"
                                                      />
                                                  ) : (
                                                      <span className="text-xs font-bold italic text-green-600">
                                                          Digitally Signed
                                                      </span>
                                                  )
                                              ) : (
                                                  <span className="text-xs font-light italic">
                                                      {entry.timeIn
                                                          ? 'Present, No Sig.'
                                                          : 'Absent'}
                                                  </span>
                                              )}
                                          </td>
                                      )}
                                      {showRemarks ? (
                                          <td className="px-1 py-1 text-xs font-medium whitespace-normal break-words overflow-wrap">
                                              {entry.remarks &&
                                                  entry.remarks
                                                      .split('\n')
                                                      .map((line, index) => (
                                                          <span key={index}>
                                                              {line}
                                                              <br />
                                                          </span>
                                                      ))}
                                          </td>
                                      ) : (
                                          ''
                                      )}
                                  </tr>
                              ))
                            : ''}
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

                {!isLoading && currentDataToDisplay.length < 1 && (
                    <div className="flex flex-col items-center justify-center h-96 bg-white p-5 w-[80%] mt-4 rounded-lg">
                        <p className="mt-2 text-sm">No members to Show.</p>
                    </div>
                )}
            </div>

            <table
                id="table-container-csv"
                className="hidden w-[80%] divide-gray-200 dark:divide-gray-700"
            >
                {' '}
                {/* Shirking the table makes it appear larger when printing */}
                <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th
                            scope="col"
                            className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                            {' '}
                        </th>
                        {showOrg ? (
                            <th
                                scope="col"
                                className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                            >
                                Organization
                            </th>
                        ) : null}
                        <th
                            scope="col"
                            className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                            Name
                        </th>
                        <th
                            scope="col"
                            className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                            Year
                        </th>
                        {showEmail ? (
                            <th
                                scope="col"
                                className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                            >
                                Email
                            </th>
                        ) : (
                            ''
                        )}
                        {showCourse ? (
                            <th
                                scope="col"
                                className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                            >
                                Course
                            </th>
                        ) : (
                            ''
                        )}
                        {showRegular ? (
                            <th
                                scope="col"
                                className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                            >
                                Regular
                            </th>
                        ) : (
                            ''
                        )}
                        {showPaid ? (
                            <th
                                scope="col"
                                className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                            >
                                {config.amount_1_name}
                            </th>
                        ) : (
                            ''
                        )}
                        {showPaid2 ? (
                            <th
                                scope="col"
                                className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                            >
                                {config.amount_2_name}
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
                        {showTimeOut && (
                            <th
                                scope="col"
                                className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                            >
                                Time Out
                            </th>
                        )}
                        {sig ? (
                            <th
                                scope="col"
                                className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                            >
                                Signature
                            </th>
                        ) : (
                            ''
                        )}
                        {showRemarks ? (
                            <th
                                scope="col"
                                className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                            >
                                Remarks
                            </th>
                        ) : (
                            ''
                        )}
                    </tr>
                </thead>
                <tbody className="bg-white  divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                    {!isLoading //change paginatedData to data if you want to export all in CSV
                        ? data.map((entry, idx) => (
                              <tr
                                  key={idx}
                                  className="border-b border-gray-200 dark:border-gray-700 text-sm min-h-20"
                              >
                                  <td className="px-1 py-1 whitespace-normal break-words overflow-wrap">
                                      {idx + 1}
                                  </td>
                                  {showOrg ? (
                                      <td className="px-1 py-1 whitespace-normal break-words overflow-wrap">
                                          {entry.organization}
                                      </td>
                                  ) : null}
                                  <td className="px-1 py-1 whitespace-normal break-words overflow-wrap">
                                      {entry.name}
                                  </td>
                                  <td className="px-1 py-1 whitespace-normal break-words overflow-wrap">
                                      {entry.year}
                                  </td>
                                  {showEmail ? (
                                      <td className="px-1 py-1 whitespace-normal break-words overflow-wrap ">
                                          {entry.email}
                                      </td>
                                  ) : (
                                      ''
                                  )}
                                  {showCourse ? (
                                      <td className="px-1 py-1 whitespace-normal break-words overflow-wrap">
                                          {entry.course}
                                      </td>
                                  ) : (
                                      ''
                                  )}
                                  {showRegular ? (
                                      <td className="px-1 py-1 whitespace-normal break-words overflow-wrap">
                                          {entry.regular ? 'YES' : 'NO'}
                                      </td>
                                  ) : (
                                      ''
                                  )}
                                  {showPaid ? (
                                      <td className="px-1 py-1 whitespace-normal break-words overflow-wrap">
                                          {entry.amount && entry.amount > 0
                                              ? entry.amount
                                              : 0}
                                      </td>
                                  ) : (
                                      ''
                                  )}
                                  {showPaid2 ? (
                                      <td className="px-1 py-1 whitespace-normal break-words overflow-wrap">
                                          {entry.amount_2 && entry.amount_2 > 0
                                              ? entry.amount_2
                                              : 0}
                                      </td>
                                  ) : (
                                      ''
                                  )}
                                  {!truncTime ? (
                                      <td className="px-1 py-1 text-xs font-medium whitespace-normal break-words overflow-wrap">
                                          {entry.timeIn}
                                      </td>
                                  ) : (
                                      <td className="px-1 py-1 text-xs font-medium whitespace-normal break-words overflow-wrap">
                                          {entry.timeIn ? (
                                              <span className="text-green-500">
                                                  YES
                                              </span>
                                          ) : (
                                              <span className="text-red-500">
                                                  NO
                                              </span>
                                          )}
                                      </td>
                                  )}
                                  {showTimeOut &&
                                      (!truncTime ? (
                                          <td className="px-1 py-1 text-xs font-medium whitespace-normal break-words overflow-wrap">
                                              {entry.timeOut}
                                          </td>
                                      ) : (
                                          <td className="px-1 py-1 text-xs font-medium whitespace-normal break-words overflow-wrap">
                                              {entry.timeOut ? (
                                                  <span className="text-green-500">
                                                      YES
                                                  </span>
                                              ) : (
                                                  <span className="text-red-500">
                                                      NO
                                                  </span>
                                              )}
                                          </td>
                                      ))}

                                  {sig === true && (
                                      <td className="px-1 py-1 whitespace-nowrap ">
                                          {entry.signature ? (
                                              showSig ? (
                                                  <img
                                                      onClick={() =>
                                                          handleViewSignature(
                                                              entry.id,
                                                              entry.id_number,
                                                              entry.name
                                                          )
                                                      }
                                                      src={`${filePath}${entry.id}.png`}
                                                      alt="Signature"
                                                      className="h-10 object-fill"
                                                  />
                                              ) : (
                                                  <span className="text-xs font-bold italic text-green-600">
                                                      Digitally Signed
                                                  </span>
                                              )
                                          ) : (
                                              <span className="text-xs font-light italic">
                                                  No Signature
                                              </span>
                                          )}
                                      </td>
                                  )}
                                  {showRemarks ? (
                                      <td className="px-1 py-1 text-xs font-medium whitespace-normal break-words overflow-wrap">
                                          {entry.remarks &&
                                              entry.remarks
                                                  .split('\n')
                                                  .map((line, index) => (
                                                      <span key={index}>
                                                          {line}
                                                          <br />
                                                      </span>
                                                  ))}
                                      </td>
                                  ) : (
                                      ''
                                  )}
                              </tr>
                          ))
                        : ''}
                </tbody>
            </table>
        </div>
    );
};

export default ViewTable;
