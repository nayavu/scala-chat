package controllers

import actors.ChatManager
import akka.actor.ActorRef
import models.Member
import play.api.{Configuration, Logging}
import play.api.libs.json._
import play.api.mvc.{Action, AnyContent, BaseController, ControllerComponents, Request, Result}
import services.MemberRegistry

import javax.inject.{Inject, Named, Singleton}
import scala.concurrent.ExecutionContext

case class JoinRequest(nickname: String)
case class JoinResponse(member: Member, sessionToken: String, chatSocketUrl: String)

@Singleton
class AuthController @Inject()(val controllerComponents: ControllerComponents,
                               val configuration: Configuration,
                               memberRegistry: MemberRegistry,
                               @Named("ChatManager") chatManager: ActorRef
                              )
                              (implicit executionContext: ExecutionContext) extends BaseController with Logging {

  implicit val joinRequestReads: Reads[JoinRequest] = Json.reads[JoinRequest]
  implicit val joinResponseWrites: Writes[JoinResponse] = Json.writes[JoinResponse]

  private val websocketHost = configuration.get[String]("app.websockets.host")

  def join() = Action(parse.json) { request =>
    parseJsonBody[JoinRequest](request) { joinRequest =>
      memberRegistry.join(joinRequest.nickname)
        .map(memberWithTokens => {
          val (member, token) = memberWithTokens
          logger.info(s"Member ${joinRequest.nickname} joined")
          Ok(Json.toJson(JoinResponse(member, token, generateChatSocketUrl)))
        })
        .getOrElse(Unauthorized(errorMessage(s"Name '${joinRequest.nickname}' is already taken")))
    }
  }

  def leave() = Action { request =>
    request.headers.get("Authorization")
      .map(token => {
        memberRegistry.leave(token) match {
          case Some(userId) =>
            chatManager ! ChatManager.MemberLeft(userId)
            NoContent
          case _ =>
            Unauthorized(errorMessage(s"Invalid session"))
        }
      })
      .getOrElse(Unauthorized(errorMessage(s"No session token")))
  }

  private def parseJsonBody[R](request: Request[JsValue])(block: R => Result)(implicit reads : Reads[R]): Result = {
    request.body.validate[R](reads).fold(
      valid = block,
      invalid = e => {
        logger.error(s"Could not parse JSON body: ${e}")
        BadRequest(errorMessage("Could not parse JSON body"))
      }
    )
  }

  private def errorMessage(msg: String): JsValue = {
    Json.toJson(Map("message" -> msg))
  }

  private def generateChatSocketUrl: String = {
    s"ws://${websocketHost}${routes.ChatSocketController.chatSocket().url}"
  }
}
