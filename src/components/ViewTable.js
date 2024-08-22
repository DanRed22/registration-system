import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { CiSearch } from "react-icons/ci";
import RemarksModal from '../components/RemarksModal';
import API from './Config';
import { FaPencilAlt, FaRegEye } from 'react-icons/fa';
import ClipLoader from "react-spinners/ClipLoader";
import ViewOnlyShowSignatureModal from './ViewOnlyShowSignatureModal';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ExportMatTableToCSV from './ExportMatTableToCSV'
import config from '../configuration';
import ConfirmationResetModal from './ConfirmationResetModal';

const ViewTable = ({ showNotif, setMessage }) => {
    const filePath = "/signatures/";
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const itemsPerPage = 16     // adjust this if necessary
    const totalPages = Math.ceil(data.length/itemsPerPage);
    const fileNameExport = config.eventName; //change this if necessary
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const [showSig, setShowSig] = useState(true);
    const [sig, setSig] = useState(true);
    const [showCourse, setShowCourse] = useState(true);
    const [showRegular, setShowRegular] = useState(false);
    const [showSignatureModal, setShowSignatureModal] = useState(false);
    const [selectedID, setSelectedID] = useState(0);
    const [showEmail, setShowEmail] = useState(true);
    const [selectedName, setSelectedName] = useState('');
    const [selectedIDNumber, setSelectedIDNumber] = useState('');
    const [isExporting, setIsExporting] = useState(false);
    const [truncTime, setTruncTime] = useState(true);
    const [showReset, setShowReset] = useState(false);
    const [showCoursesDropDown, setShowCoursesDropdown] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState("");
    var paginatedData = data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )


    const nextPage = () => {
        if (currentPage < totalPages){
        setCurrentPage(currentPage+1);
        }
      };

    const prevPage = ()=>{
        if(currentPage > 1){
            setCurrentPage(currentPage-1);
        }
    }

    const handleViewSignature = (id, idNumber, name) =>{
        setSelectedID(id);
        setSelectedIDNumber(idNumber);
        setSelectedName(name);
        toggleViewSignatureModal();
    }

    const handleTruncTime = () =>{
        setTruncTime(!truncTime)
    }

    const handleShowEmail = ()=>{
        setShowEmail(!showEmail)
    }

    const toggleViewSignatureModal = () =>{
        setShowSignatureModal(!showSignatureModal);
    }
      const exportTableToPDF = async () => {
        setIsExporting(true)
        const input = document.getElementById('table-container');
        const pdf = new jsPDF('p', 'mm', 'letter');
        const margin = 12; //12mm
        const pageWidth = pdf.internal.pageSize.width;
        const pageHeight = pdf.internal.pageSize.height;
        const imgWidth = pageWidth - 2 * margin;
        const verificationText = `Verified from (Attendance System © CACI SSC 2024) on ${new Date().toLocaleString()}`;
    
        // Set the initial page to 1
        let currentPage = 1;
    
        // Function to capture and add a single page
        const addPageToPDF = async (pageNumber) => {
            setCurrentPage(pageNumber); // Make sure to define this function as per your logic to set the page view
            const canvas = await html2canvas(input, { scale: 2, useCORS: true });
            const imageData = canvas.toDataURL('image/jpeg', 0.95);
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
            // If it's not the first page, add a new page to the PDF
            if (pageNumber > 1) {
                pdf.addPage();
            }
    
            pdf.addImage(imageData, 'JPEG', margin, margin, imgWidth, imgHeight);
            pdf.setFontSize(8);
            pdf.text(
                verificationText,
                margin,
                pageHeight - margin / 2 // Position text at the bottom margin
            );
        };
    
        // Iterate over all pages and add them to the PDF
        for (let x = 1; x <= totalPages; x++) {
            await addPageToPDF(x);
        }
        setCurrentPage(1)
    
        // Save the PDF
        pdf.save(`${fileNameExport}.pdf`);
        setIsExporting(false)
    };

    

    const handleClickShowSig = () =>{
        setShowSig(!showSig)
    }

    const handleClickSig = () =>{
        setSig(!sig)
    }

    const handleClickProgram = () =>{
        setShowCourse(!showCourse)
    }

    const handleClickAdditional = () =>{
        setShowRegular(!showRegular)
    }


    const goHome = () => {
        navigate('/');
    };


    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    }

    const getAll = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API}all`);
           setData(response.data.results);
        } catch (error) {
            console.error("Error fetching data: ", error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    }

    const handleSearch = async () => {
        if (search && search !== '') {
            setIsLoading(true);
            try {
                const response = await axios.get(`${API}search`, {
                    params: {
                        searchTerm: search
                    }
                });
                setData(response.data);
            } catch (error) {
                console.error("Error searching data: ", error);
            } finally {
                setIsLoading(false);
            }
        }
    }

    const handleExportCSV = () => {
        setIsExporting(false)
        try {
            const tableId = '#table-container';
            ExportMatTableToCSV(tableId, fileNameExport);
        } catch (err) {
            console.error(err);
        }
        finally{
            setIsExporting(false)
        }
    };

    const handleShowReset = () =>{
        setShowReset(!showReset);
    }

    const handleCourseChange = (name)=>{
        setSelectedCourse(name);
        setShowCoursesDropdown(false)
    }

    


    return (
        <div className='w-[90%]'>
            {showReset && <ConfirmationResetModal close={handleShowReset} />}
            {showSignatureModal && <ViewOnlyShowSignatureModal id={selectedID} name={selectedName} idNumber={selectedIDNumber} close={toggleViewSignatureModal}/>}
            <div className='flex justify-items-end border border-white rounded-lg border-solid w-full my-2'>
                <div className="m-2 flex justify-items-center items-center">
                    <label htmlFor="search-input" className="block ml-4 text-sm font-medium text-white">Search </label><CiSearch className=' text-white mx-2' />
                    <input
                        type="text"
                        id="search-input"
                        className="w-72 border text-sm rounded-lg block p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                        onChange={handleSearchChange}
                        onKeyPress={handleKeyPress}
                        value={search}
                    />
                    <button
                        onClick={handleSearch}
                        type="button" className="mt-2 ml-4 p-2.5 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Search</button>
                    <button
                        onClick={getAll}
                        type="button" className="mt-2 ml-4 p-2.5 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Display All</button>
                    <button
                        onClick={goHome}
                        type="button" className="mt-2 ml-4 p-2.5 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Go Home</button>

                    <button
                        onClick={exportTableToPDF}
                        type="button" className="mt-2 ml-4 p-2.5 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                        Export to PDF
                    </button>

                    <button
                        onClick={()=>setShowReset(true)}
                        type="button" className="mt-2 ml-4 p-2.5 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                        Reset
                    </button>

                    <button
                        onClick={handleExportCSV}
                        type="button" className="mt-2 ml-4 p-2.5 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                        Export to CSV
                    </button>
                    {isExporting? <ClipLoader size={'2rem'} color='white'/>: ''}
                    

                </div>
            </div>
                        <div  className='flex flex-row items-center my-4 border-white border-solid border-2 rounded-lg p-4 text-white'>
                            <p className='mx-2 '>Columns to Show:</p>
                        {sig && (<>
                        <input type='checkbox' name='show-sig' checked={showSig} onClick={handleClickShowSig}></input>
                        <label for='show-sig' className='text-white mr-4'> Show Signatures <span className='text-[0.75rem] italic'>{`(Uncheck this for CSV)`}</span></label></>)
                        }

                        <input type='checkbox' name='show-prog' checked={showCourse} onClick={handleClickProgram}></input>
                        <label for='show-prog' className='text-white mr-4'> Course</label>

                        <input type='checkbox' name='show-add' checked={showRegular} onClick={handleClickAdditional}></input>
                        <label for='show-add' className='text-white mr-4'> Regular</label>

                        <input type='checkbox' name='sig' checked={sig} onClick={handleClickSig}></input>
                        <label for='sig' className='text-white mr-4'>Signatures</label>

                        <input type='checkbox' name='email' checked={showEmail} onClick={handleShowEmail}></input>
                        <label for='email' className='text-white mr-4'>Emails</label>
                        
                        <input type='checkbox' name='truncTime' checked={truncTime} onClick={handleTruncTime}></input>
                        <label for='truncTime' className='text-white mr-4'>Truncate Time</label>

                        <div>
                        <button onClick={()=>setShowCoursesDropdown(!showCoursesDropDown)}class=" h-10 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">{selectedCourse? selectedCourse : "Select Course"}<svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                        </svg>
                        </button>
                        {showCoursesDropDown && <div class="z-0 absolute bg-white rounded-lg shadow w-44 dark:bg-gray-700">
                    <button onClick={()=>handleCourseChange(null)} className='text-black h-10 border rounded-lg w-full hover:bg-blue-200'>Select Course</button>
                    <button name="AMT" onClick={()=>handleCourseChange("AMT")} className='text-black border h-10 rounded-lg w-full hover:bg-blue-200'>AMT</button>
                    <button name="AE" onClick={()=>handleCourseChange("AE")} className='text-black border h-10 rounded-lg w-full hover:bg-blue-200'>AE</button>
                    <button name="AMGT" onClick={()=>handleCourseChange("AMGT")} className='text-black border h-10 rounded-lg w-full hover:bg-blue-200'>AMGT</button>
                </div>}
                </div>

                        
                        </div>
            <div className="overflow-x-auto overflow-y-auto shadow-md">
            <p className='text-white'>{currentPage} / {totalPages}</p>
            <button type="button" onClick={prevPage} class="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900">Prev</button>
            <button type="button" onClick={nextPage} class="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900">Next</button>
                <table id='table-container' className="w-[50rem] divide-gray-200 dark:divide-gray-700"> {/* Shirking the table makes it appear larger when printing */}
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th scope="col" className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"> </th>
                            <th scope="col" className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Organization</th>
                            <th scope="col" className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Year</th>
                            {showEmail? <th scope="col" className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>:''}
                            {showCourse? <th scope="col" className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Course</th> :''}
                            {showRegular? <th scope="col" className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Regular</th>:''}
                            <th scope="col" className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time In</th>
                            <th scope="col" className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time Out</th>
                            {sig? <th scope="col" className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Signature</th> :''}
                        </tr>
                    </thead>
                    <tbody className="bg-white  divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                        {!isLoading ? ( //change paginatedData to data if you want to export all in CSV
                            paginatedData.map((entry) => (
                                    <tr key={entry.id} className="border-b border-gray-200 dark:border-gray-700 text-sm">
                                    <td className="px-1 py-1 whitespace-normal break-words overflow-wrap">{entry.id}</td>
                                    <td className="px-1 py-1 whitespace-normal break-words overflow-wrap">{entry.organization}</td>
                                    <td className="flex flex-col items_center justify-center px-1 py-1 whitespace-normal break-words overflow-wrap">
                                        <div>{entry.name}</div>
                                        <div>{entry.orgname? `${entry.orgname} - ${entry.position}`: ''}</div>

                                    </td>
                                    <td className="px-1 py-1 whitespace-normal break-words overflow-wrap">{entry.year}</td>
                                    {showEmail? <td className="px-1 py-1 whitespace-normal break-words overflow-wrap align-text-top">{entry.email}</td>:''}
                                    {showCourse? <td className="px-1 py-1 whitespace-normal break-words overflow-wrap">{entry.course}</td> : ''}
                                    {showRegular? <td className="px-1 py-1 whitespace-normal break-words overflow-wrap">{entry.regular? "✅": "❌"}</td>:''}
                                    {!truncTime? 
                                        <td className="px-1 py-1 text-xs font-medium whitespace-normal break-words overflow-wrap">{entry.timeIn}</td>:
                                        <td className="px-1 py-1 text-xs font-medium whitespace-normal break-words overflow-wrap">{entry.timeIn? <span className='text-green-500'>YES</span> : <span className='text-red-500'>NO</span> }</td>}
                                    {!truncTime?
                                        <td className="px-1 py-1 text-xs font-medium whitespace-normal break-words overflow-wrap">{entry.timeOut}</td>:
                                        <td className="px-1 py-1 text-xs font-medium whitespace-normal break-words overflow-wrap">{entry.timeOut? <span className='text-green-500'>YES</span> : <span className='text-red-500'>NO</span> }</td>
                                    }
                                    
                                    
                                        {
                                        sig === true && (
                                            <td className="px-1 py-1 whitespace-nowrap items-center flex justify-center">
                                            {entry.signature ? (
                                                showSig ? (
                                          
                                                    <img
                                                        onClick={()=>handleViewSignature(entry.id, entry.id_number, entry.name)}
                                                        src={`${filePath}${entry.id}.png`}
                                                        alt="Signature"
                                                        className="h-10 object-fill"
                                                    />
                                             
                                                ) : (
                                                <span className='text-xs font-bold italic text-green-600'>Digitally Signed</span>
                                                )
                                            ) : (
                                                <span className='text-xs font-light italic'>No Signature</span>
                                            )}
                                            </td>
                                            
                                            
                                        )
                                        }
                                    </tr>
                            ))):''}
                    </tbody>
                </table>
                {isLoading && (
                    <div className='flex flex-col items-center h-96 bg-white p-5'>
                        <ClipLoader />
                        <p className='mt-2 text-sm'>Currently Processing. If this notification persists for 5 seconds.</p>
                        <p className=' text-sm'>Possible Problems: Failed to Connect to Server or Internet is Slow</p>
                        <p className='mt-2 text-sm italic'>Possible Solution: Refresh your Browser or Restart your Device.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ViewTable;
