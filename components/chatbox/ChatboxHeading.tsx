import { Center, Heading, Link, Text, useBreakpointValue } from "@chakra-ui/react"

const ChatboxHeading = () => (
    <Center>
        <Heading
            fontSize={{ base: '7xl', md: '8xl', lg: '8xl' }}>
            <Text
                as={'span'}
                position={'relative'}
                _after={{
                    content: "''",
                    width: 'full',
                    height: useBreakpointValue({ base: '20%', md: '30%' }),
                    position: 'absolute',
                    bottom: 1,
                    left: 0,
                    bg: 'cyan.500',
                    zIndex: -1,
                }}
                _hover={{
                    bgGradient: "linear(to-r, purple.500, cyan.700)"
                }}
                bgGradient="linear(to-r, cyan.700, purple.500)"
                bgClip="text"
                lineHeight={1.33}
                align="center">
                <Link href="/" _hover={{ textDecoration: "none" }}>
                    Chatbox
                </Link>
            </Text>
            <br />{' '}
        </Heading>
    </Center>)

export default ChatboxHeading
