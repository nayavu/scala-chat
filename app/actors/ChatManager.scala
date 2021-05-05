package actors

import akka.actor.{Actor, ActorRef}
import models.{ChatMessage, Member}
import play.api.libs.json.Json

import scala.collection.mutable

class ChatManager extends Actor {
  import ChatManager._

  private def logger = play.api.Logger(getClass)

  private val memberActors = mutable.Map.empty[String, ActorRef]

  override def receive: Receive = {
    case MemberConnected(member, memberActor) =>
      memberActors.values.foreach(_ ! ChatActor.Outgoing("MEMBER_CONNECTED", Json.toJson(member)))
      memberActors(member.userId) = memberActor

    case MemberDisconnected(userId) =>
      memberActors -= userId
      memberActors.values.foreach(_ ! ChatActor.Outgoing("MEMBER_DISCONNECTED", Json.obj("userId" -> userId)))

    case NewMessage(msg) =>
      memberActors.get(msg.recipientId).foreach(_ ! ChatActor.Outgoing("NEW_MESSAGE", Json.toJson(msg)))

    case MemberStartedTyping(senderId, recipientId) =>
      val data = Json.obj("senderId" -> senderId, "recipientId" -> recipientId)
      memberActors.get(recipientId).foreach(_ ! ChatActor.Outgoing("MEMBER_START_TYPING", data))

    case MemberStoppedTyping(senderId, recipientId) =>
      val data = Json.obj("senderId" -> senderId, "recipientId" -> recipientId)
      memberActors.get(recipientId).foreach(_ ! ChatActor.Outgoing("MEMBER_STOPPED_TYPING", data))

    case m => logger.warn(s"Unhandled message ${m}")
  }
}

object ChatManager {
  case class MemberConnected(member: Member, memberActor: ActorRef)
  case class MemberDisconnected(userId: String)
  case class MemberStartedTyping(senderId: String, recipientId: String)
  case class MemberStoppedTyping(senderId: String, recipientId: String)
  case class NewMessage(chatMessage: ChatMessage)
}