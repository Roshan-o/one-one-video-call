import React, { use } from 'react'
import {useState} from 'react'
// import { Link } from 'react-router-dom'
import {useEffect} from 'react'
import {useSocket} from '../context/SocketProvider'
import { useNavigate } from 'react-router-dom'

function LandingPage() {
  const socket=useSocket();
    const [roomid,setroomid]=useState("");
    const [email,setemail]=useState("");
    const navigate=useNavigate();


    useEffect(()=>{
      console.log('landing page')
      socket.on('joined-room',({email,roomid})=>{
      console.log('from backend joined-room',email,roomid)
      });
      return ()=>{
        socket.off('joined-room'); //eliminate duplicates listners
      }
    },[socket])
    // console.log(socket);

    const handleSubmitForm=(e)=>{
      e.preventDefault();
      console.log(email,roomid)
      socket.emit('join-room',{email,roomid});
      navigate(`/room/${roomid}`);
    }
  return (
    <div className='bg-blue-200 flex flex-col justify-center items-center h-screen'>
      <form onSubmit={handleSubmitForm} className='flex flex-col justify-center items-center'>
      <input type="text" value={email} onChange={(e)=>setemail(e.target.value)} placeholder='email...' className='bg-blue-300 m-2 p-2' />
      <input type="text" value={roomid} onChange={(e)=>setroomid(e.target.value)} placeholder='roomid' className='bg-blue-300 m-2 p-2' />
        <button>join</button>
      </form>
    </div>
  )
}

export default LandingPage