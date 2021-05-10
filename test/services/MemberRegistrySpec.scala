package services

import akka.util.Timeout
import models.{Member, MemberSession}
import org.mockito.Mockito.when
import org.scalatest.BeforeAndAfterEach
import org.scalatestplus.mockito.MockitoSugar
import org.scalatestplus.play.PlaySpec
import play.api.test.Helpers.await

import java.time.{Clock, Instant}
import scala.concurrent.ExecutionContext
import scala.concurrent.duration.DurationInt

class MemberRegistrySpec extends PlaySpec with BeforeAndAfterEach with MockitoSugar {

  val now = System.currentTimeMillis()
  val clock = mock[Clock]
  val randomStringGenerator = mock[RandomStringGenerator]

  implicit val timeout: Timeout = 1000.millis

  implicit lazy val executionContext = ExecutionContext.global

  override def beforeEach(): Unit = {
    when(clock.instant()).thenReturn(Instant.ofEpochMilli(now))
    when(randomStringGenerator.generate(10)).thenReturn("memberId1")
    when(randomStringGenerator.generate(32)).thenReturn("token1")
  }

  "MemberRegistry.join" must {
    "allow to join member" in {
      // given
      val registry = new MemberRegistry(clock, randomStringGenerator)

      // when
      val res = await(registry.join("nickname1"))

      // then
      res mustBe Some(
        MemberSession(
          Member("memberId1", "nickname1", Some(now)),
          "token1"
        )
      )
    }

    "not allow to join user twice" in {
      // given
      val registry = new MemberRegistry(clock, randomStringGenerator)

      await(registry.join("nickname1"))

      // when
      val res = await(registry.join("nickname1"))

      res mustNot be(defined)
    }
  }

  "MemberRegistry.listMembers" must {
    "return list of members" in {
      // given
      val registry = new MemberRegistry(clock, randomStringGenerator)

      when(clock.instant()).thenReturn(Instant.ofEpochMilli(now))
      when(randomStringGenerator.generate(10)).thenReturn("memberId1")
      when(randomStringGenerator.generate(32)).thenReturn("token1")

      await(registry.join("nickname1"))

      val now2 = now + 1000
      when(clock.instant()).thenReturn(Instant.ofEpochMilli(now2))
      when(randomStringGenerator.generate(10)).thenReturn("memberId2")
      when(randomStringGenerator.generate(32)).thenReturn("token2")

      await(registry.join("nickname2"))

      // when
      val res = await(registry.listMembers())

      // then
      res must contain theSameElementsInOrderAs Seq(
        Member("memberId1", "nickname1", Some(now)),
        Member("memberId2", "nickname2", Some(now2)),
      )
    }
  }

  "MemberRegistry.setMemberIsAway" must {
    "reset onlineSince timestamp" in {
      // given
      val registry = new MemberRegistry(clock, randomStringGenerator)

      await(registry.join("nickname1"))

      // when
      await(registry.setMemberIsAway("memberId1"))

      // then
      val res = await(registry.listMembers())

      res must contain theSameElementsInOrderAs Seq(
        Member("memberId1", "nickname1", None)
      )
    }

    "ignore unknown member" in {
      // given
      val registry = new MemberRegistry(clock, randomStringGenerator)

      await(registry.join("nickname1"))

      // when
      await(registry.setMemberIsAway("memberId-UNKNOWN"))

      // then
      val res = await(registry.listMembers())

      res must contain theSameElementsInOrderAs Seq(
        Member("memberId1", "nickname1", Some(now))
      )
    }
  }

  "MemberRegistry.checkSession" must {
    "return member for known token" in {
      // given
      val registry = new MemberRegistry(clock, randomStringGenerator)

      await(registry.join("nickname1"))

      // when
      val res = await(registry.checkSession("token1"))

      // then
      res mustBe Some(Member("memberId1", "nickname1", Some(now)))
    }

    "return None for unknown token" in {
      // given
      val registry = new MemberRegistry(clock, randomStringGenerator)

      await(registry.join("nickname1"))

      // when
      val res = await(registry.checkSession("token-UNKNOWN"))

      // then
      res mustBe None
    }
  }

  "MemberRegistry.leave" must {
    "remove member" in {
      // given
      val registry = new MemberRegistry(clock, randomStringGenerator)

      await(registry.join("nickname1"))

      // when
      val res = await(registry.leave("memberId1", "token1"))

      // then
      res mustBe Some(Member("memberId1", "nickname1", Some(now)))

      await(registry.listMembers()) mustBe empty
      await(registry.checkSession("token1")) mustNot be(defined)
    }

    "ignore unknown memberId" in {
      // given
      val registry = new MemberRegistry(clock, randomStringGenerator)

      await(registry.join("nickname1"))

      // when
      val res = await(registry.leave("memberId-UNKNOWN", "token1"))

      // then
      res mustNot be(defined)

      await(registry.listMembers()) mustNot be(empty)
      await(registry.checkSession("token1")) mustBe defined
    }
  }
}
