import { Box, Divider, Text } from "@chakra-ui/react"
import React from "react"

const Footer = () => (
  <Box as="footer" px={4}>
    <Divider my={4} />
    <Text fontSize="sm" color="subtle" align="center" fontStyle="italic Center,">
      Created by Pranavi Gupta(pg342), Setor Kudiabor(kek265) &
      Shaleen Baral (sb969)
    </Text>
  </Box>
)

export default Footer
