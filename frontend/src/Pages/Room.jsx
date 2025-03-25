import React, { startTransition, useCallback, useEffect, useState } from 'react';
// import { useSearchParams } from 'react-router-dom'
import { useParams } from 'react-router-dom';
import { useSocket } from '../context/SocketProvider';
import ReactPlayer from 'react-player';
// import PeerService from '../service/peer'
import peer from '../service/peer';


function Room() {
  const socket = useSocket();
  const [email, setemail] = useState("");
  const [remoteSocketId, setremoteSocketId] = useState(null);
  const [stream, setmystream] = useState();
  const [remoteStream, setremoteStream] = useState();

  const handleUserjoined = useCallback(({ email, id }) => {
    setemail(email);
    setremoteSocketId(id);
    console.log(`new use${email}-${id}`);
  }, []);

  // const handle
  const Handlecall = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    })
    const offer = await peer.getOffer();
    socket.emit("user-call", { to: remoteSocketId, offer });
    setmystream(stream);
    // const newpeer=peer.getOffer();
    // setmystream(stream);
  }, [remoteSocketId, socket]);


  const handleIncommingcall = useCallback(async (data) => {
    console.log("data:", data);
    const { from, offer } = data;
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    })
    setmystream(stream);
    const ans = await peer.getAnswer(offer);
    console.log("at handleAnswerfunction:", ans);
    socket.emit('call-accepted-send-back', { to: from, ans })

  }, [socket]);


  const sendStream = useCallback(() => {
    console.log("came into senStream:");
    for (const track of stream.getTracks()) {
      peer.peer.addTrack(track, stream);
    }
  }, [stream])


  const handlecallAccepted = useCallback(async ({ from, ans }) => {
    peer.setLocalDescription(ans);
    console.log('call-acceptedd');
    sendStream();

  }, [sendStream]);


  // useEffect(() => {
  //   peer.peer.addEventListener("track", async (event) => {
  //     const remote = event.streams;
  //     setremoteStream(remote[0]);

  //   });
  // }, [])
  useEffect(() => {
    const handleTrackEvent = (event) => {
      setremoteStream(event.streams[0]);
    };
    peer.peer.addEventListener("track", handleTrackEvent);

    return () => {
      peer.peer.removeEventListener("track", handleTrackEvent);
    };
  }, []);



  const handlenego = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit('peer-nego-needed', { to: remoteSocketId, offer });
  }
  )

  const handlenegoNeededIncomm = useCallback(async ({ from, offer }) => {
    const ans = await peer.getAnswer(offer);
    console.log("at get handle-neg", ans);
    socket.emit('peer-nego-done', { to: from, ans });
  }, [socket]);

  useEffect(() => {
    peer.peer.addEventListener('negotiationneeded', handlenego);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handlenego);
    }
  }, [handlenego]);

  const handlenegofinal = useCallback(async ({ from, ans }) => {
    // console.log('before:sending-nego',data);
    peer.setLocalDescription(ans);
  }, [])


  useEffect(() => {
    socket.on('user-joined', handleUserjoined);
    socket.on('incoming-call', handleIncommingcall);
    socket.on('call-accepted-send-back', handlecallAccepted);
    socket.on('peer-nego-needed', handlenegoNeededIncomm);
    socket.on('peer-nego-final', handlenegofinal);
    // socket.on('user-joined',({email,id})=>{
    //   console.log(`new user ${email}-${id}`);
    // });

    return () => {
      socket.off('peer-nego-final', handlenegofinal);
      socket.off('incoming-call', handleIncommingcall);
      socket.off('call-accepted-send-back', handlecallAccepted);
      socket.off('user-joined', handleUserjoined); //eliminate duplicates listners
      socket.off('peer-nego-needed', handlenegoNeededIncomm);
    }
  }, [socket, handleUserjoined, handleIncommingcall, handlecallAccepted, handlenegoNeededIncomm,
    handlenegofinal
  ]);

  const { roomid } = useParams();
  // console.log(roomid);
  return (
    <div className='bg-blue-200 flex flex-col justify-center items-center h-screen'>
      this is Room {roomid}
      {(remoteSocketId) ? <button className='bg-blue-400 p-2 px-4 rounded m-2' onClick={Handlecall}>Call</button> : <></>}
      {stream &&
        <>
          <h1 className='text-4xl font-bold'>My video</h1>
          <ReactPlayer url={stream} playing muted className='h-50px w-100px border-2'/>
          {/* <video playsInline ref={(video) => video && (video.srcObject = stream)} autoPlay muted className='h-50px w-100px border-2'></video> */}
        </>
      }
      {stream &&
        <button onClick={sendStream}>send stream</button>
      }
      {remoteStream &&
        <>
          <h1 className='text-4xl font-bold'>Remote Stream</h1>
          <ReactPlayer url={remoteStream} playing muted className='h-50px w-100px border-2'/>
          {/* <video playsInline ref={(video) => video && (video.srcObject = remoteStream)} autoPlay muted className='h-50px w-100px border-2'></video> */}

        </>
      }
    </div>
  )
}

export default Room
