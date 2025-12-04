# SmartFarm

A comprehensive React application for smart farming management, built with modern web technologies to help farmers optimize their operations, monitor crops and livestock, and make data-driven decisions.

## Live Demo

Check out the live demo: [https://smartfarm-b754e.web.app](https://smartfarm-b754e.web.app)

## Features

- **Dashboard**: Real-time weather forecasts, task management, inventory alerts, and farm overview
- **Crop Management**: Monitor crop health, track yields, and manage planting schedules
- **Livestock Management**: Track animal health, feeding schedules, and breeding records
- **Reports & Analytics**: Financial planning, yield tracking, and performance metrics with interactive charts
- **Admin Panel**: User management and system administration
- **Weather Integration**: Real-time weather data and 7-day forecasts using OpenWeatherMap API
- **Authentication**: Secure user authentication with Firebase
- **More Section**: About us, services, blogs, farming tools gallery, and contact information

## Tech Stack

- **Frontend**: React 19, Vite, React Router DOM
- **Styling**: Tailwind CSS, Bootstrap, Custom CSS
- **Backend**: Firebase (Authentication, Firestore Database, Hosting)
- **Charts**: Chart.js, React Chart.js 2
- **Icons**: React Icons
- **APIs**: OpenWeatherMap API for weather data
- **Build Tools**: Vite, ESLint, PostCSS, Autoprefixer

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd smartfarm
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your OpenWeatherMap API key:
   ```
   VITE_WEATHER_API_KEY=your_openweather_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Usage

- Register/Login to access the dashboard
- Navigate through different sections using the bottom navigation or sidebar
- Monitor weather conditions and farm health metrics
- Manage crops, livestock, and financial records
- View detailed reports and analytics with interactive charts
- Access additional information in the "More" section

## Project Structure

```
smartfarm/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── Admin.jsx       # Admin panel
│   │   ├── Auth.jsx        # Authentication
│   │   ├── Crops.jsx       # Crop management
│   │   ├── Home.jsx        # Home component
│   │   ├── Livestock.jsx   # Livestock management
│   │   ├── More.jsx        # Additional features
│   │   └── ...
│   ├── contexts/           # React contexts
│   ├── firebase/           # Firebase configuration
│   ├── styles/             # CSS stylesheets
│   ├── App.jsx             # Main app component
│   └── main.jsx            # App entry point
├── package.json
├── vite.config.js
└── README.md
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Contact

For support or inquiries, contact the developer:
- GitHub: [gregory656](https://github.com/gregory656)
- Instagram: [@reddevcode](https://instagram.com/reddevcode)
- WhatsApp: [+254719637416](https://wa.me/0719637416)
- Email: gregorystephen2006@gmail.com
