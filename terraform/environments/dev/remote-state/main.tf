terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.38.0"
    }
  }
}

resource "aws_s3_bucket" "tfstate-tela-vermelha-dev" {
  bucket = "tfstate-tela-vermelha-dev"

  tags = {
    Environment = "Dev"
    Managedby   = "Terraform"
    Owner       = "CodeBusters"
  }
}

output "aws_s3_bucket_name" {
  value = aws_s3_bucket.tfstate-tela-vermelha-dev.bucket
}