import { db } from "../../util/firebase"
import { collection, getDocs, limit, onSnapshot, orderBy, query } from "firebase/firestore"
import ChatboxControl from "./ChatboxControl"
import ChatboxHeading from "./ChatboxHeading"
import ChatView from "./ChatView"
import { Spinner, VStack } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { Chat, ChatWithId, Reaction } from "../../types"

const chatQuery = query(collection(db, 'chats'), orderBy("modified", "desc"))
const reactionQuery = query(collection(db, 'reactions'))

const Chatbox = () => {
  const [chats, setChats] = useState<ChatWithId[] | null>(null)
  const [reactions, setReaction] = useState(new Map<string, Reaction>())

  const [edit, setEdit] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onSnapshot(chatQuery, (querySnapshot) => {
      setChats(querySnapshot.docs.map((doc) => {
        return { ...doc.data() as Chat, id: doc.id };
      }))
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    const fetchReactions = async () => {
      const reactionSnapshot = await getDocs(reactionQuery)

      const tempReactions = new Map<string, Reaction>()
      reactionSnapshot.forEach((doc) => {
        let curr_reaction = { ...doc.data() as Reaction }
        tempReactions.set(doc.id, curr_reaction)
      })

      setReaction(tempReactions)
    }
    fetchReactions()
  }, [])

  return (
    <VStack spacing={55} marginBottom={55}>
      <ChatboxHeading />
      <ChatboxControl />
      {chats ? <ChatView chats={chats} edit={edit} setEdit={setEdit}
        reactions={reactions} /> : <Spinner />}
    </VStack>
  )
}

export default Chatbox
