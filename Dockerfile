FROM node:20.2 as ngsurveybuild
RUN npm install -g @angular/cli
RUN mkdir -p /app
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
RUN npm run build --prod
#CMD ng serve --host 0.0.0.0
#stage 2
FROM nginx as runtime
COPY --from=ngsurveybuild /app/dist/ngsurvey /usr/share/nginx/html
EXPOSE 80
