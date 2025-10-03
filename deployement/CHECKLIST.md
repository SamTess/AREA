# AREA Deployment Checklist

Use this checklist to ensure you've completed all necessary steps before deploying.

## ☑️ Pre-Deployment Checklist

### Infrastructure Setup
- [ ] Domain names registered and pointing to server IPs
  - [ ] Production domain: `production.areaaaaaaaaaaaaaaaaaaa.space`
  - [ ] Staging domain: `staging.areaaaaaaaaaaaaaaaaaaa.space`
- [ ] Server(s) provisioned (Ubuntu 20.04+ or Debian 11+)
  - [ ] Minimum 2GB RAM
  - [ ] Minimum 20GB disk space
  - [ ] Ports 80 and 443 open
  - [ ] SSH access configured
- [ ] DNS records created (A records pointing to server IPs)
- [ ] DNS propagation verified (`dig your-domain.com`)

### Local Environment
- [ ] Ansible installed (`ansible --version`)
- [ ] SSH key configured and accessible
- [ ] Git access to repository configured
- [ ] Repository cloned locally

### Configuration Files
- [ ] `ansible/hosts.ini` created from `hosts.ini.example`
  - [ ] Server IPs updated
  - [ ] SSH user configured (default: root)
  - [ ] SSH key path verified
- [ ] `ansible/config.yml` updated
  - [ ] Production domain set
  - [ ] Staging domain set
  - [ ] Email for SSL certificates set
  - [ ] Repository URL correct
  - [ ] Branch names correct
- [ ] Environment variables prepared
  - [ ] Database passwords generated
  - [ ] JWT secrets generated (32+ characters)
  - [ ] Admin credentials defined
  - [ ] OAuth credentials obtained (GitHub, Google)
  - [ ] Email SMTP credentials (if using email features)

### Security
- [ ] All passwords are strong and unique
- [ ] Secrets stored securely (not in git)
- [ ] `.env` files in `.gitignore`
- [ ] SSH key permissions correct (`chmod 600`)
- [ ] Server firewall configured (only 22, 80, 443 open)

## 🚀 Deployment Checklist

### Initial Deployment
- [ ] Run `./quick-deploy.sh` or `./ansible/deploy.sh`
- [ ] Select appropriate environment (staging/production)
- [ ] Wait for deployment to complete (~15 minutes)
- [ ] Check for any error messages

### Verification
- [ ] HTTPS site accessible at your domain
- [ ] Frontend loads correctly
- [ ] Backend API responding (`/api/health`)
- [ ] SSL certificate valid (no browser warnings)
- [ ] Database connection working
- [ ] Redis cache functioning
- [ ] Health checks passing

### Post-Deployment
- [ ] Test user registration/login
- [ ] Test OAuth login (GitHub, Google)
- [ ] Verify all AREA features working
- [ ] Check application logs for errors
- [ ] Test mobile app connection (if applicable)
- [ ] Set up monitoring/alerting
- [ ] Configure database backups
- [ ] Document any custom configurations

## 📱 Mobile Client Checklist

Since mobile client is not built during deployment:

- [ ] Download latest APK from AREA_Mobile repository releases
- [ ] Test APK on device
- [ ] Upload APK to distribution method:
  - [ ] Option A: Host on web server
  - [ ] Option B: Upload to Google Play Store
  - [ ] Option C: Use internal distribution platform
- [ ] Update download links in documentation
- [ ] Test download and installation process

## 🔒 Security Hardening Checklist

### Server Security
- [ ] SSH password authentication disabled
- [ ] SSH key-only authentication enabled
- [ ] Firewall (ufw/iptables) configured
- [ ] Fail2ban installed and configured
- [ ] Automatic security updates enabled
- [ ] Server timezone set correctly
- [ ] Logs being collected and rotated

### Application Security
- [ ] All default passwords changed
- [ ] HTTPS enforced (HTTP redirects to HTTPS)
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Database not exposed to internet
- [ ] Redis not exposed to internet
- [ ] Environment variables secured
- [ ] API authentication working

### SSL/TLS
- [ ] SSL certificate issued successfully
- [ ] Certificate auto-renewal configured
- [ ] Strong cipher suites configured
- [ ] HSTS header enabled
- [ ] Certificate monitored for expiration

## 🔧 Optional Enhancements

- [ ] Set up CI/CD pipeline (GitHub Actions)
- [ ] Configure monitoring (Prometheus/Grafana)
- [ ] Set up log aggregation (ELK stack)
- [ ] Configure CDN (CloudFlare)
- [ ] Set up database replication
- [ ] Configure automated backups
- [ ] Set up staging environment
- [ ] Configure load balancer (if multiple servers)
- [ ] Set up error tracking (Sentry)
- [ ] Configure email notifications for errors

## 📊 Testing Checklist

### Functional Testing
- [ ] User registration works
- [ ] User login works
- [ ] Password reset works
- [ ] OAuth login works (GitHub)
- [ ] OAuth login works (Google)
- [ ] AREA creation works
- [ ] AREA triggers work
- [ ] AREA actions work
- [ ] User profile updates work
- [ ] Settings save correctly

### Performance Testing
- [ ] Page load times acceptable
- [ ] API response times acceptable
- [ ] Database queries optimized
- [ ] Redis caching working
- [ ] Static assets served efficiently

### Security Testing
- [ ] SQL injection prevented
- [ ] XSS attacks prevented
- [ ] CSRF protection working
- [ ] Rate limiting effective
- [ ] Authentication required where needed
- [ ] Authorization working correctly

## 📝 Documentation Checklist

- [ ] Deployment process documented
- [ ] Configuration variables documented
- [ ] Troubleshooting guide updated
- [ ] API documentation available
- [ ] User guide created/updated
- [ ] Admin guide created
- [ ] Backup/restore procedures documented
- [ ] Incident response plan created

## 🆘 Rollback Plan

In case something goes wrong:

- [ ] Backup of previous version available
- [ ] Rollback procedure documented
- [ ] Database backup recent (< 24 hours)
- [ ] Quick rollback tested in staging
- [ ] Team knows rollback procedure

## ✅ Sign-off

Deployment completed by: ________________
Date: ________________
Environment: [ ] Staging  [ ] Production

Verified by: ________________
Date: ________________

Notes:
_________________________________________________
_________________________________________________
_________________________________________________

---

**Remember**: Always test in staging before deploying to production!
