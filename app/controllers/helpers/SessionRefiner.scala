package controllers.helpers

import controllers.ErrorMessage
import models.MemberSession
import play.api.libs.json.Json
import play.api.mvc.Results.Unauthorized
import play.api.mvc.{ActionRefiner, Request, Result, WrappedRequest}
import services.MemberRegistry

import javax.inject.Inject
import scala.concurrent.{ExecutionContext, Future}

class MemberRequest[A](val memberSession: MemberSession, request: Request[A]) extends WrappedRequest[A](request)


class SessionRefiner @Inject()(memberRegistry: MemberRegistry)
                              (implicit val executionContext: ExecutionContext)
  extends ActionRefiner[Request, MemberRequest] {

    import ErrorMessage._

    override protected def refine[A](request: Request[A]): Future[Either[Result, MemberRequest[A]]] = {

        request.headers.get("Authorization") match {
            case Some(token) =>
                memberRegistry.checkSession(token)
                  .map {
                      case Some(member) =>
                        Right(new MemberRequest(MemberSession(member, token), request))
                      case _ =>
                        Left(Unauthorized(Json.toJson(ErrorMessage("Invalid session token"))))
                  }

            case _ =>
                Future.successful(Left(Unauthorized(Json.toJson(ErrorMessage("No session token")))))
        }
    }
}
