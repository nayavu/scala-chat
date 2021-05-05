package models

import play.api.libs.functional.syntax.toFunctionalBuilderOps
import play.api.libs.json.{JsPath, JsValue, Json, Reads, Writes}

case class WebSocketEvent(typ: String, data: JsValue)

object WebSocketEvent {

}
