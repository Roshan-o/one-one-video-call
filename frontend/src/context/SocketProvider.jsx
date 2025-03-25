import React, { createContext } from 'react';
import {io} from 'socket.io-client';
import {useMemo} from 'react';
import {useContext} from 'react';

const SocketContext=createContext(null);

export const useSocket=()=>{
  return useContext(SocketContext);

}


function SocketProvider(props) {
  const socket= useMemo(()=>io("http://localhost:3000"),[]);
  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  )
}

export default SocketProvider
