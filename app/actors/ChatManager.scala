package actors

import akka.actor.{Actor, ActorRef}
import models.{ChatMessage, Member}
import play.api.libs.json.Json
import services.MemberRegistry

import javax.inject.Inject
import scala.collection.mutable

class ChatManager @Inject()(memberRegistry: MemberRegistry) extends Actor {
  import ChatManager._

  private def logger = play.api.Logger(getClass)

  private val memberActors = mutable.Map.empty[String, ActorRef]

  override def receive: Receive = {
    case MemberConnected(member, memberActor) =>
      logger.info(s"Member ${member.userId} connected")
      memberActors.values.foreach(_ ! ChatActor.Outgoing("MEMBER_CONNECTED", Json.toJson(member)))
      memberActors(member.userId) = memberActor

    case MemberDisconnected(userId) =>
      logger.info(s"Member ${userId} disconnected")
      memberActors -= userId
      memberActors.values.foreach(_ ! ChatActor.Outgoing("MEMBER_DISCONNECTED", Json.obj("userId" -> userId)))

      // TODO this is blockign call, fix this
      memberRegistry.setMemberDisconnected(userId)

    case MemberLeft(userId) =>
      logger.info(s"Member ${userId} left")
      memberActors -= userId
      memberActors.values.foreach(_ ! ChatActor.Outgoing("MEMBER_LEFT", Json.obj("userId" -> userId)))

    case NewMessage(msg) =>
      memberActors.get(msg.recipientId).foreach(_ ! ChatActor.Outgoing("NEW_MESSAGE", Json.toJson(msg)))

    case MemberStartedTyping(senderId, recipientId) =>
      memberActors.get(recipientId).foreach(_ ! ChatActor.Outgoing("MEMBER_STARTED_TYPING", Json.obj("userId" -> senderId)))

    case MemberStoppedTyping(senderId, recipientId) =>
      memberActors.get(recipientId).foreach(_ ! ChatActor.Outgoing("MEMBER_STOPPED_TYPING", Json.obj("userId" -> senderId)))

    case m => logger.warn(s"Unhandled message ${m}")
  }
}

object ChatManager {
  case class MemberConnected(member: Member, memberActor: ActorRef)
  case class MemberDisconnected(userId: String)
  case class MemberLeft(userId: String)
  case class MemberStartedTyping(senderId: String, recipientId: String)
  case class MemberStoppedTyping(senderId: String, recipientId: String)
  case class NewMessage(chatMessage: ChatMessage)
}
