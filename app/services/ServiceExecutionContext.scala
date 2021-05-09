package services

import akka.actor.ActorSystem
import com.google.inject.ImplementedBy
import play.api.libs.concurrent.CustomExecutionContext

import javax.inject.Inject
import scala.concurrent.ExecutionContext

@ImplementedBy(classOf[ServiceExecutionContextImpl])
trait ServiceExecutionContext extends ExecutionContext

// Execution context for service calls (i.e. for MemberRegistry)
class ServiceExecutionContextImpl @Inject()(system: ActorSystem)
  extends CustomExecutionContext(system, "contexts.service-execution-context")
    with ServiceExecutionContext
