FROM node:20-alpine
#Create a app directory
WORKDIR /app

#Copy package.json here ./ mean current directory i.e. /app
COPY  package*.json ./

## RUN COMMAND
# corepack will allow to use pnpm cmd
RUN corepack enable
RUN pnpm install

# Copy bundle app source means in app directory copy our code
COPY . .

# Build the app
RUN pnpm install typescript
RUN pnpm build

EXPOSE 3001

CMD ["pnpm", "start"]