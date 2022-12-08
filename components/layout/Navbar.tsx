import React from "react"
import { Box, Button, HStack } from "@chakra-ui/react"

const Navbar = () => {
  return (
    <Box px={4} shadow="base">
      <HStack justifyContent="right">
        <HStack h={14} as="nav" spacing={4} alignItems="center">
            <Button
              bgGradient="linear(to-r, cyan.700, purple.500)"
              bgClip="text"
              variant="outline"
              borderColor="cyan.700"
              fontWeight={"bold"}
              _hover={{
                color: "white",
                bgClip:"border-box"
              }}>
                Sign In
            </Button>
        </HStack>
      </HStack>
    </Box>
  )
}

export default Navbar
