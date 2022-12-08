import { Box, VStack, Button, Textarea, Checkbox, Flex } from "@chakra-ui/react"
import { Chat } from "../../types/index"
import { FormEventHandler, useState } from "react"
import { addDoc, collection, Timestamp } from "firebase/firestore"
import { db } from "../../util/firebase"

const ChatboxControl = () => {
    const [input, setInput] = useState("")

    const addChat: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()

        const chat: Chat = {
            author: "Anonymous",
            content: input,
            modified: Timestamp.fromMillis(Date.now())
        }

        addDoc(collection(db, 'chats'), chat)

        setInput("")
    }

    return (
        <Box w="100%">
        <form onSubmit={addChat}>
          <VStack>
            <Textarea
              value={input}
              placeholder="What's up?"
              onChange={(e) => setInput(e.target.value)}
              width='100%'
              minHeight='8em'
              variant="unstyled"
              resize="none"
              p="4"
              borderRadius="0"
              borderTopWidth="1.5px"
              borderBottomWidth="1px"
              borderStyle="solid"
              isRequired
              borderColor="cyan.700"
            />
            <Flex w="100%">
              <Checkbox isChecked={true} isDisabled={true}
                        textAlign="left">
                  Anonymous
              </Checkbox>
              <Button type="submit" marginLeft="auto" color="white"
                      textStyle="bold"
                      background="cyan.600"
                      _hover={{background: "purple.700", color: "white"}}>
                  Chat!
              </Button>
            </Flex>
          </VStack>
        </form>
        </Box>
      )
}

export default ChatboxControl
