import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import axios from 'axios';
import API from './Config';
import { FaWindowClose } from 'react-icons/fa';

const SignatureModal = ({ id, idNumber, name, close }) => {
  const sigCanvas = useRef({});

  const clear = () => sigCanvas.current.clear();

  const save = async () => {
    const signature = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
    try {
      await axios.post(`${API}save-signature`, {
        id,
        idNumber,
        signature
      });
      alert('Signature saved successfully!');
    } catch (error) {
      console.error('Error saving signature', error);
      alert('Failed to save signature');
    }
  };

  const handleSave = () =>{
    save()
    close()
    window.location.reload();
  }

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
        <p className='text-sm'>Please affix your signature inside the box:</p>
            <div className='border-2 border-black mt-4 mb-2'>
                <SignatureCanvas
                ref={sigCanvas}
                penColor="black"
                throttle="12"
                canvasProps={{ width: 400, height: 300, className: 'sigCanvas' }}
                />
            </div>
            <div className='text-black mb-4'>{idNumber} - {name}</div>
        <div className=''>
          <button 
            onClick={clear}
            type="button" 
            className="mx-2 cursor-pointer w-28 focus:outline-none text-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
            Clear
          </button>
          <button 
            onClick={handleSave}
            type="button" 
            className="mx-2 cursor-pointer w-28 focus:outline-none text-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-900">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignatureModal;
