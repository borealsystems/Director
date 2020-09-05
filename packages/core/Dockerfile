FROM node:14
WORKDIR /borealsystems/director/core
ADD . .
RUN yarn
RUN yarn run build

CMD yarn run prod