FROM node:14
WORKDIR /borealsystems/director/core
ADD . .
RUN apt-get update
RUN apt-get install libavahi-compat-libdnssd-dev -y
RUN yarn
RUN yarn run build

CMD yarn run prod