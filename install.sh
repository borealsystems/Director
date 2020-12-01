#!/bin/bash
# defining colours needed for errors n that
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'
BOLD='\033[1m'
echo ""
echo -e "${BOLD}Installing Boreal Systems Director${NC}"
echo ""

# checking if required dependencies exist
echo -e "${BOLD}Checking dependencies:${NC}"
if ! command -v docker &> /dev/null # checking for docker engine
then
    echo -e "Docker [${RED}❌${NC}]"
    echo -e "${RED}FATAL:${NC} You need to install Docker before continuing"
    if [[ "$OSTYPE" == "linux"* ]]; then
        read -p "Would you like us to install Docker for you? [y/n] " -n 1 -r #ask if want to install thing
        echo
        if [[ $REPLY =~ ^[Yy]$ ]] #if yes reply
        then
            echo ""
            # install thing
            echo -e "${BOLD}Installing Docker Engine:${NC}"
            curl -fsSL https://get.docker.com -o get-docker.sh
            sudo sh get-docker.sh
            sudo usermod -aG docker $USER
            echo -e "${RED}${BOLD}You will need to log out and back in or start a new terminal session to continue.${NC}" #usermod needs new session for changes to take place
            exit
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "You need to install Docker Desktop, you can obtain this from here: https://docs.docker.com/docker-for-mac/install/. This will install both the Docker Engine and docker-compose."
    else
        exit
    fi
fi
echo -e "Docker [${GREEN}✔${NC}]"
if ! command -v docker-compose &> /dev/null # checking for docker composse
then
    echo -e "docker-compose [${RED}❌${NC}]"
    echo -e "${RED}FATAL:${NC} You need to install docker-compose before continuing"
    if [[ "$OSTYPE" == "linux"* ]]; then
        read -p "Would you like us to install docker-compose for you? [y/n] " -n 1 -r #ask if want to install composing thing
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]
        then
            echo ""
            #install donker compose
            echo -e "${BOLD}Installing docker-compose:${NC}"
            sudo curl -L "https://github.com/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
            sudo chmod +x /usr/local/bin/docker-compose
        fi
    else
        exit
    fi
fi
echo -e "docker-compose [${GREEN}✔${NC}]"
echo ""

# cloning the git repo
echo -e "${BOLD}Cloning the git repository${NC}"
git clone --recursive https://phabricator.boreal.systems/source/Director.git Director
cd Director
echo ""

# building director
echo -e "${BOLD}Building Director${NC}"
docker-compose build --parallel
echo ""

# Starting director
echo -e "${BOLD}Starting Director${NC}"
docker-compose up -d

# cheeky credits
# script by https://phabricator.boreal.systems/p/chef/