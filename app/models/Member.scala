package models

import play.api.libs.json.{Format, Json}

case class Member(memberId: String, nickname: String, onlineSince: Option[Long])

object Member {
  implicit val memberFormat: Format[Member] = Json.format[Member]
}
