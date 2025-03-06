FROM node:16-alpine

WORKDIR /app

# Install Firebase CLI
RUN npm install -g firebase-tools

COPY . .

# Expose ports for Firebase emulators
EXPOSE 9099 8080 4000

# Start emulators
CMD ["firebase", "emulators:start", "--project=task-manager", "--import=./data", "--export-on-exit=./data"]