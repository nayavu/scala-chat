package services

import models.Member

import java.time.Clock
import javax.inject.{Inject, Singleton}
import scala.util.Random

// TODO: it's a very ugly implementation of authentication service
// it contains Java-style crap and lots of locks
@Singleton
class AuthenticationService @Inject()(clock: Clock) {

  // nickname => Member
  private val members = collection.mutable.HashMap[String, Member]()

  // token => Member
  private val sessions = collection.mutable.HashMap[String, Member]()

  def login(username: String): Option[(Member, String)] = {

    val token = Random.alphanumeric.take(32).mkString("")

    this.synchronized {
      val existingMember = members.get(username)

      if (existingMember.map(_.onlineSince).isDefined) {
        return None
      }

      val userId = existingMember.map(_.userId).getOrElse(username)

      val member = Member(userId, username, Some(clock.instant.toEpochMilli))
      members(username) = member

      sessions(token) = member

      return Some((member, token))
    }
  }

  def findSession(token: String): Option[Member] = {
    this.synchronized {
      sessions.get(token)
    }
  }

  def listMembers(): Seq[Member] = {
    this.synchronized {
      this.members.values.toSeq
    }
  }

  def logout(token: String): Boolean = {
    this.synchronized {
      val member = sessions.get(token)

      if (member.isEmpty) {
        return false
      }

      val nickname = member.map(_.nickname).get
      members(nickname) = members(nickname).copy(onlineSince = None)

      sessions -= token

      true
    }
  }
}
