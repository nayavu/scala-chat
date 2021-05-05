package controllers

import models.Member
import play.api.Logging
import play.api.libs.json._
import play.api.mvc.{BaseController, ControllerComponents, Request, Result}
import services.AuthenticationService

import javax.inject.{Inject, Singleton}
import scala.concurrent.ExecutionContext

case class LoginRequest(username: String)

object LoginRequest {
  implicit val loginRequestReads: Reads[LoginRequest] =
    (JsPath \ "username").read[String].map(new LoginRequest(_))
}

case class LoginResponse(member: Member, token: String, chatSocketUri: String)

object LoginResponse {
  implicit val recordWrites = new Writes[LoginResponse] {
    def writes(loginResponse: LoginResponse): JsValue = {
      Json.obj(
        "member" -> loginResponse.member,
        "token" -> loginResponse.token,
        "chatSocketUri" -> loginResponse.chatSocketUri
      )
    }
  }
}

@Singleton
class AuthController @Inject()(val controllerComponents: ControllerComponents, authenticationService: AuthenticationService)
                              (implicit executionContext: ExecutionContext) extends BaseController with Logging {

  import LoginRequest._
  import LoginResponse._

  def login() = Action(parse.json) { request =>
    parseJsonBody[LoginRequest](request) { loginRequest =>
      authenticationService.login(loginRequest.username)
        .map(memberWithToken => {
          val (member, token) = memberWithToken
          logger.info(s"User ${loginRequest.username} logged in")
          Ok(Json.toJson(LoginResponse(member, token, routes.ChatSocketController.chatSocket().url)))
        })
        .getOrElse(Unauthorized(errorMessage(s"User ${loginRequest.username} already logged in")))
    }
  }

  def logout() = Action { request =>

    request.headers.get("Authorization")
      .map(token => {
        if (authenticationService.logout(token)) {
          NoContent
        } else {
          Unauthorized
        }
      })
      .getOrElse(Unauthorized)
  }

  def parseJsonBody[R](request: Request[JsValue])(block: R => Result)(implicit reads : Reads[R]): Result = {
    request.body.validate[R](reads).fold(
      valid = block,
      invalid = e => {
        logger.error(s"Could not parse JSON body: ${e}")
        BadRequest(errorMessage("Could not parse JSON body"))
      }
    )
  }

  def errorMessage(msg: String): JsValue = {
    Json.toJson(Map("message" -> msg))
  }
}
