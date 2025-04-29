terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 2.23.0"
    }
  }
}

provider "docker" {}

resource "docker_image" "tetris_game" {
  name         = "tetris-game"
  build {
    path = "../"  # <- indique le chemin vers le dossier contenant le Dockerfile
  }
}

resource "docker_container" "tetris_game" {
  name  = "tetris-game-tf"
  image = docker_image.tetris_game.latest

  ports {
    internal = 3000
    external = 3000
  }
}
