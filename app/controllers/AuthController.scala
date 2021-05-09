package controllers

import actors.ChatManager
import akka.actor.ActorRef
import models.Member
import play.api.libs.json._
import play.api.mvc.{BaseController, ControllerComponents, Request, Result}
import play.api.{Configuration, Logging}
import services.{MemberRegistry, ServiceExecutionContext}

import javax.inject.{Inject, Named, Singleton}
import scala.concurrent.Future

case class JoinRequest(nickname: String)

case class JoinResponse(member: Member, sessionToken: String, chatSocketUrl: String)

@Singleton
class AuthController @Inject()(val controllerComponents: ControllerComponents,
                               val configuration: Configuration,
                               memberRegistry: MemberRegistry,
                               sessionRefiner: SessionRefiner,
                               @Named("ChatManager") chatManager: ActorRef
                              )
                              (implicit executionContext: ServiceExecutionContext)
  extends BaseController with Logging {

  import ErrorMessage._

  implicit val joinRequestReads: Reads[JoinRequest] = Json.reads[JoinRequest]
  implicit val joinResponseWrites: Writes[JoinResponse] = Json.writes[JoinResponse]

  private val websocketHost = configuration.get[String]("app.websockets.host")

  def join() = Action(parse.json).async { request =>
    parseJsonBody[JoinRequest](request) { joinRequest =>
      memberRegistry.join(joinRequest.nickname)
        .map {
          case Some(memberSession) =>
            logger.info(s"Member ${joinRequest.nickname} joined")

            Ok(Json.toJson(JoinResponse(memberSession.member, memberSession.token, generateChatSocketUrl)))
          case _ =>
            BadRequest(Json.toJson(ErrorMessage(s"Name '${joinRequest.nickname}' is already taken")))
        }
    }
  }

  def leave() = Action.andThen(sessionRefiner).async { memberRequest =>
    val session = memberRequest.memberSession
    memberRegistry.leave(session.member.memberId, session.token)
      .map {
        case Some(member) =>
          chatManager ! ChatManager.MemberLeft(member.memberId)

          logger.info(s"Member ${member.nickname} left")

          NoContent
        case _ =>
          Unauthorized(Json.toJson(ErrorMessage("Invalid session")))
      }
  }

  private def parseJsonBody[R](request: Request[JsValue])(block: R => Future[Result])(implicit reads: Reads[R]): Future[Result] = {
    request.body.validate[R](reads).fold(
      valid = block,
      invalid = e => {
        Future {
          logger.error(s"Could not parse JSON body: ${e}")
          BadRequest(Json.toJson(ErrorMessage("Could not parse JSON body")))
        }
      }
    )
  }

  private def generateChatSocketUrl: String = {
    s"ws://${websocketHost}${routes.ChatSocketController.chatSocket().url}"
  }
}
