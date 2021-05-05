package models

import play.api.libs.json.{JsValue, Json, Writes}

import java.time.Instant

case class Member(userId: String, nickname: String, onlineSince: Instant)

object Member {
  implicit val recordWrites = new Writes[Member] {
    def writes(member: Member): JsValue = {
      Json.obj(
        "userId" -> member.userId,
        "nickname" -> member.nickname,
        "onlineSince" -> member.onlineSince.toEpochMilli
      )
    }
  }
}
