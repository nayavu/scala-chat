package controllers

import actors.{ChatActor, ChatManager}
import akka.actor.{ActorSystem, Props}
import akka.stream.Materializer
import models.Member
import play.api.Configuration
import play.api.libs.streams.ActorFlow
import play.api.mvc.WebSocket.MessageFlowTransformer
import play.api.mvc.{BaseController, ControllerComponents, RequestHeader, WebSocket}
import services.AuthenticationService

import javax.inject.Inject
import scala.concurrent.{ExecutionContext, Future}

class ChatSocketController @Inject()(val controllerComponents: ControllerComponents, val configuration: Configuration, authenticationService: AuthenticationService)
                                    (implicit ec: ExecutionContext, system: ActorSystem, mat: Materializer) extends BaseController
  with WebSocketSameOriginCheck {

  val manager = system.actorOf(Props[ChatManager], "ChatManager")

  implicit val messageFlowTransformer = MessageFlowTransformer.jsonMessageFlowTransformer[ChatActor.Incoming, ChatActor.Outgoing]

  private def logger = play.api.Logger(getClass)

  def chatSocket: WebSocket = WebSocket.acceptOrResult[ChatActor.Incoming, ChatActor.Outgoing] {
    case request if sameOriginCheck(request) => {
      authenticationCheck(request) match {
        case Some(member) => Future.successful {
          Right(
            ActorFlow.actorRef[ChatActor.Incoming, ChatActor.Outgoing] { out =>
              ChatActor.props(out, manager, member)
            }
          )
        }

        case _ => Future.successful {
          Left(Forbidden("Authentication failed"))
        }
      }
    }

    case rejected =>
      logger.error(s"Request ${rejected} failed same origin check")
      Future.successful {
        Left(Forbidden("forbidden"))
      }
  }

  private def authenticationCheck(rh: RequestHeader): Option[Member] = {
    // the simplest possible authentication via protocol Sec-WebSocket-Protocol
    rh.headers.get("Sec-WebSocket-Protocol")
      .flatMap(authenticationService.findSession)
  }
}


