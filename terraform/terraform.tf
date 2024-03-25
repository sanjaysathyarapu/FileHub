
# Define AWS provider
provider "aws" {
  region = var.aws_region
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
}

#Define an AWS S3 bucket
resource "aws_s3_bucket" "example_bucket" {
  bucket = var.bucket_name
  acl = "private"
}

# Define an AWS EC2 instance
resource "aws_instance" "example_instance" {
  ami = var.ami_id
  instance_type = var.instance_type
}
