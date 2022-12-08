import { Timestamp }  from "firebase/firestore"

export type Chat = {
  content: string
  modified: Timestamp
  author: string
}

export type ChatWithId = Chat & {
  id: string
}
