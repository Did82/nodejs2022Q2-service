FROM node:16.16-alpine as build
WORKDIR /app
COPY package*.json .
RUN npm install && npm cache clean --force
COPY prisma /prisma
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:16.16-alpine
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/*.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/doc ./doc
COPY --from=build /app/.env ./
EXPOSE 4000
CMD ["npm", "run", "start:dev"]
