package models.events

import play.api.libs.functional.syntax.toFunctionalBuilderOps
import play.api.libs.json.{JsPath, JsValue, Reads}

case class Incoming(typ: String, data: JsValue)

object Incoming {
  implicit val incomingReads: Reads[Incoming] = (
    (JsPath \ "type").read[String] and
      (JsPath \ "data").read[JsValue]
  )(Incoming.apply _)
}
