package services

import models.Member

import java.time.Clock
import javax.inject.{Inject, Singleton}
import scala.util.Random

// TODO: it's a very ugly implementation of authentication service
@Singleton
class MemberRegistry @Inject()(clock: Clock) {

  // userId => Member
  private val members = collection.mutable.HashMap[String, Member]()

  // token => Member
  private val sessions = collection.mutable.HashMap[String, String]()

  def join(username: String): Option[(Member, String)] = {

    val token = Random.alphanumeric.take(32).mkString("")
    val generatedUserId = Random.alphanumeric.take(10).mkString("")

    // long synchronized block to omit race conditions, TODO fix this
    this.synchronized {
      val existingMember = members.values.find(_.nickname == username)

      if (existingMember.isDefined) {
        return None
      }

      val userId = existingMember.map(_.userId).getOrElse(generatedUserId)

      val member = Member(userId, username, Some(clock.instant.toEpochMilli))
      members(userId) = member
      sessions(token) = userId

      return Some((member, token))
    }
  }

  def setMemberDisconnected(userId: String): Unit = {
    this.synchronized {
      members.get(userId).map(existingMember =>
        members(userId) = Member(userId, existingMember.nickname, None)
      )
    }
  }

  def findSession(token: String): Option[Member] = {
    this.synchronized {
      sessions.get(token).flatMap(members.get)
    }
  }

  def listMembers(): Seq[Member] = {
    this.synchronized {
      this.members.values.toSeq
    }
  }

  def leave(token: String): Option[String] = {
    this.synchronized {
      sessions.get(token)
        .flatMap(members.get)
        .map { member =>
          members -= member.userId
          sessions -= token

          member.userId
      }
    }
  }
}
