import React, { useEffect } from 'react'
import Table from '../components/Table'
import AddModal from '../components/AddModal'
import { useState } from 'react'
import Notification from '../components/Notification'
import axios from 'axios'
import API from '../components/Config'

export const Attendance = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showNotif, setShowNotif] = useState(false);
    const [message, setMessage] = useState('');

    const [data, setData] = useState({
        present: '100',
        absent: '50',
        total: '150'
    })

    const refreshStatus = async () =>{
        const response = await axios.get(`${API}status`)
        if (response.status == 200){
            setData(response.data)
        }
    }

    const hideNotif = () =>{
        setShowNotif(false);
        console.log("closed notif")
    }
    const hideAddModal = () =>{
        setShowAddModal(false);
    }

    useEffect(() => {
        refreshStatus(); // Initial call
        const interval = setInterval(() => {
            refreshStatus(); // Refresh every 3 seconds
        }, 3000);

        return () => clearInterval(interval); // Cleanup
    }, []);

  return (
    <div>
        <div className='flex flex-col items-center'>
           
           {showNotif && <Notification hideNotif={hideNotif} message={message}/>}
            <div><h1 class="mb-4 text-3xl font-extrabold text-white md:text-5xl lg:text-6xl"><span class="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">USC CISCO</span> Attendance System</h1></div>
            <div><p class="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">USC Fun Run 2024</p></div>
            {showAddModal? 
            <div className=' fixed top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.8)] grid place-content-center z-50 transition duration-100 overflow-auto'>
                <div className='w-[60%] '>
                <AddModal className='' hide={hideAddModal}/> 
                </div>
            </div>
        
        : ''};
            <div className='mt-10 w-[91vw] grid place-content-center border border-solid border-black z-10 overflow-auto'>
                <div>
                    <p className='text-white'>Present: {data.present}</p>
                    <p className='text-white'>Absent: {data.absent}</p>
                    <p className='text-white'>Total: {data.total}</p>
                </div>
                <Table setShowAddModal={setShowAddModal} showAddModal={showAddModal} showNotif={setShowNotif} setMessage={setMessage} className=''/>
        
            </div>


        </div>
    </div>
  )
}
