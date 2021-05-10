


lazy val root = (project in file("."))
  .enablePlugins(PlayScala)
  .settings(
    name := "scala-chat",
    version := "1.0",
    scalaVersion := "2.13.5",
    libraryDependencies ++= Seq(
      guice,
      "org.scalatestplus.play" %% "scalatestplus-play" % "5.1.0" % Test,
      "org.scalatestplus" %% "mockito-3-4" % "3.2.8.0" % Test,
      "org.mockito" % "mockito-core" % "3.4.6" % Test,
    ),
    scalacOptions ++= Seq(
      "-feature",
      "-deprecation",
      "-Xfatal-warnings"
    )
  )

//resolvers += "scalaz-bintray" at "https://dl.bintray.com/scalaz/releases"
//resolvers += "Akka Snapshot Repository" at "https://repo.akka.io/snapshots/"

//scalaVersion := "2.12.2"
//
//libraryDependencies ++= Seq(jdbc, ehcache, ws, specs2 % Test, guice)
//
//unmanagedResourceDirectories in Test <+= baseDirectory(_ / "target/web/public/test")

