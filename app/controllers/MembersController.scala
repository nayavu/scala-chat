package controllers

import controllers.helpers.SessionRefiner
import play.api.libs.json.Json
import play.api.mvc.{BaseController, ControllerComponents}
import services.{MemberRegistry, ServiceExecutionContext}

import javax.inject.{Inject, Singleton}

@Singleton
class MembersController @Inject()(val controllerComponents: ControllerComponents,
                                  sessionRefiner: SessionRefiner,
                                  memberRegistry: MemberRegistry,
                                 )
                                 (implicit repositoryExecutionContext: ServiceExecutionContext)
  extends BaseController {

  def getMembers() = Action.andThen(sessionRefiner).async {
    memberRegistry.listMembers()
      .map { members => Ok(Json.toJson(members)) }
  }
}
