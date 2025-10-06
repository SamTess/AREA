#!/bin/bash
# AREA unified deployment script
# Usage: ./deploy.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

printf "${GREEN}Welcome to the AREA deployment script! 🚀${NC}\n"
printf "${YELLOW}What would you like to do today?${NC}\n"
printf "  [1] Deploy (provision & configure everything)\n"
printf "  [2] Destroy (tear down all infrastructure)\n"
printf "${YELLOW}Enter your choice (1 or 2): ${NC}"
read choice

if [[ "$choice" == "2" ]]; then
	printf "${RED}Destroying AREA infrastructure...${NC}\n"
	cd terraform
	terraform init
	terraform destroy -auto-approve
	cd ..
	printf "${RED}All resources destroyed. Goodbye! 👋${NC}\n"
	exit 0
fi

printf "${GREEN}Starting AREA deployment...${NC}\n"

printf "${YELLOW}Step 1: Running Terraform (provision infrastructure)...${NC}\n"
cd terraform
terraform init
terraform apply -auto-approve
cd ..

printf "${YELLOW}Waiting 5 seconds for hosts.ini to be generated...${NC}\n"
sleep 5

printf "${YELLOW}Step 2: Running Ansible (configure servers & deploy app)...${NC}\n"
cd ansible
./deploy.sh
cd ..

printf "${GREEN}Deployment complete! Your AREA project is live! 🎉${NC}\n"

DOMAIN_URL=$(awk '/production:/ {f=1} f && /domain:/ {print $2; exit}' ansible/config.yml)
if [ -z "$DOMAIN_URL" ]; then
	DOMAIN_URL=$(awk '/staging:/ {f=1} f && /domain:/ {print $2; exit}' ansible/config.yml)
fi
if [ -n "$DOMAIN_URL" ]; then
	printf "${YELLOW}Open your app: ${NC}https://$DOMAIN_URL\n"
else
	printf "${YELLOW}Domain not found in ansible/config.yml. Please check your configuration.\n"
fi
