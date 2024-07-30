import React from 'react'

const Notification = ({hideNotif, message}) => {
  return (
    <div>
       <div className='top-4 left-5 fixed rounded-lg z-50 w-80 h-30 bg-[#113c96] p-2 border border-solid border-white items-center'>
            <div className='flex flex-row items-center justify-center'>
                <div className='w-2/3'><p className='w-full text-white text-xs'>{message}</p></div>
                <div className='w-1/3 flex justify-end'><button onClick={hideNotif} type="button" class="w-12 text-xs text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg p-2 text-center">Close</button></div>
                
            </div>
       </div>
        
    </div>
  )
}

export default Notification