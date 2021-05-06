package models.events

import play.api.libs.json.{Json, JsonConfiguration, JsonNaming, Reads}

sealed trait Upstream

// Chat member sends a new message
final case class UpstreamNewMessage(messageId: String, recipientId: String, message: String) extends Upstream

// Chat member confirms that message was read
final case class UpstreamMessageRead(messageId: String, senderId: String) extends Upstream

// Chat member starts typing to another member
final case class UpstreamStartedTyping(memberId: String) extends Upstream

// Chat member stops typing to another member
final case class UpstreamStoppedTyping(memberId: String) extends Upstream

// Ping
final case object UpstreamPing extends Upstream

object Upstream {

  implicit val upstreamConfiguration: JsonConfiguration = JsonConfiguration(
    typeNaming = JsonNaming { fullName => fullName.drop(fullName.lastIndexOf('.') + 1) }
  )

  implicit val upstreamNewMessageReads = Json.reads[UpstreamNewMessage]
  implicit val upstreamMessageReadReads = Json.reads[UpstreamMessageRead]
  implicit val upstreamStartedTypingReads = Json.reads[UpstreamStartedTyping]
  implicit val upstreamStoppedTypingReads = Json.reads[UpstreamStoppedTyping]

  implicit val upstreamPingReads: Reads[UpstreamPing.type] = Json.reads[UpstreamPing.type]

  implicit val upstreamReads = Json.reads[Upstream]
}
