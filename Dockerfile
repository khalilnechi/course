FROM node:alpine
LABEL maintainer="account_api"

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

#Exposing Server Port
EXPOSE 3100

# Boostrapping the app
CMD ["node", "server.js"]