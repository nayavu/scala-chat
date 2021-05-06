package controllers

import actors.{ChatActor, VisualizationActor}
import akka.actor.{ActorRef, ActorSystem}
import akka.stream.Materializer
import models.Member
import models.events.{Incoming, Outgoing}
import play.api.Configuration
import play.api.libs.streams.ActorFlow
import play.api.mvc.{BaseController, ControllerComponents, RequestHeader, WebSocket}
import play.api.mvc.WebSocket.MessageFlowTransformer
import services.MemberRegistry

import javax.inject.{Inject, Named}
import scala.concurrent.{ExecutionContext, Future}

class VisualizationSocketController @Inject()(val controllerComponents: ControllerComponents,
                                     @Named("VisualizationManager") visualizationManager: ActorRef)
                                    (implicit ec: ExecutionContext, system: ActorSystem, mat: Materializer) extends BaseController {

  implicit val messageFlowTransformer = MessageFlowTransformer.jsonMessageFlowTransformer[String, Outgoing]

  private def logger = play.api.Logger(getClass)

  def webSocket: WebSocket = WebSocket.accept[String, Outgoing] { socket =>
    ActorFlow.actorRef[String, Outgoing] { out =>
      VisualizationActor.props(out, visualizationManager, socket.id.toString)
    }
  }
}


