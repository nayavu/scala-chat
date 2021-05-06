package models.events

import play.api.libs.json.{JsValue, Json, Writes}

case class Outgoing(typ: String, data: JsValue)

object Outgoing {
  implicit val outgoingWrites = new Writes[Outgoing] {
    def writes(event: Outgoing): JsValue = {
      Json.obj(
        "type" -> event.typ,
        "data" -> event.data
      )
    }
  }
}
