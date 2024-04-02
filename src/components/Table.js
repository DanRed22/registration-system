import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { CiSearch } from "react-icons/ci";
import RemarksModal from '../components/RemarksModal'
import API from './Config'


const Table = ({showAddModal, setShowAddModal, showNotif, setMessage}) => {

    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([])
    const [showRemarksModal, setShowRemarksModal] = useState(false);
    const [remarkID, setRemarkID] = useState('')
    const [remark, setRemark] = useState('')
    const [remarkName, setRemarkName] = useState('')
    const hideRemarksModal = () =>{
        setShowRemarksModal(false)
    }

    const handleShowRemarks = (id, name, remark) =>{
        setShowRemarksModal(true);
        setRemarkID(id)
        setRemarkName(name)
        setRemark(remark)
    }
    const handleSearchChange =(e) =>{
        setSearch(e.target.value)
    }


    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    }

    const handleSearch = async ()  =>{
     if (search && search != ''){
        const data = await axios.get(`${API}search`, {
            params:{
                searchTerm: search
            }
        })
        setData(data.data);
        console.log(data)
    }
    }


    const handleClaim = async (id) =>{
        console.log(id)
        if(id){
            const data = await axios.post(`${API}claim`, {
                "id": id
            });
            // alert('Claimed')
            handleSearch();
        }else{
            showNotif(true);
            setMessage("Please input id to Claim");
        }
    }

    
    const handleUnclaim = async (id) =>{
        console.log(id)
        if(id){
            const data = await axios.post(`${API}unclaim`, {
                "id": id
            });
            // alert('Unclaimed');
            handleSearch();
        }else{
            showNotif(true);
            setMessage("Please input id to Unclaim");
        }
    }

    const handleTimeIn = async (id) =>{
        if(id){
            const data = await axios.post(`${API}update-timein`, {
                "id": id
            });
            // alert('Unclaimed');
            handleSearch();
        }else{
            showNotif(true);
            setMessage("Failed to Update Time");
        }
    }
    const handleTimeOut = async (id) =>{
        if(id){
            const data = await axios.post(`${API}update-timeout`, {
                "id": id
            });
            // alert('Unclaimed');
            handleSearch();
        }else{
            showNotif(true);
            setMessage("Failed to Update Time");
        }
    }
    const handleResetTimeIn = async (id) =>{
        if(id){
            const data = await axios.post(`${API}reset-timein`, {
                "id": id
            });
            // alert('Unclaimed');
            handleSearch();
        }else{
            showNotif(true);
            setMessage("Failed to Update Time");
        }
    }
    const handleResetTimeOut = async (id) =>{
        if(id){
            const data = await axios.post(`${API}reset-timeout`, {
                "id": id
            });
            // alert('Unclaimed');
            handleSearch();
        }else{
            showNotif(true);
            setMessage("Failed to Update Time");
        }
    }
  return (
    <div className='w-[90vw]'>
         {showRemarksModal && <RemarksModal hideModal={hideRemarksModal} id={remarkID} name={remarkName} remark={remark} refresh={handleSearch}/>}
        <div className='flex justify-items-end border border-white rounded-lg border-solid w-full my-4'>

        <div class="m-2 flex justify-items-center items-center">
                <button 
                    onClick={ ()=>{
                                    setShowAddModal(!showAddModal);
                                }
                            }
                    type="button" 
                    class="text-white block mt-2 bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"> Add Attendee</button>
            </div>


            <div class="m-2 flex justify-items-center items-center">
                <label for="search-input" class="block ml-4 text-sm font-medium text-white">Search </label><CiSearch className=' text-white mx-2'/>
                <input 
                    type="text" 
                    id="search-input" 
                    class=" w-72 border text-sm rounded-lg  block p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                    onChange={handleSearchChange}
                    onKeyPress={handleKeyPress}
                    value={search}
                    />
                    <button
                        onClick={handleSearch}
                    type="button" class="mt-2 ml-4 p-2.5 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Search</button>
            </div>

            
    

        </div>
    <div class="relative overflow-x-auto overflow-y-auto shadow-md sm:rounded-lg">
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID Number</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Number</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Shirt Size</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Stub Number</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time In</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time Out</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Claimed</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Remarks</th>

                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                {data.map((entry) => (
                    <tr key={entry.id} className="border-b border-gray-200 dark:border-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">{entry.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{entry.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{entry.id_number}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{entry.number}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{entry.shirt_size}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{entry.stub_number}</td>
                        {entry.timeIn? 
                            <td className="px-6 py-4 whitespace-nowrap">
                                <button 
                                    onClick={()=>handleResetTimeIn(entry.id)}
                                    type="button" 
                                    class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">{entry.timeIn}</button>
                            </td> : 
                            <td className="px-6 py-4 whitespace-nowrap">
                                <button 
                                    type="button" 
                                    onClick={()=>handleTimeIn(entry.id)}
                                    class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Time In</button>
                            </td>}
                        
                        {entry.timeOut? 
                            <td className="px-6 py-4 whitespace-nowrap"><button 
                                    onClick={()=>handleResetTimeOut(entry.id)}    
                                    type="button" 
                                    class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">{entry.timeOut}</button></td>:
                            <td className="px-6 py-4 whitespace-nowrap">
                                <button 
                                    onClick={()=>handleTimeOut(entry.id)}
                                    type="button" 
                                    class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Time Out</button>
                            </td>
                        }
                        <td className="px-6 py-4 whitespace-nowrap">
                            {
                                entry.claimed == 1? 
                                <button 
                                onClick={()=>{handleUnclaim(entry.id)}}
                                type="button" 
                                class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Claimed</button>
                        :
                        <button 
                                onClick={()=>{handleClaim(entry.id)}}
                                type="button" 
                                class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Not Claimed</button>
                    
                        
                            }
                       </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                            onClick={() => handleShowRemarks(entry.id, entry.name, entry.remarks)}
                            type="button" 
                            class="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Add</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    </div>
  )
}

export default Table;