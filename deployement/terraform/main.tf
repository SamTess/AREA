terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
    local = {
      source  = "hashicorp/local"
      version = "~> 2.0"
    }
  }
}

provider "digitalocean" {
  token = var.do_token
}

resource "digitalocean_domain" "AREA" {
  name = var.domain_name
}

resource "digitalocean_record" "staging_a" {
  count  = contains(var.deploy_environments, "staging") ? 1 : 0
  domain = digitalocean_domain.AREA.name
  type   = "A"
  name   = "staging"
  value  = digitalocean_droplet.area_staging[0].ipv4_address
  ttl    = 60
}

resource "digitalocean_record" "prod_a" {
  count  = contains(var.deploy_environments, "prod") ? 1 : 0
  domain = digitalocean_domain.AREA.name
  type   = "A"
  name   = "@"
  value  = digitalocean_droplet.area_prod[0].ipv4_address
  ttl    = 60
}

resource "digitalocean_record" "caa_letsencrypt" {
  domain = digitalocean_domain.AREA.name
  type   = "CAA"
  name   = "@"
  flags  = 0
  tag    = "issue"
  value  = "letsencrypt.org."
  ttl    = 3600
}

resource "digitalocean_record" "caa_wildcard_letsencrypt" {
  domain = digitalocean_domain.AREA.name
  type   = "CAA"
  name   = "*"
  flags  = 0
  tag    = "issue"
  value  = "letsencrypt.org."
  ttl    = 3600
}

resource "digitalocean_droplet" "area_staging" {
  count    = contains(var.deploy_environments, "staging") ? 1 : 0
  name     = "area-staging-vm"
  region   = "fra1"
  size     = "s-2vcpu-4gb"
  image    = "ubuntu-22-04-x64"
  ssh_keys = [var.ssh_key_id]
  tags     = ["area", "staging"]
}

resource "digitalocean_droplet" "area_prod" {
  count    = contains(var.deploy_environments, "prod") ? 1 : 0
  name     = "area-prod-vm"
  region   = "fra1"
  size     = "s-2vcpu-4gb"
  image    = "ubuntu-22-04-x64"
  ssh_keys = [var.ssh_key_id]
  tags     = ["area", "prod"]
}

resource "digitalocean_firewall" "area_fw" {
  name = "area-fw"

  droplet_ids = concat(
    contains(var.deploy_environments, "staging") ? digitalocean_droplet.area_staging[*].id : [],
    contains(var.deploy_environments, "prod") ? digitalocean_droplet.area_prod[*].id : []
  )

  inbound_rule {
    protocol         = "tcp"
    port_range       = "22"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  inbound_rule {
    protocol         = "tcp"
    port_range       = "80"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  inbound_rule {
    protocol         = "tcp"
    port_range       = "443"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "tcp"
    port_range            = "all"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "udp"
    port_range            = "all"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  inbound_rule {
    protocol         = "tcp"
    port_range       = "8080"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "tcp"
    port_range            = "8080"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  inbound_rule {
    protocol         = "tcp"
    port_range       = "3000"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  inbound_rule {
    protocol         = "tcp"
    port_range       = "5432"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

}

resource "digitalocean_project" "area" {
  name        = "area"
  description = "area application infrastructure"
  purpose     = "Web Application"
  environment = "Production"
}

resource "digitalocean_project_resources" "assign_vm" {
  project = digitalocean_project.area.id
  resources = concat(
    contains(var.deploy_environments, "staging") ? digitalocean_droplet.area_staging[*].urn : [],
    contains(var.deploy_environments, "prod") ? digitalocean_droplet.area_prod[*].urn : []
  )
}

output "droplet_staging_ip" {
  value       = contains(var.deploy_environments, "staging") && length(digitalocean_droplet.area_staging) > 0 ? digitalocean_droplet.area_staging[0].ipv4_address : null
  description = "Public IP of the AREA staging VM"
}

output "droplet_prod_ip" {
  value       = contains(var.deploy_environments, "prod") && length(digitalocean_droplet.area_prod) > 0 ? digitalocean_droplet.area_prod[0].ipv4_address : null
  description = "Public IP of the AREA production VM"
}

resource "local_file" "ansible_inventory" {
  filename = "${path.module}/../ansible/hosts.ini"
  content  = <<-EOT
%{if contains(var.deploy_environments, "staging") && length(digitalocean_droplet.area_staging) > 0~}
[area_staging]
${digitalocean_droplet.area_staging[0].ipv4_address} ansible_user=root ansible_ssh_private_key_file=${var.private_key_path}
%{endif~}

%{if contains(var.deploy_environments, "prod") && length(digitalocean_droplet.area_prod) > 0~}
[area_prod]
${digitalocean_droplet.area_prod[0].ipv4_address} ansible_user=root ansible_ssh_private_key_file=${var.private_key_path}
%{endif~}
EOT
}

resource "null_resource" "add_known_host_staging" {
  count      = contains(var.deploy_environments, "staging") ? 1 : 0
  depends_on = [digitalocean_droplet.area_staging]

  provisioner "local-exec" {
    command = <<EOT
ls -l ~/.ssh/known_hosts
for i in $(seq 1 30); do
  ssh-keyscan -H ${digitalocean_droplet.area_staging[0].ipv4_address} >> ~/.ssh/known_hosts 2>/dev/null && exit 0
  sleep 5
done
echo "ssh-keyscan failed after multiple attempts" >&2
exit 1
EOT
  }
}

resource "null_resource" "add_known_host_prod" {
  count      = contains(var.deploy_environments, "prod") ? 1 : 0
  depends_on = [digitalocean_droplet.area_prod]

  provisioner "local-exec" {
    command = <<EOT
ls -l ~/.ssh/known_hosts
for i in $(seq 1 30); do
  ssh-keyscan -H ${digitalocean_droplet.area_prod[0].ipv4_address} >> ~/.ssh/known_hosts 2>/dev/null && exit 0
  sleep 5
done
echo "ssh-keyscan failed after multiple attempts" >&2
exit 1
EOT
  }
}
