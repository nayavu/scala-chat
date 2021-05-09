import actors.ChatManager
import com.google.inject.AbstractModule
import play.api.libs.concurrent.AkkaGuiceSupport
import services.{ServiceExecutionContext, ServiceExecutionContextImpl}

import java.time.Clock

class Module extends AbstractModule with AkkaGuiceSupport {

  override def configure() = {
    // Use the system clock as the default implementation of Clock
    bind(classOf[Clock]).toInstance(Clock.systemDefaultZone)
    bindActor[ChatManager]("ChatManager")
  }
}
