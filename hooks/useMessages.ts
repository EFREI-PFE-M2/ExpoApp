import { useSelector } from "react-redux";
import { selectGroupChats, selectPrivateChats } from "../store/chatSlice";

export default function useMessages({isPrivateChat, chatID}:any) {
    const messages = isPrivateChat ? useSelector(selectPrivateChats)[chatID]?.messages
    : useSelector(selectGroupChats)[chatID]?.messages

    return messages
}