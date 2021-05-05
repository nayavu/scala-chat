package models

import play.api.libs.functional.syntax.toFunctionalBuilderOps
import play.api.libs.json.{JsPath, JsValue, Json, Reads, Writes}

case class ChatMessage(messageId: String, senderId: String, recipientId: String, message: String, timestamp: Long, delivered: Boolean)

object ChatMessage {
  implicit val chatMessageWrites = new Writes[ChatMessage] {
    def writes(message: ChatMessage): JsValue = {
      Json.obj(
        "messageId" -> message.messageId,
        "senderId" -> message.senderId,
        "recipientId" -> message.recipientId,
        "message" -> message.message,
        "timestamp" -> message.timestamp,
        "delivered" -> message.delivered
      )
    }
  }

  implicit val chatMessageReads: Reads[ChatMessage] = (
    (JsPath \ "messageId").read[String] and
      (JsPath \ "senderId").read[String] and
      (JsPath \ "recipientId").read[String] and
      (JsPath \ "message").read[String] and
      (JsPath \ "timestamp").read[Long] and
      (JsPath \ "delivered").read[Boolean]
    )(ChatMessage.apply _)
}
