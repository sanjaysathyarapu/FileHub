variable "aws_region" {
  description = "The AWS region to deploy resources in"
  default = "ap-southeast-1"
}

variable "aws_access_key" {
  description = "The AWS access key"
  default = "AKIATYGSNDAP743GLBP6"
}

variable "aws_secret_key" {
  description = "The AWS secret key"
  default = "-"
}

variable "ami_id" {
  description = "The ID of the AMI to use for the EC2 instance"
  default = "-"
}

variable "instance_type" {
  description = "The type of EC2 instance to launch"
  default = "t2.micro"
}

variable "bucket_name" {
  description = "The name of the S3 bucket"
  default = "cicd-bucket-asvu"
}
