package controllers

import akka.actor.ActorSystem
import play.api.mvc.{BaseController, ControllerComponents}

import javax.inject.{Inject, Singleton}

@Singleton
class ChatController @Inject()(val controllerComponents: ControllerComponents, actorSystem: ActorSystem) extends BaseController {

  private val logger = play.api.Logger(getClass)

  def getMessages() = Action { implicit request =>
    ???
  }

  def getMembers() = Action { implicit request =>
    ???
  }
}
