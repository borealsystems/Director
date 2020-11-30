FROM node:14
WORKDIR /borealsystems/director/core
ADD . .
RUN npm_config_build_from_source=true yarn
RUN yarn run build

CMD yarn run prod