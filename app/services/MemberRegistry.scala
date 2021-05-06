package services

import models.Member

import java.time.Clock
import javax.inject.{Inject, Singleton}
import scala.util.Random

// TODO: it's a very ugly implementation of authentication service
@Singleton
class MemberRegistry @Inject()(clock: Clock) {

  // memberId => Member
  private val members = collection.mutable.HashMap[String, Member]()

  // token => Member
  private val sessions = collection.mutable.HashMap[String, String]()

  def join(username: String): Option[(Member, String)] = {

    val token = Random.alphanumeric.take(32).mkString("")
    val generatedmemberId = Random.alphanumeric.take(10).mkString("")

    // long synchronized block to omit race conditions, TODO fix this
    this.synchronized {
      val existingMember = members.values.find(_.nickname == username)

      if (existingMember.isDefined) {
        return None
      }

      val memberId = existingMember.map(_.memberId).getOrElse(generatedmemberId)

      val member = Member(memberId, username, Some(clock.instant.toEpochMilli))
      members(memberId) = member
      sessions(token) = memberId

      return Some((member, token))
    }
  }

  def setMemberIsAway(memberId: String): Unit = {
    this.synchronized {
      members.get(memberId).map(existingMember =>
        members(memberId) = Member(memberId, existingMember.nickname, None)
      )
    }
  }

  def findSession(token: String): Option[Member] = {
    this.synchronized {
      sessions.get(token) match {
        case Some(memberId) =>
          members.get(memberId).map(existingMember => {
            val member = Member(memberId, existingMember.nickname, Some(System.currentTimeMillis()))
            members(memberId) = member
            member
          })
        case _ =>
          None
      }
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
          members -= member.memberId
          sessions -= token

          member.memberId
        }
    }
  }
}
