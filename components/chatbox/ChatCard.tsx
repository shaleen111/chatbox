import { ChatWithId, Reaction } from "../../types/index"
import { Card, CardBody, CardFooter, CardHeader, Heading,
         Flex, Text, Button, Spacer, Textarea,
         VStack, Modal, ModalContent, ModalOverlay,
         ModalHeader, ModalCloseButton, ModalFooter, useDisclosure,
       } from "@chakra-ui/react"
import { motion } from "framer-motion"
import { FaThumbsUp, FaThumbsDown, FaPen, FaTrash } from "react-icons/fa"
import { useState, Dispatch, SetStateAction, FormEventHandler,
         useEffect } from "react"
import { db } from "../../util/firebase"
import { updateDoc, doc, Timestamp, deleteDoc, getDoc, query,
         collection, where, getDocs, setDoc
       } from "firebase/firestore"
import { useAuth } from "../auth/AuthUserProvider"

type Props = {
    readonly chat: ChatWithId
    readonly edit: string|null
    readonly setEdit: Dispatch<SetStateAction<string|null>>
}

type ToolBarProps = Props & {
    readonly setInput: Dispatch<SetStateAction<string>>
}

type ChatCardContentProps = ToolBarProps & {
    readonly input: string
}

const ToolBar = ({edit, setEdit, chat: {id, content}, setInput}
                    : ToolBarProps) => {
    let { isOpen, onOpen, onClose } = useDisclosure()

    let handleDelete = () => {
        deleteDoc(doc(db, 'chats', id))
        onClose()
    }

    let handleEdit = () => {
        if (edit === id)
        {
            console.log(edit, id)
            setEdit(null)
        }
        else
        {
            setInput(content)
            setEdit(id)
        }
    }

    return (
        <>
        <Flex>
        <Button leftIcon={ <FaPen /> } onClick={handleEdit}
                color={edit === id ? 'red': ''}>
            { edit === id ? 'Cancel' : 'Edit' }
        </Button>
        <Spacer />
        <Button onClick={onOpen} rightIcon={ <FaTrash /> }>Delete</Button>
        </Flex>

        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent width='95%' margin='auto'>
          <ModalCloseButton />
          <ModalHeader marginTop={5}>Are you sure you want to delete this chat?</ModalHeader>
          <ModalFooter>
            <Button  mr={3} onClick={onClose}
                     textStyle="bold">
              Close
            </Button>
            <Button variant='ghost' color="red" onClick={handleDelete}>
                Delete
            </Button>
          </ModalFooter>
        </ModalContent>
        </Modal>
        </>
    )
}

const ChatCardHeader = ({chat: {authorName, modified}}: Props) =>
{
    return (
        <CardHeader paddingTop="5" paddingBottom="2"
                        borderBottomWidth="1px" borderStyle="solid">
                <Flex alignItems={"center"}>
                    <Heading fontSize="1.35em"
                             color="purple.700">
                        {authorName}
                    </Heading>
                    <Heading size="sm"
                             marginLeft="auto"
                             color="blackAlpha.700">
                        {modified.toDate().toLocaleDateString()}
                    </Heading>
                </Flex>
            </CardHeader>
    )
}

const ChatCardContent = ({edit, setEdit, chat:{id, content}, input, setInput}
                            : ChatCardContentProps) =>
{
    const editChat: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()
        if (input === "") return

        updateDoc(doc(db, 'chats', id), {
            content: input,
            modified: Timestamp.fromMillis(Date.now())
        })

        setEdit(null)
    }
    return (
        <CardBody marginTop="2" py={2} px={4}>
        { edit === id ?
                <form onSubmit={editChat}>
                <VStack>
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    variant="unstyled"
                    resize="none"
                    p="4"
                    borderTopWidth="1px"
                    borderBottomWidth="1px"
                    borderRadius="0"
                    borderStyle="solid"
                    isRequired
                    borderColor="cyan.700"
                  />
                  <Button type="submit" color="white"
                          marginLeft="auto"
                          textStyle="bold"
                          background="cyan.600"
                          _hover={{background: "purple.700", color: "white"}}>
                    Edit!
                  </Button>
                </VStack>
              </form>
          :
            <Text fontSize="1em">
                {content}
            </Text>}
        </CardBody>
    )
}

const ReactionBar = ({chat: {id}}: Props) =>
{
    let { user } = useAuth()
    let [reaction, setReaction] = useState(0)
    let [likeCount, setLikeCount] = useState(0)
    let [dislikeCount, setDislikeCount] = useState(0)
    useEffect(() => {
        if(!user) return
        setDoc(doc(db, "reactions", user!.uid + ":" + id), {chatId: id, state: reaction})
    }, [reaction])
    useEffect(() => {
        const getReacts = async () => {
            if(user)
            {
                let resp = await getDoc(doc(db, "reactions", user!.uid + ":" + id))
                let val = resp.exists() ? ({...resp.data()} as Reaction).state : 0
                setReaction(val)
            }

            let counts = await getDocs(query(collection(db, "reactions"), where("chatId", "==", id)))

            setLikeCount(0)
            setDislikeCount(0)
            counts.docs.forEach((doc) => {
                let react = {...doc.data()} as Reaction
                if(react.state == 1)
                {
                    setLikeCount(c => (c + 1))
                }
                else if(react.state == 2)
                {
                    setDislikeCount(c => (c + 1))
                }
            })

        }
        getReacts()
    }, [user, id])

    const like = () => {
        if(!user) return
        if(reaction === 1)
        {
            setReaction(0)
            setLikeCount(likeCount - 1)
        }
        else if(reaction === 2)
        {
            setReaction(1)
            setDislikeCount(dislikeCount - 1)
            setLikeCount(likeCount + 1)
        }
        else
        {
            setReaction(1)
            setLikeCount(likeCount + 1)
        }
    }

    const dislike = () => {
        if(!user) return
        if(reaction === 2)
        {
            setReaction(0)
            setDislikeCount(dislikeCount - 1)
        }
        else if(reaction === 1)
        {
            setReaction(2)
            setDislikeCount(dislikeCount + 1)
            setLikeCount(likeCount - 1)
        }
        else
        {
            setReaction(2)
            setDislikeCount(dislikeCount + 1)
        }
    }

    return (
        <CardFooter py={2}
        justify="space-between"
        flexWrap="wrap">
        <Button flex='1' variant='ghost' leftIcon={<FaThumbsUp />} isActive={user != undefined && reaction == 1}
        onClick={like}>
        {likeCount} Likes
        </Button>
        <Button flex='1' variant='ghost' leftIcon={<FaThumbsDown />} isActive={reaction == 2 && user != undefined}
        onClick={dislike}>
        {dislikeCount} Dislikes
        </Button>
        </CardFooter>
    )
}

const ChatCard = (props: Props) => {
    let [input, setInput] = useState("")
    let { user } = useAuth()

    return (
        <motion.div
         initial={{ scale: 0.5 }}
         animate={{ scale: 1 }}
         transition={{ duration: 0.45 }}
         style={{width: '100%'}}>
        <Card margin="0" padding="0" minWidth='100%'>
            {  user && user.uid == props.chat.author ?
                <ToolBar {...props} setInput={setInput}/>
               : ""
            }

            <ChatCardHeader {...props}/>

            <ChatCardContent {...props} input={input} setInput={setInput}/>

            <ReactionBar {...props} />
        </Card>
        </motion.div>
    )
}

export default ChatCard
