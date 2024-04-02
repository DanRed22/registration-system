import React, { useState } from 'react'
import axios from 'axios'
import { FaWindowClose } from "react-icons/fa";
import API from '../components/Config'

const AddModal = ({hide}) => {
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [id, setId]= useState('');
const [bibnum, setBibnum] = useState('');
const [shirt, setShirt]  = useState('');
const [stub, setStub] = useState('');
const [remarks, setRemarks] = useState('');

const handleNameChange = (e) =>{
    setName(e.target.value);
}

const handleEmailChange = (e)=>{
    setEmail(e.target.value);
}

const handleIdChange = (e) =>{
    setId(e.target.value)
}

const handleBibnumChange = (e) =>{
    setBibnum(e.target.value)
}

const handleStubChange = (e) =>{
    setStub(e.target.value)
}

const handleShirtChange = (e) =>{
    setShirt(e.target.value)
}
const handleIRemarksChange = (e) =>{
    setRemarks(e.target.value)
}

const handleSubmit = async ()=>{
    const response = await axios.post(`${API}add`, {
        "name": name,
        "email": email,
        "id_number": id,
        "number": bibnum,
        "stub_number": stub,
        "shirt_size": shirt,
        "remarks": remarks
    })
    if (response){
        alert(response.data.message);
    }
    setName('')
    setEmail('')
    setId('')
    setBibnum('')
    setShirt('')
    setRemarks('')
    setStub('')
    hide()
}


  return (
    <div className='transition duration-100 w-[80vw] border border-solid border-white bg-black rounded-lg p-8 overflow-auto'>
        <div className='grid '>
        <button 
            onClick={hide} 
            type="button" 
            class="justify-self-end text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-800 font-medium rounded-lg text-lg px-5 py-2.5 text-center me-2 mb-2"><FaWindowClose /></button>
        </div>
        <div class="grid gap-6 mb-6 md:grid-cols-2">
        <div>
            <label for="name" class="block mb-2 text-sm font-medium  text-white">Name</label>
            <input value={name} onChange={handleNameChange} type="text" id="name" class="bg-gray-50 border border-gray-300  text-sm rounded-lg  block w-full p-2.5  placeholder-gray-400 text-black " placeholder="John Doe " />
        </div>
        <div>
            <label for="email" class="block mb-2 text-sm font-medium  text-white">Email</label>
            <input value={email} onChange={handleEmailChange} type="textarea" id="email" class="bg-gray-50 border border-gray-300  text-sm rounded-lg  block w-full p-2.5  placeholder-gray-400 text-black" placeholder="youremail@example.com" />
        </div>
        <div>
            <label for="id_number" class="block mb-2 text-sm font-medium  text-white">ID Number</label>
            <input value={id} onChange={handleIdChange} type="text" id="id_number" class="bg-gray-50 border border-gray-300  text-sm rounded-lg  block w-full p-2.5  placeholder-gray-400 text-black " placeholder="21100000" />
        </div>
        <div>
            <label for="number" class="block mb-2 text-sm font-medium  text-white">BIB Number</label>
            <input value={bibnum} onChange={handleBibnumChange} type="text" id="number" class="bg-gray-50 border border-gray-300  text-sm rounded-lg  block w-full p-2.5  placeholder-gray-400 text-black " placeholder="1" />
        </div>  
        <div>
            <label for="Shirt Size" class="block mb-2 text-sm font-medium  text-white">Shirt Size</label>
            <input value={shirt} onChange={handleShirtChange} type="text" id="phone" class="bg-gray-50 border border-gray-300  text-sm rounded-lg  block w-full p-2.5  placeholder-gray-400 text-black " placeholder="(S, M, L, XL, XXL)"/>
        </div>
        <div>
            <label for="stub_number" class="block mb-2 text-sm font-medium  text-white">Stub Number</label>
            <input value={stub} onChange={handleStubChange} type="text" id="stub_number" class="bg-gray-50 border border-gray-300  text-sm rounded-lg  block w-full p-2.5  placeholder-gray-400 text-black " placeholder="20" />
        </div>
        <div>
            <label for="remarks" class="block mb-2 text-sm font-medium  text-white">Remarks</label>
            <input value={remarks} onChange={handleIRemarksChange} type="textarea" id="remarks" class="bg-gray-50 border border-gray-300  text-sm rounded-lg  block w-full p-2.5  placeholder-gray-400 text-black" placeholder="Remarks Here" />
        </div>

        <div>
        
        </div>
        <div>
        <button onClick={handleSubmit} type="button" class="w-[20vw] focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Add Attendee</button>
        </div>
        
    </div>
    </div>
  )
}

export default AddModal;
