#!/bin/bash
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'
BOLD='\033[1m'
echo ""
echo -e "${BOLD}Installing Boreal Systems Director${NC}"
echo ""
echo -e "${BOLD}Checking dependencies:${NC}"
if ! command -v docker &> /dev/null
then
    echo -e "Docker [\u274c]${NC}"
    echo -e "${RED} FATAL:${NC} You need to install Docker before continuing"
    exit
fi
echo -e "Docker [${GREEN}\u2714${NC}]"
if ! command -v docker-compose &> /dev/null
then
    echo -e "docker-compose [\u274c]${NC}"
    echo -e "${RED} FATAL:${NC} You need to install docker-compose before continuing"
    exit
fi
echo -e "docker-compose [${GREEN}\u2714${NC}]"
echo ""
echo -e "${BOLD}Cloning the git repository${NC}"
git clone --recursive https://phabricator.boreal.systems/source/Director.git script
cd script
echo ""
echo -e "${BOLD}Building Director${NC}"
docker-compose build --parallel
echo ""
echo -e "${BOLD}Starting Director${NC}"
docker-compose up -d
