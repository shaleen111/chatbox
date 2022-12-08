import { VStack } from "@chakra-ui/react"
import { ChatWithId } from "../../types"
import { Text } from "@chakra-ui/react"
import { Dispatch, SetStateAction, useState } from "react"
import ChatCard from "./ChatCard"

type Props = {
    readonly chats: ChatWithId[]
    readonly edit: string | null
    readonly setEdit: Dispatch<SetStateAction<string | null>>
}

const ChatView = ({ edit, setEdit, chats }: Props) => {


    return (
        <VStack>
            {chats.length ? (
                chats.map((chat) => <ChatCard key={chat.id} chat={chat}
                                              edit={edit} setEdit={setEdit}/>)
            ) : (
                <Text fontSize="xl"> No one has said anything! </Text>
            )}
        </VStack>
    )
}

export default ChatView
