package models

import play.api.libs.functional.syntax.toFunctionalBuilderOps
import play.api.libs.json._

import java.time.Instant

case class Member(userId: String, nickname: String, onlineSince: Option[Long])

object Member {
  implicit val recordWrites = new Writes[Member] {
    def writes(member: Member): JsValue = {
      Json.obj(
        "userId" -> member.userId,
        "nickname" -> member.nickname,
        "onlineSince" -> member.onlineSince
      )
    }
  }

  implicit val memberReads: Reads[Member] = (
    (JsPath \ "nickname").read[String] and
      (JsPath \ "nickname").read[String] and
      (JsPath \ "onlineSince").readNullable[Long]
    )(Member.apply _)
}
