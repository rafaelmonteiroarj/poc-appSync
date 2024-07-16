
module "users" {
  source         = "../../infra/users"
  environment    = "${var.environment}"
  write_capacity = 1
  read_capacity  = 1 
  region     = "${var.region}"
}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.38.0"
    }
  }

  backend "s3" {
    bucket  = "tfstate-tela-vermelha-dev"
    key     = "tfstate-tela-vermelha-dev.tfstate"
    region  = "us-east-1"
    encrypt = true
  }
}