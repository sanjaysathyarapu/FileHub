variable "aws_region" {
  description = "The AWS region to deploy resources in"
}

variable "aws_access_key" {
  description = "The AWS access key"
}

variable "aws_secret_key" {
  description = "The AWS secret key"
}

variable "ami_id" {
  description = "The ID of the AMI to use for the EC2 instance"
}

variable "instance_type" {
  description = "The type of EC2 instance to launch"
}

variable "bucket_name" {
  description = "The name of the S3 bucket"
}
