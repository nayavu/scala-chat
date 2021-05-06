package controllers

import actors.ChatActor
import akka.actor.{ActorRef, ActorSystem}
import akka.stream.Materializer
import models.Member
import models.events.{Downstream, Upstream}
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

  import models.events.Upstream._, models.events.Downstream._

  implicit val messageFlowTransformer = MessageFlowTransformer.jsonMessageFlowTransformer[Upstream, Downstream]

  private def logger = play.api.Logger(getClass)

  def chatSocket: WebSocket = WebSocket.acceptOrResult[Upstream, Downstream] {
    case request if sameOriginCheck(request) =>
      authenticationCheck(request) match {
        case Some(member) => Future.successful {
          logger.info(s"Chat socket for member ${member.memberId} connected")
          Right(
            ActorFlow.actorRef[Upstream, Downstream] { out =>
              ChatActor.props(out, chatManager, member)
            }
          )
        }

        case _ => Future.successful {
          logger.warn("Could not establish chat socket connection - authentication failed")
          Left(Forbidden("Authentication failed"))
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


