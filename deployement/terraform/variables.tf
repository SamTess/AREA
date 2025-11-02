variable "do_token" {
  description = "DigitalOcean API token"
  type        = string
  sensitive   = true
}

variable "ssh_key_id" {
  description = "DigitalOcean SSH key ID (not the public key)"
  type        = string
}

variable "private_key_path" {
  description = "Path to the SSH private key"
  type        = string
}

variable "deploy_environments" {
  description = "Which environments to deploy (staging, prod, or both)"
  type        = set(string)
  default     = ["staging", "prod"]
  validation {
    condition = alltrue([
      for env in var.deploy_environments : contains(["staging", "prod"], env)
    ])
    error_message = "Allowed values for deploy_environments are 'staging' and 'prod'."
  }
}

variable "domain_name" {
  description = "The domain name for DNS records"
  type        = string
}

variable "email_mx_server" {
  description = "MX server for email (e.g., Amazon SES)"
  type        = string
  default     = "feedback-smtp.eu-west-1.amazonses.com."
}

variable "email_spf_record" {
  description = "SPF record value for email authentication"
  type        = string
  default     = "v=spf1 include:amazonses.com ~all"
}

variable "email_dkim_public_key" {
  description = "DKIM public key for email authentication"
  type        = string
  sensitive   = true
}

variable "email_dmarc_policy" {
  description = "DMARC policy record"
  type        = string
  default     = "v=DMARC1; p=none;"
}
