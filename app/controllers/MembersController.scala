package controllers

import play.api.libs.json.Json
import play.api.mvc.{BaseController, ControllerComponents}
import services.AuthenticationService

import javax.inject.{Inject, Singleton}

@Singleton
class MembersController @Inject()(val controllerComponents: ControllerComponents, authenticationService: AuthenticationService) extends BaseController {

  def getMembers() = Action { implicit request =>
    request.headers.get("Authorization")
      .map(token => {
        authenticationService.findSession(token) match {
          case Some(member) =>
            Ok(Json.toJson(authenticationService.listMembers().filter(_ != member)))
          case None =>
            Unauthorized
        }
      })
      .getOrElse(Unauthorized)
  }
}
