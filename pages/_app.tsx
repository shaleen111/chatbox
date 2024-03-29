import { ChakraProvider } from '@chakra-ui/react'
import AuthUserProvider from '../components/auth/AuthUserProvider'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ChakraProvider>
            <AuthUserProvider>
                <Component {...pageProps} />
            </AuthUserProvider>
        </ChakraProvider>)
}
