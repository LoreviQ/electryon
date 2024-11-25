FROM node:20
COPY package*.json ./
RUN npm install
COPY . .
RUN npx remix vite:build
EXPOSE 3000
CMD ["npx", "remix-serve", "build/server/index.js"]