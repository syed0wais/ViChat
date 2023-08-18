import React from 'react'
import { HStack,Avatar,Text } from '@chakra-ui/react'

const Message = ({text,uri,user="other"}) => {
  return (
    <HStack 
        alignSelf={user==="me" ? "flex-end" : "flex-start"}
        bg="white"
        paddingX={user==="me"? "4" : "2"} 
        paddingY={"2"} 
        
        borderRadius={"base"} 
        >

        {
            user==="other" &&  <Avatar src={uri}/>
        }

        <Text>{text}</Text>
   
        {
            user==="me" &&  <Avatar src={uri}/>
        }
       
    </HStack>
  )
}

export default Message