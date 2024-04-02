import React from 'react'
import { FaWindowClose } from "react-icons/fa";
import { useState } from 'react';
import axios from 'axios';
import API from './Config'

const RemarksModal = ({hideModal, id, name, remark, refresh}) =>{
    const [textremark, setTextRemark] = useState(remark)
    const handleChange = (e)=>{
        setTextRemark(e.target.value)
    }

    const updateRemarks = async () =>{
        
        const response = await axios.post(`${API}update-remarks`,{
            "id": id,
            "remarks": textremark
            
        })
        console.log(response)
            refresh();
            hideModal();
    }

    return(
    <div className='fixed top-0 left-0 z-50 w-full h-[100vh] bg-[rgba(0,0,0,0.8)]'>
        <div className='flex w-[100%] h-[100%] justify-center items-center'>
            <div className='bg-slate-800 w-[60%] h-[70%] rounded-lg'>
                <div className='grid grid-cols-2 mt-4 mr-4 '>
                    <p className='text-white text-lg justify-self-start mx-4'>{id} - {name}</p>
                <button onClick={hideModal} type="button" class="justify-self-end text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-800 font-medium rounded-lg text-lg px-5 py-2.5 text-center me-2 mb-2"><FaWindowClose /></button>
                </div>
                
                <span>
                    <label for="remarks" class="block mb-2 text-sm font-medium text-white">Your Remark</label>
                    <textarea id="remarks" value={textremark} onChange={handleChange} rows="4" class=" w-[80%] h-[60%] p-2.5 text-sm text-black bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 " placeholder="Write your remarks here..."></textarea>\
                    
                </span>
                    <div>
                        <button onClick={updateRemarks} type="button" class="mt-8 text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Submit</button>
                    </div>
            </div>
                
        </div>
    </div>
)}

export default RemarksModal;