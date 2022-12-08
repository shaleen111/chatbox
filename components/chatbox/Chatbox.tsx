import { db } from "../../util/firebase"
import { collection, onSnapshot, orderBy, query } from "firebase/firestore"
import ChatboxControl from "./ChatboxControl"
import ChatboxHeading from "./ChatboxHeading"
import ChatView from "./ChatView"
import { Spinner, VStack } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { Chat, ChatWithId } from "../../types"

const chatQuery = query(collection(db, 'chats'), orderBy("modified", "desc"))

const Chatbox = () => {
    const [chats, setChats] = useState<ChatWithId[] | null>(null)
    const [edit, setEdit] = useState<string | null>(null)

    useEffect(() => {
        const unsubscribe = onSnapshot(chatQuery, (querySnapshot) => {
            setChats(querySnapshot.docs.map((doc) => {
                return {... doc.data() as Chat, id: doc.id};
            }))
        })
        return unsubscribe
    }, [])

    return (
        <VStack spacing={55} marginBottom={55}>
            <ChatboxHeading />
            <ChatboxControl />
            {chats ? <ChatView chats={chats} edit={edit} setEdit={setEdit}/> : <Spinner />}
        </VStack>
    )
}

export default Chatbox
