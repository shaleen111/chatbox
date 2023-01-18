import { ChatWithId, Reaction, ReactionState } from "../../types/index"
import {
  Card, CardBody, CardFooter, CardHeader, Heading,
  Flex, Text, Button, Spacer, Textarea,
  VStack, Modal, ModalContent, ModalOverlay,
  ModalHeader, ModalCloseButton, ModalFooter, useDisclosure,
} from "@chakra-ui/react"
import { FaThumbsUp, FaThumbsDown, FaPen, FaTrash } from "react-icons/fa"
import {
  useState, Dispatch, SetStateAction, FormEventHandler,
  useEffect
} from "react"
import { db, signInWithGoogle } from "../../util/firebase"
import {
  updateDoc, doc, Timestamp, deleteDoc, setDoc
} from "firebase/firestore"
import { useAuth } from "../auth/AuthUserProvider"

type Props = {
  readonly chat: ChatWithId
  readonly edit: string | null
  readonly setEdit: Dispatch<SetStateAction<string | null>>
  readonly reactions: Map<string, Reaction>
}

type ToolBarProps = Props & {
  readonly setInput: Dispatch<SetStateAction<string>>
}

type ChatCardContentProps = ToolBarProps & {
  readonly input: string
}

const ToolBar = ({ edit, setEdit, chat: { id, content }, setInput }
  : ToolBarProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleDelete = () => {
    deleteDoc(doc(db, 'chats', id))
    onClose()
  }

  const handleEdit = () => {
    if (edit === id) {
      setEdit(null)
    }
    else {
      setInput(content)
      setEdit(id)
    }
  }

  return (
    <>
      <Flex>
        <Button leftIcon={<FaPen />} onClick={handleEdit}
          color={edit === id ? 'red' : ''}>
          {edit === id ? 'Cancel' : 'Edit'}
        </Button>
        <Spacer />
        <Button onClick={onOpen} rightIcon={<FaTrash />}>Delete</Button>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent width='95%' margin='auto'>
          <ModalCloseButton />
          <ModalHeader marginTop={5}>Are you sure you want to delete this chat?</ModalHeader>
          <ModalFooter>
            <Button mr={3} onClick={onClose}
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

const ChatCardHeader = ({ chat: { authorName, modified } }: Props) => {
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

const ChatCardContent = ({ edit, setEdit, chat: { id, content }, input, setInput }
  : ChatCardContentProps) => {
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
      {edit === id ?
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
              _hover={{ background: "purple.700", color: "white" }}>
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

const ReactionBar = ({ chat: { id }, reactions }: Props) => {
  const {user} = useAuth()
  const [reaction, setReaction] = useState<ReactionState | null>(null)
  const [likeCount, setLikeCount] = useState(0)
  const [dislikeCount, setDislikeCount] = useState(0)

  // log in prompts
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    if (user) {
      let currChat = user.uid + ":" + id
      let currChatReaction = reactions.get(currChat)

      if (currChatReaction) {
        setReaction(currChatReaction.state)
      }
    }
    else {
      setReaction(ReactionState.NoReact)
    }
  }, [user, reactions, id])

  useEffect(() => {
    setLikeCount(0)
    setDislikeCount(0)
    reactions.forEach((react, key) => {
      let chatId = key.split(":")[1]
      if (chatId !== id) return
      if (react.state === ReactionState.Like) {
        setLikeCount(c => (c + 1))
      }
      else if (react.state == ReactionState.Dislike) {
        setDislikeCount(c => (c + 1))
      }
    })
  }, [reactions, id])

  useEffect(() => {
    if (!user || reaction === null) return
    let currChat = user.uid + ":" + id
    setDoc(doc(db, "reactions", currChat), { chatId: id, state: reaction })
  }, [reaction, user, id])

  const reactionToggler = (pressed: ReactionState) => {
    // Make sure a user exists
    if (!user) {
      onOpen()
      return
    }

    // Undo past reaction.
    if (reaction === ReactionState.Like) {
      setLikeCount(likeCount - 1)
    } else if (reaction === ReactionState.Dislike) {
      setDislikeCount(dislikeCount - 1)
    }

    // Record new reaction.
    if (reaction === pressed) {
      setReaction(ReactionState.NoReact)
    }
    else {

      if (pressed === ReactionState.Like) {
        setLikeCount(likeCount + 1)
      } else if (pressed === ReactionState.Dislike) {
        setDislikeCount(dislikeCount + 1)
      }

      setReaction(pressed)
    }
  }

  return (
    <CardFooter py={2}
      justify="space-between"
      flexWrap="wrap">
      <Button flex='1' variant='ghost' leftIcon={<FaThumbsUp />}
        isActive={user != null && user != undefined
          && reaction === ReactionState.Like}
        onClick={() => reactionToggler(ReactionState.Like)}>
        {likeCount} Likes
      </Button>
      <Button flex='1' variant='ghost' leftIcon={<FaThumbsDown />}
        isActive={user != null && reaction === ReactionState.Dislike
          && user != undefined}
        onClick={() => reactionToggler(ReactionState.Dislike)}>
        {dislikeCount} Dislikes
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent width='95%' margin='auto'>
          <ModalCloseButton />
          <ModalHeader marginTop={5}>Please login to interact with chats!</ModalHeader>
          <ModalFooter>
            <Button mr={3} onClick={onClose}
              textStyle="bold">
              Close
            </Button>
            <Button variant='ghost' color="purple" onClick={signInWithGoogle}>
              Sign In
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </CardFooter>
  )
}

const ChatCard = (props: Props) => {
  let [input, setInput] = useState("")
  let { user } = useAuth()

  return (
    <Card margin="0" padding="0" minWidth='100%'>
      {user && user.uid == props.chat.author ?
        <ToolBar {...props} setInput={setInput} />
        : ""
      }

      <ChatCardHeader {...props} />

      <ChatCardContent {...props} input={input} setInput={setInput} />

      <ReactionBar {...props} />
    </Card>
  )
}

export default ChatCard
