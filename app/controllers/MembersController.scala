package controllers

import play.api.libs.json.Json
import play.api.mvc.{BaseController, ControllerComponents}
import services.MemberRegistry

import javax.inject.{Inject, Singleton}

@Singleton
class MembersController @Inject()(val controllerComponents: ControllerComponents,
                                  memberRegistry: MemberRegistry
                                 ) extends BaseController {

  def getMembers() = Action { implicit request =>
    request.headers.get("Authorization")
      .map(token => {
        memberRegistry.findSession(token) match {
          case Some(member) =>
            Ok(Json.toJson(memberRegistry.listMembers().filter(_.userId != member.userId)))
          case None =>
            Unauthorized
        }
      })
      .getOrElse(Unauthorized)
  }
}
