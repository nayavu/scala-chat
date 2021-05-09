package services

import models.{Member, MemberSession}

import java.time.Clock
import javax.inject.{Inject, Singleton}
import scala.concurrent.{ExecutionContext, Future}
import scala.util.Random

@Singleton
class MemberRegistry @Inject()(clock: Clock) {

  // memberId => Member
  private val members = collection.mutable.HashMap[String, Member]()

  // nickname => memberId
  private val nicknames = collection.mutable.HashMap[String, String]()

  // session token => memberId
  private val sessions = collection.mutable.HashMap[String, String]()

  def join(nickname: String)(implicit ec: ExecutionContext): Future[Option[MemberSession]] = {
    Future {
      val token = Random.alphanumeric.take(32).mkString("")
      val memberId = Random.alphanumeric.take(10).mkString("")

      // synchronize all 3 maps to guarantee atomicity
      this.synchronized {
        nicknames.get(nickname) match {
          case Some(_) =>
            // member already joined - cannot join again
            None

          case None =>
            nicknames(nickname) = memberId
            sessions(token) = memberId

            val member = Member(memberId, nickname, Some(clock.instant.toEpochMilli))
            members(memberId) = member

            Some(MemberSession(member, token))
        }
      }
    }
  }

  def setMemberIsAway(memberId: String)(implicit ec: ExecutionContext): Future[Unit] = {
    Future {
      this.synchronized {
        members.get(memberId).map(member =>
          members(memberId) = Member(memberId, member.nickname, None)
        )
      }
    }
  }

  def checkSession(token: String)(implicit ec: ExecutionContext): Future[Option[Member]] = {
    Future {
      this.synchronized {
        sessions.get(token) match {
          case Some(memberId) =>
            val member = members(memberId).copy(onlineSince = Some(System.currentTimeMillis()))
            members(memberId) = member
            Some(member)
          case _ =>
            None
        }
      }
    }
  }

  def listMembers()(implicit ec: ExecutionContext): Future[Seq[Member]] = {
    Future {
      this.synchronized {
        this.members.values.toSeq
      }
    }
  }

  def leave(memberId: String, token: String)(implicit ec: ExecutionContext): Future[Option[Member]] = {
    Future {
      this.synchronized {
        members.remove(memberId) match {
          case Some(member) =>
            nicknames -= member.nickname
            sessions -= token

            Some(member)

          case _ =>
            None
        }
      }
    }
  }
}
