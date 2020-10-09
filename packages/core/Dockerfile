FROM node:14-alpine
WORKDIR /borealsystems/director/core
ADD . .
RUN yarn
RUN yarn run build

CMD yarn run prod