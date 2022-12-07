import { Center, Heading, Text, useBreakpointValue } from "@chakra-ui/react"

const ChatboxHeading = () => (
  <Center>
    <Heading
      fontSize={{ base: '6xl', md: '7xl', lg: '8xl' }}
      m={12}>
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
          bg: 'cyan.400',
          zIndex: -1,
        }}
        bgGradient="linear(to-r, cyan.700, purple.500)"
        bgClip="text"
        lineHeight={1.33}
        align="center">
          Chatbox
        </Text>
      <br />{' '}
    </Heading>
  </Center>)

export default ChatboxHeading
