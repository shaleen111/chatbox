import { VStack } from "@chakra-ui/react"
import { ChatWithId } from "../../types"
import { Text } from "@chakra-ui/react"
import ChatCard from "./ChatCard"

type Props = {
    readonly chats: ChatWithId[]
}

const ChatView = ({ chats }: Props) => {
    return (
        <VStack>
            {chats.length ? (
                chats.map((chat) => <ChatCard key={chat.id} chat={chat}/>)
            ) : (
                <Text> No one has said anything! </Text>
            )}
        </VStack>
    )
}

export default ChatView
