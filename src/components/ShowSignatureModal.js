import React, {useState} from 'react';
import { FaWindowClose } from 'react-icons/fa';
import API from './Config';
import axios from 'axios';
const ShowSignatureModal = ({ id, idNumber, name, close }) => {
  const imagePath = `/signatures/${idNumber}.png`;
  const [imageError, setImageError] = useState(false)
  
  const handleClear = (id) =>{
    try {
      const response = axios.post(`${API}clear-signature`,{
        id: id,
        idNumber: idNumber
      }).then(()=>{
        console.log(response);
        alert('Successfully Cleared Signature');
        window.location.reload();
      })
    }catch(error){
      alert(error)
    }
  }
  console.log(imagePath)
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center'>
      <div className='w-[50rem] rounded-xl flex justify-center items-center bg-white flex-col'>
        
        <div className='flex justify-end w-full px-10'>
            <button 
                onClick={close}
                type="button" 
                className="mx-2 mt-4 cursor-pointer focus:outline-none text-white font-medium rounded-lg text-sm px-4 py-2.5 me-2 mb-2 bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-900">
                <FaWindowClose />
            </button>
        </div>

        {!imageError ? (
          <img
            className='border-2 border-black border-solid mt-4 w-[30rem]'
            src={imagePath}
            alt="Signature"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className='mt-4 text-red-500'>No Signature</div>
        )}


        <div className='text-black mb-4 mt-2'>{idNumber} - {name}</div>
        
        <button 
                onClick={()=>handleClear(id)}
                type="button" 
                className="mx-2 mt-4 cursor-pointer focus:outline-none text-white font-medium rounded-lg text-sm px-4 py-2.5 me-2 mb-2 bg-red-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-900">
                Clear
            </button>
      </div>
    </div>
  );
};

export default ShowSignatureModal;
