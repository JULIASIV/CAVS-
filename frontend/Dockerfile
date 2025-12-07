FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


FROM node:18-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/build ./build

EXPOSE 3000

ENV REACT_APP_API_URL=http://api:8000
ENV REACT_APP_ENV=production
ENV REACT_APP_DEBUG=false

CMD ["serve", "-s", "build", "-l", "3000"]
