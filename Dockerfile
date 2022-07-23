#FROM --platform=linux/amd64 node:16.16-alpine as build
FROM node:16.16-alpine as build
WORKDIR /app
COPY package*.json .
RUN npm install && npm cache clean --force
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:16.16-alpine
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/*.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/doc ./doc
COPY --from=build /app/.env ./
#COPY --from=build /app/prisma ./prisma
EXPOSE 4000
CMD ["npm", "run", "start:dev"]
