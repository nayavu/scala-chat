package controllers

import actors.ChatManager
import akka.actor.ActorRef
import models.Member
import play.api.{Configuration, Logging}
import play.api.libs.json._
import play.api.mvc.{BaseController, ControllerComponents, Request, Result}
import services.MemberRegistry

import javax.inject.{Inject, Named, Singleton}
import scala.concurrent.ExecutionContext

case class LoginRequest(username: String)

object LoginRequest {
  implicit val loginRequestReads: Reads[LoginRequest] =
    (JsPath \ "username").read[String].map(new LoginRequest(_))
}

case class LoginResponse(member: Member, token: String, chatSocketUrl: String, visualizationSockerUrl: String)

object LoginResponse {
  implicit val recordWrites = new Writes[LoginResponse] {
    def writes(loginResponse: LoginResponse): JsValue = {
      Json.obj(
        "member" -> loginResponse.member,
        "token" -> loginResponse.token,
        "chatSocketUrl" -> loginResponse.chatSocketUrl,
        "visualizationSockerUrl" -> loginResponse.visualizationSockerUrl,
      )
    }
  }
}

@Singleton
class AuthController @Inject()(val controllerComponents: ControllerComponents,
                               val configuration: Configuration,
                               memberRegistry: MemberRegistry,
                               @Named("ChatManager") chatManager: ActorRef
                              )
                              (implicit executionContext: ExecutionContext) extends BaseController with Logging {

  import LoginRequest._
  import LoginResponse._

  private val websocketHost = configuration.get[String]("app.websockets.host")

  def login() = Action(parse.json) { request =>
    parseJsonBody[LoginRequest](request) { loginRequest =>
      memberRegistry.join(loginRequest.username)
        .map(memberWithToken => {
          val (member, token) = memberWithToken
          logger.info(s"User ${loginRequest.username} logged in")
          Ok(Json.toJson(LoginResponse(member, token, generateChatSocketUrl, generateVisualizationSocketUrl)))
        })
        .getOrElse(Unauthorized(errorMessage(s"User ${loginRequest.username} already logged in")))
    }
  }

  def logout() = Action { request =>

    request.headers.get("Authorization")
      .map(token => {
        memberRegistry.leave(token) match {
          case Some(userId) =>
            chatManager ! ChatManager.MemberLeft(userId)
            NoContent
          case _ =>
            Unauthorized
        }
      })
      .getOrElse(Unauthorized)
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
    s"ws://${websocketHost}${routes.ChatSocketController.webSocket().url}"
  }

  private def generateVisualizationSocketUrl: String = {
    s"ws://${websocketHost}${routes.VisualizationSocketController.webSocket().url}"
  }
}
