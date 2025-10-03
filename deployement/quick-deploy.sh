#!/bin/bash

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════╗"
echo "║   AREA Application - Quick Deployment Setup      ║"
echo "╚═══════════════════════════════════════════════════╝"
echo -e "${NC}"

if [ ! -f "ansible/config.yml" ]; then
    echo -e "${RED}❌ Error: Please run this script from the deployement directory${NC}"
    echo -e "${YELLOW}Expected: /path/to/AREA/deployement/${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Step 1: Checking prerequisites...${NC}"

if ! command -v ansible &> /dev/null; then
    echo -e "${RED}❌ Ansible is not installed${NC}"
    echo -e "${YELLOW}Install with: pip install ansible${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Ansible installed${NC}"

SSH_KEY_PATH="$HOME/.ssh/skyblog_ed25519"
if [ ! -f "$SSH_KEY_PATH" ]; then
    echo -e "${YELLOW}⚠️  SSH key not found at: $SSH_KEY_PATH${NC}"
    read -p "Enter your SSH private key path: " SSH_KEY_PATH
    if [ ! -f "$SSH_KEY_PATH" ]; then
        echo -e "${RED}❌ SSH key not found${NC}"
        exit 1
    fi
fi
echo -e "${GREEN}✅ SSH key found${NC}"

echo ""
echo -e "${YELLOW}📋 Step 2: Configuration${NC}"

if [ ! -f "ansible/hosts.ini" ]; then
    echo -e "${YELLOW}Creating hosts.ini from example...${NC}"

    if [ -f "ansible/hosts.ini.example" ]; then
        cp ansible/hosts.ini.example ansible/hosts.ini
        echo -e "${GREEN}✅ hosts.ini created${NC}"
        echo -e "${YELLOW}⚠️  Please edit ansible/hosts.ini with your server details${NC}"
        echo ""
        read -p "Press Enter when you've updated ansible/hosts.ini..."
    else
        echo -e "${RED}❌ hosts.ini.example not found${NC}"
        exit 1
    fi
fi

echo ""
echo -e "${YELLOW}📋 Step 3: Domain Configuration${NC}"
read -p "Enter your production domain (e.g., area.example.com): " PROD_DOMAIN
read -p "Enter your staging domain (e.g., staging.area.example.com): " STAGING_DOMAIN
read -p "Enter your email for SSL certificates: " SSL_EMAIL

sed -i "s/domain: \"production.areaaaaaaaaaaaaaaaaaaa.space\"/domain: \"$PROD_DOMAIN\"/" ansible/config.yml
sed -i "s/domain: \"staging.areaaaaaaaaaaaaaaaaaaa.space\"/domain: \"$STAGING_DOMAIN\"/" ansible/config.yml
sed -i "s/email: \"tryt9398@gmail.com\"/email: \"$SSL_EMAIL\"/" ansible/config.yml

echo -e "${GREEN}✅ Configuration updated${NC}"

echo ""
echo -e "${YELLOW}📋 Step 4: Environment Variables${NC}"
echo -e "${YELLOW}Setting up secure passwords and secrets...${NC}"

if [ -z "$AREA_DB_PASSWORD" ]; then
    export AREA_DB_PASSWORD=$(openssl rand -base64 32)
    echo -e "${GREEN}✅ Generated DB password${NC}"
fi

if [ -z "$AREA_AUTH_SECRET" ]; then
    export AREA_AUTH_SECRET=$(openssl rand -base64 48)
    echo -e "${GREEN}✅ Generated Auth secret${NC}"
fi

cat > ansible/.env.secrets << EOF
# Generated secrets for AREA deployment
# Keep this file secure and DO NOT commit to Git!
export AREA_DB_PASSWORD="$AREA_DB_PASSWORD"
export AREA_STAGING_DB_PASSWORD="$(openssl rand -base64 32)"
export AREA_AUTH_SECRET="$AREA_AUTH_SECRET"
export AREA_STAGING_AUTH_SECRET="$(openssl rand -base64 48)"
EOF

echo -e "${GREEN}✅ Secrets saved to ansible/.env.secrets${NC}"
echo -e "${YELLOW}⚠️  Keep this file secure!${NC}"

echo ""
echo -e "${YELLOW}📋 Step 5: Deployment Options${NC}"
echo ""
echo "Select deployment environment:"
echo "1) Staging ($STAGING_DOMAIN)"
echo "2) Production ($PROD_DOMAIN)"
echo "3) Both (Staging then Production)"
echo "4) Skip deployment (setup only)"
echo ""

read -p "Enter your choice [1-4]: " DEPLOY_CHOICE

source ansible/.env.secrets

cd ansible

case $DEPLOY_CHOICE in
    1)
        echo -e "${BLUE}🚀 Deploying to Staging...${NC}"
        ./deploy.sh
        ;;
    2)
        echo -e "${BLUE}🚀 Deploying to Production...${NC}"
        ./deploy.sh
        ;;
    3)
        echo -e "${BLUE}🚀 Deploying to both environments...${NC}"
        ./deploy.sh
        ;;
    4)
        echo -e "${GREEN}✅ Setup complete!${NC}"
        echo ""
        echo -e "${YELLOW}To deploy later, run:${NC}"
        echo -e "  cd ansible"
        echo -e "  source .env.secrets"
        echo -e "  ./deploy.sh"
        ;;
    *)
        echo -e "${RED}❌ Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}"
echo "╔═══════════════════════════════════════════════════╗"
echo "║         Deployment Setup Complete!               ║"
echo "╚═══════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""
echo -e "${YELLOW}📝 Important Notes:${NC}"
echo -e "  1. Your secrets are in: ${BLUE}ansible/.env.secrets${NC}"
echo -e "  2. Add .env.secrets to .gitignore"
echo -e "  3. Staging URL: ${BLUE}https://$STAGING_DOMAIN${NC}"
echo -e "  4. Production URL: ${BLUE}https://$PROD_DOMAIN${NC}"
echo ""
echo -e "${YELLOW}🔍 To check deployment status:${NC}"
echo -e "  ssh root@$PROD_DOMAIN 'cd /opt/area/deployement/docker && docker compose ps'"
echo ""
echo -e "${YELLOW}📱 Mobile APK:${NC}"
echo -e "  Download from AREA_Mobile repository releases"
echo -e "  The mobile client is NOT built during deployment"
echo ""
