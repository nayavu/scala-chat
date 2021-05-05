package actors

import akka.actor.{Actor, ActorRef}
import models.ChatMessage

import scala.collection.mutable

class ChatManager extends Actor {
  import ChatManager._

  private val memberActors = mutable.Map.empty[String, ActorRef]

  override def receive: Receive = {
    case MemberConnected(userId, memberActor) => memberActors(userId) = memberActor
    case MemberDisconnected(userId) => memberActors -= userId
    case Message(msg) => {
      val deliveredMessage = msg.copy(timestamp = System.currentTimeMillis(), delivered = true)

      memberActors.get(msg.recipientId)
        .foreach(_ ! ChatActor.SendMessage(deliveredMessage))

      memberActors.get(msg.senderId)
        .foreach(_ ! ChatActor.ConfirmDelivery(deliveredMessage))
    }
  }
}

object ChatManager {
  case class MemberConnected(userId: String, memberActor: ActorRef)
  case class MemberDisconnected(userId: String)
  case class Message(msg: ChatMessage)
}
