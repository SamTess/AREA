# AREA Application - HTTPS Deployment Guide

This deployment configuration sets up the AREA application with HTTPS using Let's Encrypt SSL certificates.

## 🚀 Key Features

- **HTTPS with Let's Encrypt**: Automatic SSL certificate provisioning and renewal
- **Optimized Build**: Mobile client removed from deployment (uses pre-built APKs from releases)
- **Full Stack Deployment**: Backend (Java/Spring Boot), Frontend (Next.js), Database (PostgreSQL), Cache (Redis)
- **Nginx Reverse Proxy**: Load balancing, rate limiting, and security headers
- **Automated Deployment**: Ansible playbooks for staging and production

## 📦 Architecture

The deployment consists of:

1. **nginx** - Reverse proxy with SSL termination
2. **certbot** - SSL certificate management and auto-renewal
3. **postgres** - PostgreSQL database
4. **redis** - Redis cache
5. **area-backend** - Java Spring Boot backend API
6. **web** - Next.js frontend application

**Note**: The mobile client (APK) is NOT built during deployment. Instead, download pre-built APKs from the AREA_Mobile repository releases.

## 📋 Prerequisites

### Local Machine
- Ansible >= 2.9
- SSH access to target servers
- SSH key configured for GitHub access

### Target Server
- Ubuntu 20.04+ or Debian 11+
- At least 2GB RAM, 20GB disk space
- Domain name pointing to server IP
- Ports 80 and 443 open

## 🔧 Configuration

### 1. Update Ansible Configuration

Edit `ansible/config.yml`:

```yaml
production:
  domain: "your-domain.com"
  email: "your-email@example.com"

staging:
  domain: "staging.your-domain.com"
  email: "your-email@example.com"
```

### 2. Set Environment Variables

Before deployment, set these environment variables (or update the .env templates):

```bash
export AREA_DB_PASSWORD="your_secure_database_password"
export AREA_AUTH_SECRET="your_32_char_or_longer_secret_key"
export EMAIL_USER="your_email@gmail.com"
export EMAIL_PASS="your_app_specific_password"
```

### 3. Configure Ansible Inventory

Edit your inventory file to include target servers:

```ini
[survivor_prod]
production.your-domain.com ansible_user=root

[survivor_staging]
staging.your-domain.com ansible_user=root
```

## 🚀 Deployment

### Production Deployment

```bash
cd deployement/ansible

# Full deployment with HTTPS
ansible-playbook -i inventory playbook.yml playbook-production.yml

# Or use the deploy script
./deploy.sh production
```

### Staging Deployment

```bash
cd deployement/ansible

# Staging deployment
ansible-playbook -i inventory playbook.yml playbook-staging.yml

# Or use the deploy script
./deploy.sh staging
```

## 🔍 Verification

After deployment, verify the services:

```bash
# Check HTTPS is working
curl https://your-domain.com/health

# Check backend health
curl https://your-domain.com/api/health

# View logs
ssh root@your-domain.com
cd /opt/area/deployement/docker
docker compose logs -f
```

## 📱 Mobile APK Distribution

Since the mobile client is not built during deployment:

1. Go to the AREA_Mobile repository releases page
2. Download the latest APK release
3. Host it on your preferred distribution method:
   - Direct download link from web interface
   - App store distribution
   - Internal distribution platform

Alternatively, you can manually add the APK to the web container:

```bash
# On the server
docker cp /path/to/client.apk area-web:/app/public/downloads/client.apk
```

## 🔄 Updates and Redeployment

To update the application:

```bash
# Re-run the deployment playbook
cd deployement/ansible
ansible-playbook -i inventory playbook-production.yml

# Or manually on the server
ssh root@your-domain.com
cd /opt/area/deployement/docker
git pull origin main
docker compose down
docker compose up -d --build
```

## 🛠️ Manual Operations

### SSL Certificate Renewal

Certbot automatically renews certificates. To manually renew:

```bash
docker compose exec certbot certbot renew
docker compose restart nginx
```

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f web
docker compose logs -f area-backend
docker compose logs -f nginx
```

### Restart Services

```bash
# Restart all services
docker compose restart

# Restart specific service
docker compose restart web
docker compose restart area-backend
```

## 🔒 Security Notes

1. **Firewall**: Ensure only ports 80, 443, and SSH are open
2. **Environment Variables**: Keep sensitive credentials secure
3. **SSH Keys**: Use key-based authentication, disable password auth
4. **Rate Limiting**: Nginx is configured with rate limiting for API endpoints
5. **Security Headers**: HSTS, X-Frame-Options, etc. are enabled

## 📊 Monitoring

The deployment includes health check endpoints:

- Frontend: `https://your-domain.com/health`
- Backend: `https://your-domain.com/api/health`
- Backend Actuator: `https://your-domain.com/actuator/health`

## 🐛 Troubleshooting

### SSL Certificate Issues

```bash
# Check certificate status
docker compose exec certbot certbot certificates

# Manual certificate request
docker run --rm -p 80:80 \
  -v deployement_docker_certbot-etc:/etc/letsencrypt \
  -v deployement_docker_certbot-var:/var/lib/letsencrypt \
  certbot/certbot certonly --standalone \
  --email your-email@example.com \
  --agree-tos -d your-domain.com
```

### DNS Not Propagating

```bash
# Check DNS
dig your-domain.com
nslookup your-domain.com

# Wait for propagation (can take up to 48 hours)
```

### Service Not Starting

```bash
# Check logs
docker compose logs area-backend
docker compose logs web

# Check service health
docker compose ps
```

## 📁 File Structure

```
deployement/
├── ansible/
│   ├── config.yml              # Main configuration
│   ├── playbook.yml            # Base setup
│   ├── playbook-production.yml # Production deployment
│   ├── playbook-staging.yml    # Staging deployment
│   ├── https-tasks.yml         # HTTPS setup tasks
│   ├── nginx.conf.j2           # Nginx template
│   ├── .env.production.j2      # Production env template
│   └── .env.staging.j2         # Staging env template
├── docker/
│   ├── docker-compose.yml      # Main compose file (HTTPS)
│   ├── nginx.conf              # Generated nginx config
│   └── .env                    # Generated environment file
└── terraform/                  # Infrastructure as Code (optional)
```

## 🤝 Contributing

When making changes to the deployment:

1. Test in staging environment first
2. Update documentation
3. Create a pull request with detailed description
4. Wait for review before deploying to production

## 📝 License

Same as the AREA project license.
