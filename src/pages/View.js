import React, {useState} from 'react'
import ViewTable from '../components/ViewTable'
import Notification from '../components/Notification';
export default function View() {
  const [showNotif, setShowNotif] = useState(false);
  const [message, setMessage] = useState('');
  
  const hideNotif = () =>{
    setShowNotif(false);
    //console.log("closed notif")
}
  return (
    <div className='flex items-center justify-center '>
      {showNotif && <Notification hideNotif={hideNotif} message={message}/>}
      <ViewTable showNotif={setShowNotif} setMessage={setMessage} />
    </div>
  )
}
