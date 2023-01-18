import { VStack } from "@chakra-ui/react"
import { ChatWithId, Reaction } from "../../types"
import { Text } from "@chakra-ui/react"
import { Dispatch, SetStateAction, useEffect, useLayoutEffect } from "react"
import ChatCard from "./ChatCard"
import { collection, getDocs, query } from "firebase/firestore"
import { db } from "../../util/firebase"
import { motion } from "framer-motion"
import { useState } from "react"
import { useAuth } from "../auth/AuthUserProvider"

type Props = {
  readonly chats: ChatWithId[]
  readonly edit: string | null
  readonly setEdit: Dispatch<SetStateAction<string | null>>
  readonly reactions: Map<string, Reaction>
}


const ChatView = ({ edit, setEdit, chats, reactions}: Props) => {
  return (
    <motion.div
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.25 }}
      style={{ width: '100%' }}>
      <VStack minWidth={'100%'}>
        {chats.length ? (
          chats.map((chat) => <ChatCard key={chat.id} chat={chat}
            reactions={reactions} edit={edit} setEdit={setEdit} />)
        ) : (
          <Text fontSize="xl"> No one has said anything! </Text>
        )}
      </VStack>
    </motion.div>
  )
}

export default ChatView
