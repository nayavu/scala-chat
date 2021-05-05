package actors

import akka.actor.{Actor, ActorRef, Props}
import models.ChatMessage
import play.api.libs.json.Json

class ChatActor(out: ActorRef, manager: ActorRef, userId: String) extends Actor {

  manager ! ChatManager.MemberConnected(userId, self)

  import ChatActor._

  override def receive: Receive = {
    case SendMessage(msg) => out ! Json.toJson(msg)
    case ConfirmDelivery(msg) => out ! Json.obj(
      "messageId" -> msg.messageId,
      "recipientId" -> msg.recipientId,
      "timestamp" -> msg.timestamp
    )
  }
}

object ChatActor {
  def props(out: ActorRef, manager: ActorRef, userId: String): Props = Props(new ChatActor(out, manager, userId))

  case class SendMessage(msg: ChatMessage)
  case class ConfirmDelivery(msg: ChatMessage)
}
