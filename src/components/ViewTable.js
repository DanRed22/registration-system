import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { CiSearch } from "react-icons/ci";
import RemarksModal from '../components/RemarksModal';
import API from './Config';
import { FaPencilAlt, FaRegEye } from 'react-icons/fa';
import ClipLoader from "react-spinners/ClipLoader";
import SignatureModal from './SignatureModal';
import ViewOnlyShowSignatureModal from './ViewOnlyShowSignatureModal';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ExportMatTableToCSV from './ExportMatTableToCSV'

const ViewTable = ({ showNotif, setMessage }) => {
    const filePath = "/signatures/";
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    //const [viewedData, setViewedData] = useState ([]);
    const itemsPerPage = 20
    const totalPages = Math.ceil(data.length/itemsPerPage);
    const filename = 'Carsumm'; //change this if necessary
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const [showSig, setShowSig] = useState(true);
    const [sig, setSig] = useState(true);
    const [showProgram, setShowProgram] = useState(true);
    const [showAdditional, setShowAdditional] = useState(false);

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
    
      const paginatedData = data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );

    const exportTableToPDF = () => {
        const input = document.getElementById('table-container');
        const pdf = new jsPDF('p', 'mm', 'letter');
        const margin = 25.4; // 1 inch margin in mm
        const pageWidth = pdf.internal.pageSize.width;
        const pageHeight = pdf.internal.pageSize.height;
        const imgWidth = pageWidth - 2 * margin;
        const imgHeight = (input.scrollHeight * imgWidth) / input.scrollWidth;
        const canvasHeight = pageHeight - 2 * margin;
        const verificationText = `Verified from (Attendance System © USC-SSC 2024) on ${new Date().toLocaleString()}`;

        html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
            
            const imgData = canvas.toDataURL('image/jpeg', 0.95); // Adjust quality here
    
            let heightLeft = imgHeight;
            let position = 0;
    
            //Function to add image and text to each page
            const addPageContent = (isFirstPage) => {
                if (!isFirstPage) pdf.addPage();
                pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
                pdf.setFontSize(8);
                pdf.text(
                    verificationText,
                    margin,
                    pageHeight - margin / 2 // Position text at the bottom margin
                );
            };
    
            // Add the first page
            addPageContent(true);
            heightLeft -= canvasHeight;
    
            // Add new pages as necessary
            while (heightLeft > 0) {
                position -= canvasHeight;
                addPageContent(false);
                heightLeft -= canvasHeight;
            }
    
            pdf.save(`${currentPage}-${totalPages} ${filename}.pdf`);
        }).catch((err) => console.error(err));
    };

    

    const handleClickShowSig = () =>{
        setShowSig(!showSig)
    }

    const handleClickSig = () =>{
        setSig(!sig)
    }

    const handleClickProgram = () =>{
        setShowProgram(!showProgram)
    }

    const handleClickAdditional = () =>{
        setShowAdditional(!showAdditional)
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
        try {
            const tableId = '#table-container';
            ExportMatTableToCSV(tableId, filename);
        } catch (err) {
            console.error(err);
        }
    };


    return (
        <div className='w-[90vw]'>
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
                        onClick={handleExportCSV}
                        type="button" className="mt-2 ml-4 p-2.5 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                        Export to CSV
                    </button>
                    

                </div>
            </div>
                        <div  className='flex flex-row items-center my-4 border-white border-solid border-2 rounded-lg p-4 text-white'>
                            <p className='mx-2 '>Columns to Show:</p>
                        {sig && (<>
                        <input type='checkbox' name='show-sig' checked={showSig} onClick={handleClickShowSig}></input>
                        <label for='show-sig' className='text-white mr-4'> Show Signatures</label></>)
                        }

                        <input type='checkbox' name='show-prog' checked={showProgram} onClick={handleClickProgram}></input>
                        <label for='show-prog' className='text-white mr-4'> Programs</label>

                        <input type='checkbox' name='show-add' checked={showAdditional} onClick={handleClickAdditional}></input>
                        <label for='show-add' className='text-white mr-4'> Additional</label>

                        <input type='checkbox' name='sig' checked={sig} onClick={handleClickSig}></input>
                        <label for='sig' className='text-white mr-4'>Signatures</label>
                        
                        </div>
            <div className="overflow-x-auto overflow-y-auto shadow-md">
            <p className='text-white'>{currentPage} / {totalPages}</p>
            <button type="button" onClick={prevPage} class="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900">Prev</button>
            <button type="button" onClick={nextPage} class="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900">Next</button>
                <table id='table-container' className="w-[50rem] divide-gray-200 dark:divide-gray-700"> {/* Shirking the table makes it appear larger when printing */}
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th scope="col" className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"> </th>
                            <th scope="col" className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID Number</th>
                            {showProgram? <th scope="col" className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Program</th> :''}
                            {showAdditional? <th scope="col" className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Additional</th>:''}
                            <th scope="col" className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time In</th>
                            <th scope="col" className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time Out</th>
                            <th scope="col" className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Claimed</th>
                            {sig? <th scope="col" className="px-1 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Signature</th> :''}
                        </tr>
                    </thead>
                    <tbody className="bg-white  divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                        {!isLoading ? ( //change paginatedData to data if you want to export all in CSV
                            paginatedData.map((entry) => (
                                    <tr key={entry.id} className="border-b border-gray-200 dark:border-gray-700 text-sm">
                                    <td className="px-1 py-1 whitespace-normal break-words overflow-wrap">{entry.id}</td>
                                    <td className="px-1 py-1 whitespace-normal break-words overflow-wrap">{entry.name}</td>
                                    <td className="px-1 py-1 whitespace-normal break-words overflow-wrap">{entry.id_number}</td>
                                    {showProgram? <td className="px-1 py-1 whitespace-normal break-words overflow-wrap">{entry.program}</td> : ''}
                                    {showAdditional? <td className="px-1 py-1 whitespace-normal break-words overflow-wrap">{entry.additional}</td>:''}
                                    <td className="px-1 py-1 whitespace-normal break-words overflow-wrap">{entry.timeIn}</td>
                                    <td className="px-1 py-1 whitespace-normal break-words overflow-wrap">{entry.timeOut}</td>
                                    <td className="px-1 py-1 whitespace-normal break-words overflow-wrap">{entry.claimed == 1 ? 'YES' : 'NO'}</td>
                                    
                                        {
                                        sig === true && (
                                            <td className="px-1 py-1 whitespace-nowrap items-center flex justify-center">
                                            {entry.signature ? (
                                                showSig ? (
                                                <img
                                                    src={`${filePath}${entry.id_number}.png`}
                                                    alt="Signature"
                                                    className="w-20 h-10 object-fill"
                                                />
                                                ) : (
                                                <span className='text-xs italic'>Digitally Signed</span>
                                                )
                                            ) : (
                                                <span className='text-xs italic'>No Signature</span>
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
