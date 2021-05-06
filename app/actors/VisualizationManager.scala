package actors

import akka.actor.{Actor, ActorRef}
import models.events.Outgoing
import play.api.libs.json.{JsValue, Json}

import scala.collection.mutable

class VisualizationManager extends Actor {
  import VisualizationManager._

  private def logger = play.api.Logger(getClass)

  private val actors = mutable.Map.empty[String, ActorRef]

  private def broadcast(messageType: String, messageBody: JsValue): Unit = {
    actors.values.foreach(_ ! Outgoing(messageType, messageBody))
  }

  override def receive: Receive = {
    case ClientConnected(id, actor) =>
      actors(id) = actor

    case ClientDisconnected(id) =>
      actors -= id

    case MemberConnected(userId) =>
      broadcast("MEMBER_CONNECTED", Json.obj("userId" -> userId))

    case MemberDisconnected(userId) =>
      broadcast("MEMBER_DISCONNECTED", Json.obj("userId" -> userId))

    case MemberLeft(userId) =>
      broadcast("MEMBER_LEFT", Json.obj("userId" -> userId))

    case MemberStartedTyping(senderId, recipientId) =>
      broadcast("MEMBER_STARTED_TYPING", Json.obj("senderId" -> senderId, "recipientId" -> recipientId))

    case MemberStoppedTyping(senderId, recipientId) =>
      broadcast("MEMBER_STOPPED_TYPING", Json.obj("senderId" -> senderId, "recipientId" -> recipientId))

    case NewMessage(senderId, recipientId) =>
      broadcast("NEW_MESSAGE", Json.obj("senderId" -> senderId, "recipientId" -> recipientId))

    case m => logger.warn(s"Unhandled message ${m}")
  }
}

object VisualizationManager {
  case class ClientConnected(id: String, actor: ActorRef)
  case class ClientDisconnected(id: String)

  case class MemberConnected(userId: String)
  case class MemberDisconnected(userId: String)
  case class MemberLeft(userId: String)
  case class MemberStartedTyping(senderId: String, recipientId: String)
  case class MemberStoppedTyping(senderId: String, recipientId: String)
  case class NewMessage(senderId: String, recipientId: String)

}
