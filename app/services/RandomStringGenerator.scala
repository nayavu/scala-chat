package services

import javax.inject.Singleton
import scala.util.Random

@Singleton
class RandomStringGenerator {
  def generate(length: Int): String = {
    Random.alphanumeric.take(length).mkString("")
  }
}
