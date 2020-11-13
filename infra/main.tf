terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 2.70"
    }
  }
}

provider "aws" {
  region  = var.region
}

data "template_file" "provisioner" {
  template  = file("./provision.tpl")
  vars      = {
    BOT_TOKEN = var.bot_token
  }
}

data "template_cloudinit_config" "config" {
  gzip          = false
  base64_encode = false

  part {
    content_type = "text/x-shellscript"
    content      = data.template_file.provisioner.rendered
  }
}

data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"] # Canonicall
}

resource "aws_vpc" "main" {
  cidr_block           = var.cidr_vpc
  enable_dns_support   = true
  enable_dns_hostnames = true
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id
}

resource "aws_subnet" "subnet_public" {
  vpc_id     = aws_vpc.main.id
  cidr_block = var.cidr_subnet
}

resource "aws_route_table" "rtb_public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
}

resource "aws_route_table_association" "rta_subnet_public" {
  subnet_id      = aws_subnet.subnet_public.id
  route_table_id = aws_route_table.rtb_public.id
}

resource "aws_security_group" "discord_traffic" {
  name   = "discord_traffic"
  vpc_id = aws_vpc.main.id

  # SSH access from the VPC
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_key_pair" "deployer" {
  key_name   = "id_rsa_triona"
  public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDOsocZcS1o8sKonfiDufFHq1tFG/oo08M9wWSPT5vsN0cESFmMUhaajg+22M4w97UdDxPn4YSGwKuo9q83zRZJ/3+eRhAKcEFp38dIUZsT30PfuBuiuAs4oEu7BP1GS5jbVzq30Hhz61UBD+z2WPvwumPsinJ/CjCrIcc4Lpq0RaCnzj1Jm5r2Pxa8mO9gxPRXqxNLi79y7G7fFUwD0xRgeOnX9mxkRTYxodk/u8CbFopxl1ZsZEGXL9MWTc9sJIEHMbPR1QqyI1GdQfAjjn1tF8YFtB2ADzFfzc/pMgkmhgUMYb4cBD3DnuD0Or+uL9V3FA2tfdB1TX4DDTYnUTTUx3odtz77Lv7w/sgm0oNV63AiSm9MqTF189eJvMWHaBDdlVoZNhycPE5gKhLS/lHuEmYz3Qy6wg5Er290pt/nBLmW6Ielk+RfvfbsAeZ7TSXHvh4u4hBF31MVWPzHNwtMKzjCrj60BoQTjPbh0ismwrWw6XhFDnxCh0MYaToEviFpWG3ggS/0j9QtpOZZ+RJn+S3Pz8ODiwcxJ1GSJAj3rWdka7vyK+VvYKIUcMbP66se0pYG9Suo9m6XUJJHVHxCEBRuXEY39KEGRO+dVWJPSEurP3lDRMuYIPpSlmjleG9/Z1BBAm1JjXslgxQ7Lxb/ahyaihdVfKjDBKXOpuVtrQ== TrionaBot@gmail.com"
}

resource "aws_instance" "discord_client" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = "t2.micro"
  subnet_id                   = aws_subnet.subnet_public.id
  vpc_security_group_ids      = [aws_security_group.discord_traffic.id]
  associate_public_ip_address = true
  key_name                    = aws_key_pair.deployer.key_name
  user_data                   = data.template_cloudinit_config.config.rendered

  tags = {
    Name = "Triona"
  }
}

output "public_ip" {
  value = aws_instance.discord_client.public_ip
}

