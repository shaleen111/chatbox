import ChatboxControl from "./ChatboxControl"
import ChatboxHeading from "./ChatboxHeading"
import { VStack } from "@chakra-ui/react"
import { useState } from "react"

const Chatbox = () => {
    return (
        <VStack spacing={55} marginBottom={55}>
            <ChatboxHeading />
            <ChatboxControl />
            {/* <ChatView /> */}
        </VStack>
    )
}

export default Chatbox
