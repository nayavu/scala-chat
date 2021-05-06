package models

import play.api.libs.json.{Format, Json}

case class ChatMessage(messageId: String, senderId: String, recipientId: String, message: String, timestamp: Long)

object ChatMessage {
  implicit val chatMessageFormat: Format[ChatMessage] = Json.format[ChatMessage]
}
