import React, { useState,useEffect, useRef } from "react";

import { 
        Box,
        Button,
        Container,
        HStack,
        Input,
        VStack 
      } from "@chakra-ui/react";

import Message from "./Components/Message";

import {
        getAuth,
        GoogleAuthProvider,
        signInWithPopup,
        onAuthStateChanged,
        signOut
      } from "firebase/auth"

import {
        getFirestore,
        addDoc,
        collection,
        serverTimestamp,
        onSnapshot,
        query,
        orderBy
       } from "firebase/firestore";


import { app } from "./firebase";


const auth = getAuth(app);
const db = getFirestore(app);

const loginHandler =()=>{
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth,provider)
}

const logoutHandler = ()=> signOut(auth);




function App() {

const [user, setUser] = useState(false);
const [message, setMessage] = useState("");
const [messages, setMessages] = useState([]);

const divForScroll = useRef(null);

const submitHandler =async(e)=>{
  e.preventDefault();

  try {
    await addDoc(collection(db,"Messages"),{
      text: message,
      uid: user.uid,
      uri:user.photoURL,
      createdAt: serverTimestamp()
    });
    setMessage("");
    divForScroll.current.scrollIntoView({ behaviour : "smooth" });
  } 
  catch(error){
    alert(error);
  }
  };


useEffect(() => {
  const q  = query(collection(db,"Messages"),orderBy("createdAt","asc"));


  const unsubscribe = onAuthStateChanged(auth,(data)=>{
    setUser(data);
  });

  const unsubscribeForMessage =  onSnapshot(q,(snap)=>{
    setMessages(snap.docs.map(item =>{
      const id = item.id;
      return {id,...item.data()};
    }));
    
  })


  return ()=>{
    unsubscribe();
    unsubscribeForMessage();
  }
});



  return <Box bg={"blackAlpha.300"}>
    {
      user?(<Container h={"100vh"} bg={"white"}>
      
      <VStack h={"full"}  bg={"telegram.100"} paddingY={"4"}>
        <Button onClick={logoutHandler} colorScheme="red" w ={"full"}>Logout</Button>

      <VStack  h="full" w="full" overflowY={"auto"} css={{"&::-webkit-scrollbar":{
        display:"none"
      }}}>
      {
        messages.map(item=>(
          <Message 
            key={item.id}
            user={item.uid===user.uid?"me" : "other"}  
            text={item.text}  
            uri={item.uri}/>
        ))
      }
          
          <div ref={divForScroll}></div>
      </VStack>

      
      <form  onSubmit={submitHandler} style={{width:"100%"}}> 
          <HStack>
            <Input value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="Enter your message..." bgColor={"gray.200"} />
           <Button colorScheme="purple" type="submit">Send</Button>
          </HStack>
      </form>

        

      </VStack>
    </Container>)  
    :
    <VStack justifyContent={"center"} bg={"white"} >
      <Button onClick={loginHandler} colorScheme="green">Sign in with Google</Button>
    </VStack>
    }
  </Box>
}

export default App;
