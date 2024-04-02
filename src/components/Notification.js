import React from 'react'

const Notification = ({hideNotif, message}) => {
  return (
    <div>
       <div className=' fixed  top-4 left-4 rounded-lg z-50 w-[30vw] h-[10vh] bg-[#113c96] p-8 border border-solid border-white '>
            <div className='grid grid-cols-2'>
                <p className='text-white text-lg'>{message}</p>
                <button onClick={hideNotif} type="button" class="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Close</button>
            </div>
       </div>
        
    </div>
  )
}

export default Notification