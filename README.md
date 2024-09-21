
# Krushidyog

Krushidyog is a web application designed to connect farmers, buyers, and agricultural service providers on a single platform. This application serves as a marketplace and information hub for the agricultural sector, enabling users to buy and sell products, access agricultural services, and learn about the latest advancements in farming technology.

## Features

- **Marketplace for Agricultural Products**: Farmers can list their products, and buyers can browse and purchase.
- **Service Provider Directory**: Agricultural service providers such as equipment sellers, consultants, and technicians can offer their services.
- **Real-time Updates**: Users can stay updated on market prices, weather forecasts, and relevant agricultural news.
- **User Registration and Authentication**: Secure login and account management for farmers, buyers, and service providers.
- **Responsive Design**: The application is fully responsive, providing a seamless experience across devices.
  
## Technologies Used

- **Frontend**:  HTML5, CSS3, JavaScript , EJS 
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: passport
- 

## Installation

1. Clone the repository:
```bash
git clone https://github.com/YugandharDorugade/KrushiDyog.git
```

2. Navigate to the project directory:

   ```bash
   cd krushidyog
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Set up your environment variables by creating a `.env` file in the root directory. Add the following:

   ```bash
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   API_KEY=your_api_key_for_market_and_weather_data
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:8080`.

## Usage

1. Register as a farmer, buyer, or service provider.
2. Farmers can post their agricultural products with details and pricing.
3. Buyers can browse the marketplace and make purchases.
4. Service providers can offer their services, and users can contact them directly.
5. Stay informed with real-time updates on market prices and weather forecasts.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new feature branch (`git checkout -b feature/new-feature`).
3. Commit your changes (`git commit -m 'Add some new feature'`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Open a pull request.

##
Deployment
View live application at https://krushidyog.onrender.com/home







