# Course Service Dockerfile

FROM node:alpine
LABEL maintainer="SofLearning"

WORKDIR /home/node/app
RUN chown -R node:node /home/node/app
# Copy node package files
COPY package*.json ./

#Installing Packages
RUN npm install

# Copy the source files
COPY . .

ENV DB_HOST=
ENV DB_PORT=
ENV DB_USER=
ENV DB_PASS=
ENV NODE_ENV="dev"
ENV PORT=3100

USER node
#Exposing Server Port
EXPOSE 3100

# Boostrapping the app
CMD ["node", "server.js"]