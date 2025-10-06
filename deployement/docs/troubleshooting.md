
# 🛠️ Troubleshooting Deployment

Hit a snag? No worries—this guide will help you get your AREA deployment back on track in no time!

## 🔒 SSL Certificate Issues
- Check certificate status:
  ```zsh
  docker compose exec certbot certbot certificates
  ```
- Manual certificate request:
  ```zsh
  docker run --rm -p 80:80 ... certbot/certbot certonly --standalone ...
  ```

## 🌐 DNS Issues
- Check DNS propagation:
  ```zsh
  dig your-domain.com
  nslookup your-domain.com
  ```
- Wait for propagation (up to 48 hours).

## 🚦 Service Startup Issues
- Check logs:
  ```zsh
  docker compose logs area-backend
  docker compose logs web
  ```
- Check service health:
  ```zsh
  docker compose ps
  ```

## 💡 General Tips
- Always check logs first—they're your best friend!
- Validate environment variables.
- Ensure ports are open and firewall rules are correct.

Stay calm, troubleshoot smart, and you'll be up and running in no time! 🛠️🚀
