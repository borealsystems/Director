#!/bin/bash
# defining colours needed for errors n that
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'
BOLD='\033[1m'
username=$USER
echo ""
echo -e "${BOLD}Installing Boreal Systems Director${NC}"
echo ""

# checking if required dependencies exist
echo -e "${BOLD}Checking dependencies:${NC}"

if [ -f "/etc/arch-release" ]; then #arch linux check
    if lsmod | grep "loop" &> /dev/null ; then
        echo -e "loop [${GREEN}✔${NC}]"
    else
        echo -e "loop [${RED}❌${NC}]"
        echo -e "${RED}FATAL:${NC} You must enable the loop module before continuing"
        read -p "Would you like us to enable loop for you? [y/n] " -n 1 -r #ask if want to install thing
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]] #if yes reply
        then
            sudo tee /etc/modules-load.d/loop.conf <<< "loop"
            sudo modprobe loop
            echo ""
        else
            exit
        fi
    fi
fi

if ! command -v git &> /dev/null # checking for git
then
    echo -e "git [${RED}❌${NC}]"
    echo -e "${RED}FATAL:${NC} You need to install git before continuing"
    if [[ "$OSTYPE" == "linux"* ]]; then
        if [ -f "/etc/arch-release" ]; then #arch linux
            read -p "Would you like us to install git for you? [y/n] " -n 1 -r #ask if want to install thing
            echo ""
            if [[ $REPLY =~ ^[Yy]$ ]] #if yes reply
            then
                sudo pacman -S git
                echo ""
            else
                exit
            fi
        else
            read -p "Would you like us to install git for you? [y/n] " -n 1 -r #ask if want to install thing
            echo ""
            if [[ $REPLY =~ ^[Yy]$ ]] #if yes reply
            then
                sudo apt install git
                echo ""
            else
                exit
            fi
        fi
    else
        exit
    fi
else
    echo -e "git [${GREEN}✔${NC}]"
fi

if ! command -v docker &> /dev/null # checking for docker engine
then
    echo -e "Docker [${RED}❌${NC}]"
    echo -e "${RED}FATAL:${NC} You need to install Docker before continuing"
    if [[ "$OSTYPE" == "linux"* ]]; then
        if [ -f "/etc/arch-release" ]; then #arch linux 
            read -p "Would you like us to install Docker for you? [y/n] " -n 1 -r #ask if want to install thing
            echo ""
            if [[ $REPLY =~ ^[Yy]$ ]] #if yes reply
            then
                echo ""
                # install thing
                echo -e "${BOLD}Installing Docker Engine:${NC}"
                sudo pacman -S docker
                sudo systemctl enable --now docker.service
                sudo groupadd docker
                sudo gpasswd -a $USER docker
                echo -e "${RED}${BOLD}$USER has been added to the docker group. You will need to log out and back in or start a new terminal session to continue.${NC}" #usermod needs new session for changes to take place
                exit
            else
                exit
            fi
        else
            read -p "Would you like us to install Docker for you? [y/n] " -n 1 -r #ask if want to install thing
            echo ""
            if [[ $REPLY =~ ^[Yy]$ ]] #if yes reply
            then
                echo ""
                # install thing
                echo -e "${BOLD}Installing Docker Engine:${NC}"
                curl -fsSL https://get.docker.com -o get-docker.sh
                sudo sh get-docker.sh
                sudo usermod -aG docker $USER
                echo -e "${RED}${BOLD}$USER has been added to the docker group. You will need to log out and back in or start a new terminal session to continue.${NC}" #usermod needs new session for changes to take place
                exit
            else
                exit
            fi
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "You need to install Docker Desktop, you can obtain this from here: https://docs.docker.com/docker-for-mac/install/. This will install both the Docker Engine and docker-compose."
    else
        exit
    fi
else
    echo -e "Docker [${GREEN}✔${NC}]"
    if [[ "$OSTYPE" == "linux"* ]]; then
        if getent group docker | grep -q "\b${username}\b"; then
            echo -e "$USER is in docker group [${GREEN}✔${NC}]"
        else
            echo -e "$USER is in docker group [${RED}❌${NC}]"
            read -p "$USER is not in the docker group, this is required to continue, would you like this user to be added to it? [y/n] " -n 1 r
            echo ""
            if [[ $REPLY =~ ^[Yy]$ ]] #if yes reply
            then
                echo ""
                sudo usermod -aG docker $USER
                echo -e "${RED}${BOLD}$USER has been added to the docker group. You will need to log out and back in or start a new terminal session to continue.${NC}" #usermod needs new session for changes to take place
                exit
            else
                exit
            fi
        fi
    fi
fi

if ! command -v docker-compose &> /dev/null # checking for docker composse
then
    echo -e "docker-compose [${RED}❌${NC}]"
    echo -e "${RED}FATAL:${NC} You need to install docker-compose before continuing"
    if [[ "$OSTYPE" == "linux"* ]]; then
        if [ -f "/etc/arch-release" ]; then #arch linux
            read -p "Would you like us to install Docker for you? [y/n] " -n 1 -r #ask if want to install thing
            echo ""
            if [[ $REPLY =~ ^[Yy]$ ]] #if yes reply
            then
                echo ""
                # install thing
                echo -e "${BOLD}Installing docker-compose${NC}"
                sudo pacman -S docker-compose
                echo ""
            else
                exit
            fi
        else
            read -p "Would you like us to install docker-compose for you? [y/n] " -n 1 -r #ask if want to install composing thing
            echo ""
            if [[ $REPLY =~ ^[Yy]$ ]]
            then
                echo ""
                #install donker compose
                echo -e "${BOLD}Installing docker-compose:${NC}"
                sudo curl -L "https://github.com/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
                sudo chmod +x /usr/local/bin/docker-compose
                echo ""
            else
                exit
            fi
        fi
    else
        exit
    fi
else
    echo -e "docker-compose [${GREEN}✔${NC}]"
    echo ""
fi
# cloning the git repo
echo ""
echo -e "${BOLD}Cloning the git repository${NC}"
git clone --recursive https://phabricator.boreal.systems/source/Director.git Director
cd Director
echo ""

# building director
echo -e "${BOLD}Building Director${NC}"
docker-compose -f docker-compose.local.yml build --parallel
echo ""

# Starting director
echo -e "${BOLD}Starting Director${NC}"
docker-compose -f docker-compose.local.yml up -d

# cheeky credits
# script by https://phabricator.boreal.systems/p/chef/