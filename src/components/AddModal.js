import React, { useState } from 'react'
import axios from 'axios'
import { FaWindowClose } from "react-icons/fa";
import API from '../components/Config'

const AddModal = ({hide}) => {
const [name, setName] = useState('');
const [id, setId]= useState('');
const [additional, setAdditional] = useState('');
const [remarks, setRemarks] = useState('');
const [program, setProgram] = useState('');

const handleNameChange = (e) =>{
    setName(e.target.value);
}


const handleIdChange = (e) =>{
    setId(e.target.value)
}


const handleAdditionalChange = (e) =>{
    setAdditional(e.target.value)
}


const handleIRemarksChange = (e) =>{
    setRemarks(e.target.value)
}

const handleProgramChange = (e) =>{
    setProgram(e.target.value)
}
const handleSubmit = async ()=>{
    const response = await axios.post(`${API}add`, {
        "name": name,
        "id_number": id,
        "program": program,
        "additional": additional,
        "remarks": remarks
    })
    if (response){
        alert(response.data.message);
    }
    setName('')
    setId('')
    setAdditional('')
    setRemarks('')
    setProgram('')
    hide()
}


  return (
    <div className='w-[50rem] shadow-2xl bg-red-950 rounded-lg p-8 overflow-auto'>
        <div className='grid '>
        <button 
            onClick={hide} 
            type="button" 
            className="flex transition duration-200 ease-in-out w-10 justify-self-end text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-800 font-medium rounded-lg text-lg items-center justify-center py-2.5 text-center"><FaWindowClose /></button>
        </div>
        <div class="grid gap-6 mb-6 md:grid-cols-2">
        <div>
            <label for="name" class="block mb-2 text-sm font-medium  text-white">Name</label>
            <input value={name} onChange={handleNameChange} type="text" id="name" class="bg-gray-50 border border-gray-300  text-sm rounded-lg  block w-full p-2.5  placeholder-gray-400 text-black " placeholder="John Doe " />
        </div>
        <div>
            <label for="id_number" class="block mb-2 text-sm font-medium  text-white">ID Number</label>
            <input value={id} onChange={handleIdChange} type="text" id="id_number" class="bg-gray-50 border border-gray-300  text-sm rounded-lg  block w-full p-2.5  placeholder-gray-400 text-black " placeholder="21100000" />
        </div>
        <div>
            <label for="program" class="block mb-2 text-sm font-medium  text-white">Program</label>
            <input value={program} onChange={handleProgramChange} type="textarea" id="program" class="bg-gray-50 border border-gray-300  text-sm rounded-lg  block w-full p-2.5  placeholder-gray-400 text-black" placeholder="Remarks Here" />
        </div>
        <div>
            <label for="additional" class="block mb-2 text-sm font-medium  text-white">Additional Info</label>
            <input value={additional} onChange={handleAdditionalChange} type="text" id="number" class="bg-gray-50 border border-gray-300  text-sm rounded-lg  block w-full p-2.5  placeholder-gray-400 text-black " placeholder="1" />
        </div>  
        <div>
            <label for="remarks" class="block mb-2 text-sm font-medium  text-white">Remarks</label>
            <input value={remarks} onChange={handleIRemarksChange} type="textarea" id="remarks" class="bg-gray-50 border border-gray-300  text-sm rounded-lg  block w-full p-2.5  placeholder-gray-400 text-black" placeholder="Remarks Here" />
        </div>

        <div>
        
        </div>
        
    </div>
    <button onClick={handleSubmit} type="button" class="w-[12rem] transition duration-200 focus:outline-none text-black hover:text-white bg-green-400 hover:bg-green-500 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Add Attendee</button>
    </div>
  )
}

export default AddModal;
