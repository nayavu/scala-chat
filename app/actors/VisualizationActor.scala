package actors

import akka.actor.{Actor, ActorRef, Props}
import models.events.Outgoing

class VisualizationActor(out: ActorRef, manager: ActorRef, id: String) extends Actor {
  manager ! VisualizationManager.ClientConnected(id, self)

  override def postStop(): Unit = {
    manager ! ChatManager.MemberDisconnected(id)
  }

  override def receive: Receive = {
    case outgoing: Outgoing => out ! outgoing
  }
}

object VisualizationActor {
  def props(out: ActorRef, manager: ActorRef, id: String): Props = Props(new VisualizationActor(out, manager, id))
}
