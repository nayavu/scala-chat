package actors

import akka.actor.{Actor, ActorRef}
import models.{Member,ChatMessage}
import models.events._
import services.MemberRegistry

import javax.inject.Inject
import scala.collection.mutable

class ChatManager @Inject()(memberRegistry: MemberRegistry) extends Actor {
  import ChatManager._

  private def logger = play.api.Logger(getClass)

  private val memberActors = mutable.Map.empty[String, ActorRef]

  override def receive: Receive = {
    case MemberJoined(member, memberActor) =>
      logger.info(s"Member ${member.memberId} joined")
      memberActors.filterKeys(_ != member.memberId)
        .values
        .foreach(_ ! DownstreamMemberJoined(member.memberId, member.nickname, member.onlineSince))

      memberActors(member.memberId) = memberActor

    case MemberIsAway(memberId) =>
      logger.info(s"Member ${memberId} is away")
      memberActors -= memberId
      memberActors.values.foreach(_ ! DownstreamMemberIsAway(memberId))

      // TODO this is blocking call, consider using actors instead of service
      memberRegistry.setMemberIsAway(memberId)

    case MemberLeft(memberId) =>
      logger.info(s"Member ${memberId} left")
      memberActors -= memberId
      memberActors.values.foreach(_ ! DownstreamMemberLeft(memberId))

    case NewMessage(msg) =>
      memberActors.get(msg.recipientId)
        .foreach(_ ! DownstreamNewMessage(msg.messageId, msg.senderId, msg.message, msg.timestamp))

      // TODO it's inefficient to send a `trace` message for senderId and recipientId because they already have this event
      memberActors.values
        .foreach(_ ! DownstreamNewMessageTrace(msg.senderId, msg.recipientId))

    case MessageRead(messageId, senderId, recipientId) =>
      memberActors.get(senderId)
        .foreach(_ ! DownstreamMessageRead(messageId, recipientId, System.currentTimeMillis()))

    case MemberStartedTyping(senderId, recipientId) =>
      memberActors.values
        .foreach(_ ! DownstreamStartedTyping(senderId, recipientId))

    case MemberStoppedTyping(senderId, recipientId) =>
      memberActors.values
        .foreach(_ ! DownstreamStoppedTyping(senderId, recipientId))

    case m => logger.warn(s"Unhandled message ${m}")
  }
}

object ChatManager {
  case class NewMessage(chatMessage: ChatMessage)
  case class MessageRead(messageId: String, senderId: String, recipientId: String)
  case class MemberStartedTyping(senderId: String, recipientId: String)
  case class MemberStoppedTyping(senderId: String, recipientId: String)
  case class MemberJoined(member: Member, memberActor: ActorRef)
  case class MemberIsAway(userId: String)
  case class MemberLeft(userId: String)
}
