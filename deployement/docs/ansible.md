
# 🤖 Ansible Deployment Guide

Welcome to automated deployment! Ansible makes setting up and updating your AREA project servers a breeze. Just follow these steps and let the robots do the heavy lifting.

## 🗂️ Structure
- `config.yml` / `config.example.yml`: Your main configuration file. Copy, customize, and conquer!
- `playbook.yml`, `playbook-production.yml`, `playbook-staging.yml`: Playbooks for every environment.
- `.env.production.j2`, `.env.staging.j2`: Jinja templates for environment variables—fill them in locally, keep secrets safe.
- `nginx.conf.j2`: Nginx config template for secure, speedy web serving.

## 🚦 Usage
1. Edit your configuration in `config.yml`.
2. Generate environment files from the Jinja templates, filling in secrets locally.
3. Run the playbook:
   ```zsh
   ansible-playbook -i inventory playbook-production.yml
   ```
4. Or use `deploy.sh` for a one-command deployment.

## 💡 Tips
- Never commit secrets. Use templates and local files.
- Test in staging before production—avoid surprises!
- See `requirements.yml` for required Ansible roles.

Deploy with confidence and let Ansible handle the rest! 🎉
