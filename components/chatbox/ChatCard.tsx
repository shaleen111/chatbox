import { Chat } from "../../types/index"
import { Card, CardBody, CardFooter, CardHeader, Heading,
         Flex, Text, Button, useBreakpointValue, Spacer} from "@chakra-ui/react"
import { FaThumbsUp, FaThumbsDown, FaPen, FaTrash } from "react-icons/fa"

type Props = {
    readonly chat: Chat
}

const ChatCard = ({ chat: {author, content, modified}}: Props) => {
    return (
        <Card minWidth={useBreakpointValue({ base: '120%', md: '40em' })}>
            <Flex>
                <Button leftIcon={ <FaPen /> }>Edit</Button>
                <Spacer />
                <Button rightIcon={ <FaTrash /> }>Delete</Button>
            </Flex>
            <CardHeader paddingTop="5" paddingBottom="2"
                borderBottomWidth="1px" borderStyle="solid">
                <Flex alignItems={"center"}>
                    <Heading fontSize="1.35em"
                         color="purple.700">
                            {author}
                    </Heading>
                    <Heading size="sm"
                         marginLeft="auto"
                         color="blackAlpha.700">
                        {modified.toDate().toLocaleDateString()}
                    </Heading>
                </Flex>
            </CardHeader>
            <CardBody marginTop="2" py={2} px={4}>
                <Text fontSize="1em">
                    {content}
                </Text>
            </CardBody>
            <CardFooter py={2}
              justify="space-between"
              flexWrap="wrap">
                <Button flex='1' variant='ghost' leftIcon={<FaThumbsUp />}>
                    5 Likes
                </Button>
                <Button flex='1' variant='ghost' leftIcon={<FaThumbsDown />}>
                    6 Dislikes
                </Button>
            </CardFooter>
        </Card>
    )
}

export default ChatCard
