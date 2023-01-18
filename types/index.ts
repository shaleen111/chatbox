import { LinkOverlay } from "@chakra-ui/react"
import { Timestamp } from "firebase/firestore"

export type Chat = {
  content: string
  modified: Timestamp
  author: string
  authorName: string
}

export type ChatWithId = Chat & {
  id: string
}

export type Reaction = {
  state: number
  chatId: string
}

export enum ReactionState {
  NoReact,
  Like,
  Dislike
}
