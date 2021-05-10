package controllers

import org.scalatestplus.play.PlaySpec
import org.scalatestplus.play.guice.GuiceOneAppPerTest
import play.api.libs.json.{JsArray, JsDefined, JsNumber, JsString, Json}
import play.api.mvc.Result
import play.api.test.FakeRequest
import play.api.test.Helpers._

import scala.concurrent.Future

class FunctionalSpec extends PlaySpec with GuiceOneAppPerTest {

  def authenticateMember(nickname: String): Future[Result] = {
    val request = FakeRequest(POST, "/api/auth/join")
      .withHeaders(
        "Host" -> "localhost:9000",
        "Content-Type" -> "application/json"
      )
      .withBody(s"""{ "nickname": "$nickname" }""")

    route(app, request).get
  }

  def getMembers(token: String): Future[Result] = {
    val request = FakeRequest(GET, "/api/members")
      .withHeaders(
        "Host" -> "localhost:9000",
        "Authorization" -> token
      )

    route(app, request).get
  }

  "AuthController" should {
    "allow member to join the chat and return session details" in {
      // when
      val auth = authenticateMember("test1")

      // then
      status(auth) mustBe 200
      contentType(auth) mustBe Some("application/json")

      val authJson = contentAsJson(auth)
      (authJson \ "member" \ "memberId").isDefined mustBe true
      (authJson \ "member" \ "memberId").get mustBe a[JsString]
      (authJson \ "member" \ "nickname") mustBe JsDefined(JsString("test1"))
      (authJson \ "member" \ "onlineSince").isDefined mustBe true
      (authJson \ "member" \ "onlineSince").get mustBe a[JsNumber]

      (authJson \ "sessionToken").isDefined mustBe true
      (authJson \ "sessionToken").get mustBe a[JsString]

      (authJson \ "chatSocketUrl") mustBe JsDefined(JsString("ws://localhost:9000/ws/chat"))
    }

    "not allow member to join the chat if there is already a member with the same nickname" in {
      // given
      await(authenticateMember("test1"))

      // when
      val auth = authenticateMember("test1")

      status(auth) mustBe 409
      contentType(auth) mustBe Some("application/json")

      contentAsJson(auth) mustBe Json.obj(
        "message" -> "Name 'test1' is already taken"
      )
    }

    "allow member to leave the chat" in {
      // given
      val auth = authenticateMember("test1")
      val token = (contentAsJson(auth) \ "sessionToken").get.as[String]

      // when
      val request = FakeRequest(POST, "/api/auth/leave")
        .withHeaders(
          "Host" -> "localhost:9000",
          "Content-Type" -> "application/json",
          "Authorization" -> token
        )

      val res = route(app, request).get

      // then
      status(res) mustBe 204
    }

    "return 401 if no token passed while leaving the chat" in {
      // given

      // when
      val request = FakeRequest(POST, "/api/auth/leave")
        .withHeaders(
          "Host" -> "localhost:9000",
          "Content-Type" -> "application/json"
        )

      val res = route(app, request).get

      // then
      status(res) mustBe 401
    }


    "return 401 if token is invalid while leaving the chat" in {
      // given

      // when
      val request = FakeRequest(POST, "/api/auth/leave")
        .withHeaders(
          "Host" -> "localhost:9000",
          "Content-Type" -> "application/json",
          "Authorization" -> "some token"
        )

      val res = route(app, request).get

      // then
      status(res) mustBe 401
    }
  }

  "MemberController" should {
    "return list of members" in {
      // when
      val auth1 = authenticateMember("test1")
      val token = (contentAsJson(auth1) \ "sessionToken").get.as[String]

      contentAsJson(authenticateMember("test2"))

      // when
      val res = getMembers(token)

      status(res) mustBe 200
      contentType(res) mustBe Some("application/json")

      val membersJson = contentAsJson(res)
      membersJson mustBe a[JsArray]
      (membersJson(0) \ "memberId").isDefined mustBe true
      (membersJson(0) \ "nickname") mustBe JsDefined(JsString("test1"))
      (membersJson(0) \ "onlineSince").isDefined mustBe true

      (membersJson(1) \ "memberId").isDefined mustBe true
      (membersJson(1) \ "nickname") mustBe JsDefined(JsString("test2"))
      (membersJson(1) \ "onlineSince").isDefined mustBe true
    }

    "return 403 if no token passed while getting list of members" in {
      // given

      // when
      val request = FakeRequest(GET, "/api/members")
        .withHeaders(
          "Host" -> "localhost:9000"
        )

      val res = route(app, request).get

      // then
      status(res) mustBe 401
    }

    "return 401 if token is invalid while getting list of members" in {
      // given

      // when
      val res = getMembers("invalid token")

      // then
      status(res) mustBe 401
    }
  }

  // TODO : websocket tests
}
