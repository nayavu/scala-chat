package actors

import akka.actor.{Actor, ActorRef, Props}
import models.{ChatMessage,Member}
import models.events._

class ChatActor(out: ActorRef, manager: ActorRef, member: Member) extends Actor {

  private def logger = play.api.Logger(getClass)

  manager ! ChatManager.MemberJoined(member, self)

  override def postStop(): Unit = {
    manager ! ChatManager.MemberIsAway(member.memberId)
  }

  override def receive: Receive = {
    case event: Downstream => out ! event

    case event: UpstreamNewMessage =>
      logger.info(s"Received ${event}")

      val chatMessage = ChatMessage(
        messageId = event.messageId,
        senderId = member.memberId,
        recipientId = event.recipientId,
        message = event.message,
        timestamp = System.currentTimeMillis()
      )

      manager ! ChatManager.NewMessage(chatMessage)

    case event: UpstreamMessageRead =>
      logger.info(s"Received ${event}")

      manager ! ChatManager.MessageRead(event.messageId, event.senderId, member.memberId)

    case event: UpstreamStartedTyping =>
      logger.info(s"Received ${event}")

      manager ! ChatManager.MemberStartedTyping(member.memberId, event.memberId)

    case event: UpstreamStoppedTyping =>
      logger.info(s"Received ${event}")

      manager ! ChatManager.MemberStoppedTyping(member.memberId, event.memberId)

    case event: UpstreamPing.type =>
      logger.info(s"Received ${event}")

      out ! DownstreamPong

    case m =>
      logger.warn(s"Unhandled message ${m}")
  }
}

object ChatActor {
  def props(out: ActorRef, manager: ActorRef, member: Member): Props =
    Props(new ChatActor(out, manager, member))
}
