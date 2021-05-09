package controllers

import play.api.libs.json.{Json, Writes}

case class ErrorMessage(message: String)

object ErrorMessage {
  implicit val errorMessageWrites: Writes[ErrorMessage] = Json.writes[ErrorMessage]
}
