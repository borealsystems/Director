FROM node:14 as build
WORKDIR /borealsystems/director/ui
ADD . .
RUN yarn
RUN yarn run build
RUN ls /borealsystems/director/ui

FROM nginx:1.15
ADD ./nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /borealsystems/director/ui
ADD ./src/public/* ./public/
COPY --from=build /borealsystems/director/ui/dist/* ./public/dist/
