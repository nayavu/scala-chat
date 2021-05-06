package actors

import akka.actor.{Actor, ActorRef, Props}
import models.events.{Incoming, Outgoing}
import models.{ChatMessage, Member}
import play.api.libs.functional.syntax.toFunctionalBuilderOps
import play.api.libs.json._

class ChatActor(out: ActorRef, manager: ActorRef, member: Member) extends Actor {

  import ChatActor._

  private def logger = play.api.Logger(getClass)

  manager ! ChatManager.MemberConnected(member, self)

  override def postStop(): Unit = {
    manager ! ChatManager.MemberDisconnected(member.userId)
  }

  override def receive: Receive = {
    case outgoing: Outgoing => out ! outgoing

    case incoming: Incoming => incoming.typ match {
      case "SEND_MESSAGE" =>
        logger.info(s"Incoming SEND_MESSAGE event: ${incoming}")
        val event = incoming.data.as[SendMessageEvent]
        val chatMessage = ChatMessage(
          messageId = event.messageId,
          senderId = event.senderId,
          recipientId = event.recipientId,
          message = event.message,
          timestamp = System.currentTimeMillis(),
          delivered = true
        )

        out ! Outgoing(
          "MESSAGE_DELIVERED",
          // TODO should be implicit writer, check why not working without (messageDeliveredWrites)
          Json.toJson(MessageDeliveredEvent(chatMessage.messageId, chatMessage.senderId, chatMessage.recipientId, chatMessage.timestamp))(messageDeliveredWrites)
        )

        manager ! ChatManager.NewMessage(chatMessage)

      case "MEMBER_STARTED_TYPING" =>
        logger.info(s"Incoming MEMBER_STARTED_TYPING event: ${incoming}")
        val event = incoming.data.as[MemberStartedTypingEvent]
        manager ! ChatManager.MemberStartedTyping(event.senderId, event.recipientId)

      case "MEMBER_STOPPED_TYPING" =>
        logger.info(s"Incoming MEMBER_STOPPED_TYPING event: ${incoming}")
        val event = incoming.data.as[MemberStoppedTypingEvent]
        manager ! ChatManager.MemberStoppedTyping(event.senderId, event.recipientId)
    }
    case m => logger.warn(s"Unhandled message ${m}")
  }
}

object ChatActor {
  def props(out: ActorRef, manager: ActorRef, member: Member): Props =
    Props(new ChatActor(out, manager, member))

  // incoming events
  // Client sent message to the server
  case class SendMessageEvent(messageId: String, senderId: String, recipientId: String, message: String)

  // outgoing events
  // Server sends message to the client
  case class NewMessageEvent(chatMessage: ChatMessage)
  case class MessageDeliveredEvent(messageId: String, senderId: String, recipientId: String, timestamp: Long)

  // both incoming and outgoing
  case class MemberStartedTypingEvent(senderId: String, recipientId: String)
  case class MemberStoppedTypingEvent(senderId: String, recipientId: String)

  implicit val sendMessageEventReads: Reads[SendMessageEvent] = (
    (JsPath \ "messageId").read[String] and
      (JsPath \ "senderId").read[String] and
      (JsPath \ "recipientId").read[String] and
      (JsPath \ "message").read[String]
  ) (SendMessageEvent.apply _)

  implicit val memberStartedTypingEventReads: Reads[MemberStartedTypingEvent] = (
    (JsPath \ "senderId").read[String] and
      (JsPath \ "recipientId").read[String]
  ) (MemberStartedTypingEvent.apply _)

  implicit val memberStoppedTypingEventReads: Reads[MemberStoppedTypingEvent] = (
    (JsPath \ "senderId").read[String] and
      (JsPath \ "recipientId").read[String]
  )(MemberStoppedTypingEvent.apply _)

  implicit val messageDeliveredWrites = new Writes[MessageDeliveredEvent] {
    def writes(event: MessageDeliveredEvent): JsValue = {
      Json.obj(
        "messageId" -> event.messageId,
        "recipientId" -> event.recipientId,
        "timestamp" -> event.timestamp
      )
    }
  }
}
