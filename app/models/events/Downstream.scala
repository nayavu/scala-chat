package models.events

import play.api.libs.json.{Json, JsonConfiguration, JsonNaming, OWrites}

sealed trait Downstream

// Chat member receives a new message
final case class DownstreamNewMessage(messageId: String, senderId: String, message: String, timestamp: Long) extends Downstream

// Chat member receives a confirmation that message was read
final case class DownstreamMessageRead(messageId: String, recipientId: String, timestamp: Long) extends Downstream

// Chat member receives a notification that another member starts typing
final case class DownstreamStartedTyping(memberId: String) extends Downstream

// Chat member receives a notification that another member stops typing
final case class DownstreamStoppedTyping(memberId: String) extends Downstream

// Chat member receives a notification that another member joins the chat
final case class DownstreamMemberJoined(memberId: String, nickname: String, onlineSince: Option[Long]) extends Downstream

// Chat member receives a notification that another member is away (i.e. closed the browser)
final case class DownstreamMemberIsAway(memberId: String) extends Downstream

// Chat member receives a notification that another member leaves the chat (i.e. pressed 'Leave' button)
final case class DownstreamMemberLeft(memberId: String) extends Downstream

// Chat member receives a notification about a new message (for visualization)
final case class DownstreamNewMessageTrace(senderId: String, recipientId: String) extends Downstream

// Chat member receives a notification that one member starts typing to another one (for visualization)
final case class DownstreamStartedTypingTrace(senderId: String, recipientId: String) extends Downstream

// Chat member receives a notification that one member stops typing to another one (for visualization)
final case class DownstreamStoppedTypingTrace(senderId: String, recipientId: String) extends Downstream

// Pong
final case object DownstreamPong extends Downstream

object Downstream {

  implicit val downstreamConfiguration: JsonConfiguration = JsonConfiguration(
    typeNaming = JsonNaming { fullName => fullName.drop(fullName.lastIndexOf('.') + 1) }
  )

  implicit val downstreamNewMessageWrites: OWrites[DownstreamNewMessage] = Json.writes[DownstreamNewMessage]
  implicit val downstreamMessageReadWrites: OWrites[DownstreamMessageRead] = Json.writes[DownstreamMessageRead]
  implicit val downstreamTypingStartedWrites: OWrites[DownstreamStartedTyping] = Json.writes[DownstreamStartedTyping]
  implicit val downstreamTypingStoppedWrites: OWrites[DownstreamStoppedTyping] = Json.writes[DownstreamStoppedTyping]
  implicit val downstreamMemberJoinedWrites: OWrites[DownstreamMemberJoined] = Json.writes[DownstreamMemberJoined]
  implicit val downstreamMemberIsAwayWrites: OWrites[DownstreamMemberIsAway] = Json.writes[DownstreamMemberIsAway]
  implicit val downstreamMemberLeftWrites: OWrites[DownstreamMemberLeft] = Json.writes[DownstreamMemberLeft]
  implicit val downstreamNewMessageTraceWrites: OWrites[DownstreamNewMessageTrace] = Json.writes[DownstreamNewMessageTrace]
  implicit val downstreamTypingStartedTraceWrites: OWrites[DownstreamStartedTypingTrace] = Json.writes[DownstreamStartedTypingTrace]
  implicit val downstreamTypingStoppedTraceWrites: OWrites[DownstreamStoppedTypingTrace] = Json.writes[DownstreamStoppedTypingTrace]

  implicit val downstreamPongWrites: OWrites[DownstreamPong.type] = Json.writes[DownstreamPong.type]

  implicit val downstreamWrites: OWrites[Downstream] = Json.writes[Downstream]
}
