FROM node:16.16-alpine as build
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
CMD ["npm", "build"]

FROM node:16.16-alpine
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist
EXPOSE 4000



