import React from "react"
import { Box, Button, HStack } from "@chakra-ui/react"
import { signInWithGoogle } from "../../util/firebase"
import { useAuth } from "../auth/AuthUserProvider"

const Navbar = () => {
  const { user, signOut } = useAuth()
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
              }}
              _active={{
                bgGradient:"linear(to-r, cyan.700, purple.500)",
                bgClip:"text",
              }}
              onClick={user ? signOut : signInWithGoogle}>
                {user ? "Sign Out" : "Sign In"}
            </Button>
        </HStack>
      </HStack>
    </Box>
  )
}

export default Navbar
