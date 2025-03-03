# -CS4067-Assgt-EventBooking-i221059-Saad-Aamir-repo
# Event Booking Microservices

## 🏗️ Architecture
- User Service (MongoDB)
- Event Service (PostgreSQL)
- Booking Service (PostgreSQL)
- Notification Service (RabbitMQ)

## 🚀 Setup Guide
1. Clone the repository:
   ```sh
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git

cd user-service && npm install
cd ../event-service && npm install
cd ../booking-service && npm install
cd ../notification-service && npm install

cd user-service && nodemon index.js
cd ../event-service && nodemon index.js
cd ../booking-service && nodemon index.js
cd ../notification-service && nodemon index.js
