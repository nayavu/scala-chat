package controllers

import actors.{ChatActor, ChatManager}
import akka.NotUsed
import akka.actor.{ActorSystem, Props}
import akka.stream.Materializer
import akka.stream.scaladsl.Flow
import models.Member
import play.api.Configuration
import play.api.libs.json.{JsValue, Json}
import play.api.libs.streams.ActorFlow
import play.api.mvc.{BaseController, ControllerComponents, RequestHeader, WebSocket}
import services.AuthenticationService

import javax.inject.Inject
import scala.concurrent.{ExecutionContext, Future}

class ChatSocketController @Inject()(val controllerComponents: ControllerComponents, val configuration: Configuration, authenticationService: AuthenticationService)
                                    (implicit ec: ExecutionContext, system: ActorSystem, mat: Materializer) extends BaseController
  with WebSocketSameOriginCheck {

  val manager = system.actorOf(Props[ChatManager], "ChatManager")

  private def logger = play.api.Logger(getClass)

  def chatSocket: WebSocket = WebSocket.acceptOrResult[JsValue, JsValue] {
    case request if sameOriginCheck(request) => {
      authenticationCheck(request) match {
        case member: Some[Member] => Future.successful {
          Right(
            ActorFlow.actorRef[JsValue, JsValue] { out =>
              ChatActor.props(out, manager, member.get.userId)
            }
          )
        }
          
        case _ => Future.successful {
          Left(Forbidden("forbidden"))
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
    println(rh.headers)
    rh.headers.get("Authorization")
      .flatMap(authenticationService.findSession)
  }
}


