package models

case class NewChatMessage(messageId: String, senderId: String, recipientId: String, message: String)
