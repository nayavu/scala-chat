package controllers.helpers

import play.api.Configuration
import play.api.mvc.RequestHeader

import java.net.URI

trait WebSocketSameOriginCheck {

  private val logger = play.api.Logger(getClass)

  val configuration: Configuration

  private val allowedOrigins = configuration.get[Seq[String]]("app.websockets.allowedOrigins")

  /**
   * Checks that the WebSocket comes from the same origin.  This is necessary to protect
   * against Cross-Site WebSocket Hijacking as WebSocket does not implement Same Origin Policy.
   *
   * See https://tools.ietf.org/html/rfc6455#section-1.3 and
   * http://blog.dewhurstsecurity.com/2013/08/30/security-testing-html5-websockets.html
   */
  protected def sameOriginCheck(request: RequestHeader): Boolean = {
    // The Origin header is the domain the request originates from.
    // https://tools.ietf.org/html/rfc6454#section-7

    request.headers.get("Origin") match {
      case Some(originValue) if originMatches(originValue) =>
        true

      case Some(badOrigin) =>
        logger.error(s"Origin header value ${badOrigin} is not within ${allowedOrigins}")
        false

      case None =>
        logger.error("No Origin header found")
        false
    }
  }

  private def originMatches(origin: String): Boolean = {
    val originUri = URI.create(origin)
    allowedOrigins.contains(s"${originUri.getHost}:${originUri.getPort}")
  }
}
