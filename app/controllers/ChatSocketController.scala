package controllers

import actors.{ChatActor, ChatManager}
import akka.actor.{ActorRef, ActorSystem, Props}
import akka.stream.Materializer
import models.Member
import play.api.Configuration
import play.api.libs.streams.ActorFlow
import play.api.mvc.WebSocket.MessageFlowTransformer
import play.api.mvc.{BaseController, ControllerComponents, RequestHeader, WebSocket}
import services.MemberRegistry

import javax.inject.{Inject, Named}
import scala.concurrent.{ExecutionContext, Future}

class ChatSocketController @Inject()(val controllerComponents: ControllerComponents,
                                     val configuration: Configuration,
                                     memberRegistry: MemberRegistry,
                                     @Named("ChatManager") chatManager: ActorRef)
                                    (implicit ec: ExecutionContext, system: ActorSystem, mat: Materializer) extends BaseController
  with WebSocketSameOriginCheck {

  implicit val messageFlowTransformer = MessageFlowTransformer.jsonMessageFlowTransformer[ChatActor.Incoming, ChatActor.Outgoing]

  private def logger = play.api.Logger(getClass)

  def chatSocket: WebSocket = WebSocket.acceptOrResult[ChatActor.Incoming, ChatActor.Outgoing] {
    case request if sameOriginCheck(request) => {
      authenticationCheck(request) match {
        case Some(member) => Future.successful {
          logger.info(s"Chat socket for member ${member.userId} connected")
          Right(
            ActorFlow.actorRef[ChatActor.Incoming, ChatActor.Outgoing] { out =>
              ChatActor.props(out, chatManager, member)
            }
          )
        }

        case _ => Future.successful {
          logger.warn("Could not establish chat socket connection - authentication failed")
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
      .flatMap(memberRegistry.findSession)
  }
}


