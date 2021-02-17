export default {
    addMessage: {
        toPrivate: 0,
        toGroup: 1
    },
    deleteMessage: {
        inPrivate: 2,
        inGroup: 3
    },
    collection: {
        chat: {
            group: 'GroupConversation',
            members: 'GroupChatMembers',
            private: 'PrivateConversation',
            messages: 'Messages'
        }
    },
    message: {
        type: {
            text: 'text',
            image: 'image',
            audio: 'audio',
            edited: 'edited',
            deleted: 'deleted'
        },
        deleted:{
            text: 'Message deleted'
        }
    },
    lastMessage: {
        type: {
            image: '[New image has been sent]',
            audio: '[New audio has been sent]',
            deleted: '[Message has been deleted]',
            first: '[Be the first to send message]'
        }
    },
    topMessage: {
        type: {
            first: 'You already reached the top of the messages',
            scrollUp: 'Click or scroll up to display older messages'
        }
    }
}