import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { FiHome, FiFeather, FiPieChart, FiMoreHorizontal } from "react-icons/fi";
import AuthProvider from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import { db, WEATHER_API_KEY } from './firebase/config.js';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import Auth from './components/Auth';
import Home from './components/Home';
import Crops from './components/Crops';
import Livestock from './components/Livestock';
import OrderNow from './components/OrderNow';
import More from './components/More';
import Admin from './components/Admin';
import './App.css';
import './styles/dashboard.css';
import './styles/weathercard.css';
import './styles/taskcard.css';
import './styles/reports.css';

// Inlined Components

const WeatherCard = ({ weather, loading }) => {
  const iconForCondition = (condition) => {
    if (!condition) return "☀";
    const c = condition.toLowerCase();

    if (c.includes("cloud")) return "⛅";
    if (c.includes("rain")) return "🌧";
    if (c.includes("storm")) return "⛈";
    if (c.includes("clear")) return "☀";
    return "🌤"; // fallback
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="weather-card">
      <h3 className="section-title">WEATHER FORECAST</h3>

      {/* Loading skeleton */}
      {loading && (
        <div className="weather-loading">
          <div className="loader-circle"></div>
          <p>Fetching weather...</p>
        </div>
      )}

      {/* Weather Loaded */}
      {!loading && weather && (
        <>
          <div className="weather-content">
            <div className="weather-left">
              <div className="weather-icon">{iconForCondition(weather.condition)}</div>
              <h1 className="weather-temp">{weather.temp}°C</h1>
              <p className="weather-desc">{weather.condition}</p>
            </div>

            <div className="weather-right">
              <div className="health-circle">
                <svg width="80" height="80">
                  {/* Background Circle */}
                  <circle
                    cx="40"
                    cy="40"
                    r="30"
                    stroke="#e6e6e6"
                    strokeWidth="8"
                    fill="none"
                  />

                  {/* Green Progress */}
                  <circle
                    cx="40"
                    cy="40"
                    r="30"
                    stroke="#4CAF50"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={2 * Math.PI * 30}
                    strokeDashoffset={
                      (2 * Math.PI * 30 * (100 - weather.healthPercent)) / 100
                    }
                    strokeLinecap="round"
                    transform="rotate(-90 40 40)"
                  />
                </svg>
              </div>

              <p className="health-percent">{weather.healthPercent}% Healthy</p>
              <p className="crop-status">Wheat: Good, Corn: Monitor</p>
            </div>
          </div>

          {/* 3-Day Forecast */}
          {weather.daily && weather.daily.length > 0 ? (
            <div className="forecast-section">
              <h4>3-Day Forecast</h4>
              <div className="forecast-list">
                {weather.daily.slice(0, 3).map((day, index) => (
                  <div key={index} className="forecast-day">
                    <p className="forecast-date">{formatDate(day.dt)}</p>
                    <div className="forecast-icon">{iconForCondition(day.weather && day.weather[0] ? day.weather[0].main : '')}</div>
                    <p className="forecast-temp">{Math.round(day.temp.day)}°C</p>
                    <p className="forecast-desc">{day.weather && day.weather[0] ? day.weather[0].main : 'Unknown'}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="forecast-error">Forecast unavailable</p>
          )}
        </>
      )}

      {/* Fallback if failed to load */}
      {!loading && !weather && (
        <p className="weather-error">Weather unavailable</p>
      )}
    </div>
  );
};

const TaskCard = ({ task, onClick }) => {
  const fallbackTask = {
    title: "Irrigate Field 3",
    time: "03:00 PM",
    priority: "High",
  };

  const activeTask = task || fallbackTask;

  // Normalize props to handle different data structures
  const normalizedTask = {
    title: activeTask.title || fallbackTask.title,
    time: activeTask.time || activeTask.due || fallbackTask.time,
    priority: activeTask.priority || fallbackTask.priority,
  };

  return (
    <div className="task-card" onClick={onClick}>
      <div className="task-left">
        <div className="task-icon">📝</div>
        <div>
          <h3 className="task-title">{normalizedTask.title}</h3>
          <p className="task-time">{normalizedTask.time}</p>
        </div>
      </div>

      <div className="task-right">
        <span className={`priority-badge priority-${normalizedTask.priority.toLowerCase()}`}>
          {normalizedTask.priority}
        </span>
      </div>
    </div>
  );
};

const InventoryAlertCard = ({ onOrder }) => {
  return (
    <div className="card alert-card">
      <h4>FERTILIZER LOW</h4>
      <button onClick={onOrder}>Order More</button>
    </div>
  );
};

const FarmOverview = ({ onViewMap }) => {
  return (
    <div className="card farm-card">
      <h4>Farm Overview</h4>

      <div className="farm-grid">
        {Array(12).fill(0).map((_, i) => (
          <div key={i} className="farm-box"></div>
        ))}
      </div>

      <button className="map-btn" onClick={onViewMap}>View Full Map</button>
    </div>
  );
};

const NotificationCard = ({ type, message }) => {
  return (
    <div className={`card notif-card ${type}`}>
      {message}
    </div>
  );
};

const BottomNav = ({ onDashboard, onCrops, onLivestock, onReports, onMore }) => {
  return (
    <div className="bottom-nav">
      <div>
        <span onClick={onDashboard} className="nav-icon"><FiHome size={24}/></span>
        <span onClick={onDashboard} className="nav-text">Dashboard</span>
      </div>
      <div>
        <span onClick={onCrops} className="nav-icon"><FiFeather size={24}/></span>
        <span onClick={onCrops} className="nav-text">Crops</span>
      </div>
      <div>
        <span onClick={onLivestock} className="nav-icon"><FiPieChart size={24}/></span>
        <span onClick={onLivestock} className="nav-text">Livestock</span>
      </div>
      <div>
        <span onClick={onReports} className="nav-icon"><FiMoreHorizontal size={24}/></span>
        <span onClick={onReports} className="nav-text">Reports</span>
      </div>
      <div>
        <span onClick={onMore} className="nav-icon"><FiMoreHorizontal size={24}/></span>
        <span onClick={onMore} className="nav-text">More</span>
      </div>
    </div>
  );
};

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Menu</h2>

      <ul className="sidebar-links">
        <li>
          <span onClick={() => navigate("/")} className="sidebar-icon">
            <img src="dashboard.png" alt="Dashboard" style={{ width: '20px', height: '20px' }} />
          </span>
          <span onClick={() => navigate("/")} className="sidebar-text">Dashboard</span>
        </li>
        <li>
          <span onClick={() => navigate("/crops")} className="sidebar-icon">
            <img src="crops.png" alt="Crops" style={{ width: '20px', height: '20px' }} />
          </span>
          <span onClick={() => navigate("/crops")} className="sidebar-text">Crops</span>
        </li>
        <li>
          <span onClick={() => navigate("/livestock")} className="sidebar-icon">
            <img src="livestock.png" alt="Livestock" style={{ width: '20px', height: '20px' }} />
          </span>
          <span onClick={() => navigate("/livestock")} className="sidebar-text">Livestock</span>
        </li>
        <li>
          <span onClick={() => navigate("/reports")} className="sidebar-icon">
            <img src="reports.png" alt="Reports" style={{ width: '20px', height: '20px' }} />
          </span>
          <span onClick={() => navigate("/reports")} className="sidebar-text">Reports</span>
        </li>
        <li>
          <span onClick={() => navigate("/more")} className="sidebar-icon">
            <img src="more.png" alt="More" style={{ width: '20px', height: '20px' }} />
          </span>
          <span onClick={() => navigate("/more")} className="sidebar-text">More</span>
        </li>
      </ul>
    </div>
  );
};

// Inlined Pages

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // UI state
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // Helper to obtain API key:
  // 1) preferred: set environment variable VITE_WEATHER_API_KEY
  // 2) fallback: export WEATHER_API_KEY from src/firebase/config.js
  //    e.g. export const WEATHER_API_KEY = 'your_key_here';
  const WEATHER_KEY = import.meta.env.VITE_WEATHER_API_KEY || WEATHER_API_KEY;

  // Get last task and some demo alerts from Firestore (if any)
  useEffect(() => {
    const loadTasksAndAlerts = async () => {
      try {
        // try reading a "tasks" collection (demo)
        const q = query(collection(db, "tasks"), orderBy("due", "desc"), limit(6));
        const snap = await getDocs(q);
        const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setTasks(arr);

        // try reading an "alerts" collection
        const q2 = query(collection(db, "alerts"), orderBy("createdAt", "desc"), limit(6));
        const snap2 = await getDocs(q2);
        const a = snap2.docs.map((d) => ({ id: d.id, ...d.data() }));
        if (a.length) setAlerts(a);
        else {
          // fallback demo alerts
          setAlerts([
            { id: "a1", type: "danger", message: "Pest Detected in Field 3 — Take Action" },
            { id: "a2", type: "success", message: "Rain Expected in Field 3 in 4 Hours" },
          ]);
        }
      } catch (err) {
        console.warn("No Firestore tasks/alerts found or permission denied", err);
        // fallback sample
        setTasks([
          { id: "t1", title: "Irrigate Field 3", due: "Tomorrow, 7 AM" },
        ]);
        setAlerts([
          { id: "a1", type: "danger", message: "Pest Detected in Field 3 — Take Action" },
          { id: "a2", type: "success", message: "Rain Expected in Field 3 in 4 Hours" },
        ]);
      }
    };

    loadTasksAndAlerts();
  }, []);

  // Responsive handler (JS-only; no CSS edits required)
  useEffect(() => {
    const onResize = () => {
      // isMobile removed, but keeping resize logic if needed later
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Get weather using geolocation -> OpenWeather One Call
  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      if (!WEATHER_KEY) {
        console.error(
          "OpenWeather API key not found. Set VITE_WEATHER_API_KEY or export WEATHER_API_KEY in firebase/config.js"
        );
        setLoadingWeather(false);
        return;
      }

      try {
        // Use One Call 3.0 or Current Weather: here we use One Call-like endpoint (current + daily)
        const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly,alerts&appid=${WEATHER_KEY}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Weather fetch failed");
        const data = await res.json();

        // normalize to a small object used by WeatherCard
        const normalized = {
          temp: Math.round(data.current.temp),
          condition:
            data.current.weather && data.current.weather[0]
              ? data.current.weather[0].main
              : "Unknown",
          healthPercent: 92, // sample - real logic can be added later using farm data
          daily: data.daily ? data.daily.slice(0, 3) : [],
        };

        setWeather(normalized);
      } catch (err) {
        console.error("Weather fetch error:", err);
      } finally {
        setLoadingWeather(false);
      }
    };

    // try navigator geolocation
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchWeather(pos.coords.latitude, pos.coords.longitude);
        },
        (err) => {
          console.warn("Geolocation denied / failed, using fallback coords", err);
          // fallback coordinates (example: Nairobi)
          fetchWeather(-1.286389, 36.817223);
        },
        { timeout: 8000 }
      );
    } else {
      // no geolocation (fallback)
      fetchWeather(-1.286389, 36.817223);
    }
  }, [WEATHER_KEY]);

  // Navigation handlers
  const goToCrops = () => navigate("/crops");
  const goToLivestock = () => navigate("/livestock");
  const goToReports = () => navigate("/reports");
  const goToMore = () => navigate("/more");

  // Get user display name
  const getUserDisplayName = () => {
    if (currentUser) {
      // Try to get display name, then email prefix, fallback to "Manage your farm"
      const displayName = currentUser.displayName || currentUser.email?.split('@')[0] || 'Manage your farm';
      return `Welcome ${displayName}`;
    }
    return 'Manage your farm';
  };

  return (
    <div className="dashboard-container">
      <h1 className="title">{getUserDisplayName()}</h1>

      {/* Weather card (pass props if component supports them; component will show fallback UI if null) */}
      <WeatherCard weather={weather} loading={loadingWeather} />

      {/* Next Task card - use firestore task if available */}
      <TaskCard
        task={tasks.length ? tasks[0] : { title: "Irrigate Field 3", due: "Tomorrow, 7 AM" }}
        onClick={() => navigate("/more?open=task")}
      />

      {/* Inventory alert - keep same UI, supply click handler */}
      <InventoryAlertCard onOrder={() => navigate("/more?open=order")} />

      {/* Farm overview - keep component unchanged */}
      <FarmOverview onViewMap={() => navigate("/reports?panel=map")} />

      {/* Render alerts pulled from Firestore or fallback */}
      {alerts.map((a) => (
        <NotificationCard key={a.id} type={a.type || "danger"} message={a.message} />
      ))}

      {/* Floating New Task button still in BottomNav or separate */}
      <div style={{ height: 72 }} /> {/* spacing so bottom nav doesn't overlap */}

      <BottomNav
        onDashboard={() => navigate("/")}
        onCrops={goToCrops}
        onLivestock={goToLivestock}
        onReports={goToReports}
        onMore={goToMore}
      />
    </div>
  );
};





const Reports = () => {
  const [activePanel, setActivePanel] = useState('overview');
  const { currentUser } = useAuth();
  const [financeData, setFinanceData] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load financial data from Firestore
  useEffect(() => {
    const loadFinanceData = async () => {
      if (!currentUser) return;

      try {
        const financeRef = collection(db, 'users', currentUser.uid, 'finance');
        const snapshot = await getDocs(financeRef);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFinanceData(data);
      } catch (error) {
        console.error('Error loading finance data:', error);
      }
    };

    loadFinanceData();
  }, [currentUser]);

  // Load weather data
  useEffect(() => {
    const fetchWeather = async () => {
      const WEATHER_KEY = import.meta.env.VITE_WEATHER_API_KEY || WEATHER_API_KEY;

      if (!WEATHER_KEY) {
        setLoading(false);
        return;
      }

      try {
        // Use fallback coordinates
        const lat = -1.286389;
        const lon = 36.817223;
        const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly,alerts&appid=${WEATHER_KEY}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Weather fetch failed");
        const data = await res.json();

        setWeatherData(data);
      } catch (error) {
        console.error('Error loading weather data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  // Calculate financial metrics
  const totalIncome = financeData.filter(f => f.type === 'income').reduce((sum, f) => sum + (f.amount || 0), 0);
  const totalExpenses = financeData.filter(f => f.type === 'expense').reduce((sum, f) => sum + (f.amount || 0), 0);
  const netIncome = totalIncome - totalExpenses;

  // Sample crop yield data (in real app, this would come from Firestore)
  const cropYields = [
    { crop: 'Wheat', yield: 85, target: 100, unit: 'tons' },
    { crop: 'Corn', yield: 92, target: 95, unit: 'tons' },
    { crop: 'Rice', yield: 78, target: 85, unit: 'tons' },
    { crop: 'Soybeans', yield: 88, target: 90, unit: 'tons' }
  ];

  // Sample livestock data
  const livestockData = [
    { type: 'Cattle', count: 45, health: 95 },
    { type: 'Sheep', count: 120, health: 88 },
    { type: 'Poultry', count: 500, health: 92 }
  ];

  return (
    <div className="page-container">
      <Sidebar />
      <div className="page-content">
        <div className="topbar">
          <h1 className="topbar-title">Reports & Analytics</h1>
        </div>

        {/* Panel Navigation */}
        <div className="reports-nav">
          <button
            className={activePanel === 'overview' ? 'active' : ''}
            onClick={() => setActivePanel('overview')}
          >
            Overview
          </button>
          <button
            className={activePanel === 'finance' ? 'active' : ''}
            onClick={() => setActivePanel('finance')}
          >
            Finance
          </button>
          <button
            className={activePanel === 'crops' ? 'active' : ''}
            onClick={() => setActivePanel('crops')}
          >
            Crops
          </button>
          <button
            className={activePanel === 'livestock' ? 'active' : ''}
            onClick={() => setActivePanel('livestock')}
          >
            Livestock
          </button>
          <button
            className={activePanel === 'weather' ? 'active' : ''}
            onClick={() => setActivePanel('weather')}
          >
            Weather
          </button>
        </div>

        {/* Panel Content */}
        <div className="reports-content">
          {activePanel === 'overview' && (
            <div className="overview-panel">
              <div className="overview-grid">
                <div className="overview-card">
                  <h3>Total Income</h3>
                  <div className="metric">${totalIncome.toFixed(2)}</div>
                  <div className="trend positive">+12% from last month</div>
                </div>
                <div className="overview-card">
                  <h3>Total Expenses</h3>
                  <div className="metric">${totalExpenses.toFixed(2)}</div>
                  <div className="trend negative">+8% from last month</div>
                </div>
                <div className="overview-card">
                  <h3>Net Income</h3>
                  <div className="metric">${netIncome.toFixed(2)}</div>
                  <div className={`trend ${netIncome >= 0 ? 'positive' : 'negative'}`}>
                    {netIncome >= 0 ? '+' : ''}{(netIncome / totalIncome * 100).toFixed(1)}% margin
                  </div>
                </div>
                <div className="overview-card">
                  <h3>Farm Health</h3>
                  <div className="metric">92%</div>
                  <div className="health-bar">
                    <div className="health-fill" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePanel === 'finance' && (
            <div className="finance-panel">
              <div className="chart-container">
                <h3>Income vs Expenses</h3>
                <div className="chart-placeholder">
                  <div className="pie-chart">
                    <div className="pie-segment income" style={{ '--percentage': `${(totalIncome / (totalIncome + totalExpenses)) * 100}%` }}>
                      Income: ${totalIncome.toFixed(2)}
                    </div>
                    <div className="pie-segment expense" style={{ '--percentage': `${(totalExpenses / (totalIncome + totalExpenses)) * 100}%` }}>
                      Expenses: ${totalExpenses.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="finance-details">
                <h3>Recent Transactions</h3>
                <div className="transactions-list">
                  {financeData.slice(0, 10).map(item => (
                    <div key={item.id} className={`transaction-item ${item.type}`}>
                      <div className="transaction-info">
                        <span className="transaction-desc">{item.description}</span>
                        <span className="transaction-category">{item.category}</span>
                      </div>
                      <div className="transaction-amount">
                        {item.type === 'income' ? '+' : '-'}${item.amount?.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activePanel === 'crops' && (
            <div className="crops-panel">
              <div className="yield-charts">
                {cropYields.map(crop => (
                  <div key={crop.crop} className="yield-card">
                    <h4>{crop.crop} Yield</h4>
                    <div className="yield-bar">
                      <div
                        className="yield-fill"
                        style={{ width: `${(crop.yield / crop.target) * 100}%` }}
                      ></div>
                    </div>
                    <div className="yield-stats">
                      <span>{crop.yield} / {crop.target} {crop.unit}</span>
                      <span className={`yield-percent ${crop.yield >= crop.target ? 'good' : 'warning'}`}>
                        {((crop.yield / crop.target) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="crop-health">
                <h3>Overall Crop Health</h3>
                <div className="health-overview">
                  <div className="health-item">
                    <span>Soil Moisture</span>
                    <div className="health-bar">
                      <div className="health-fill moisture" style={{ width: '75%' }}></div>
                    </div>
                    <span>75%</span>
                  </div>
                  <div className="health-item">
                    <span>Pest Control</span>
                    <div className="health-bar">
                      <div className="health-fill pest" style={{ width: '88%' }}></div>
                    </div>
                    <span>88%</span>
                  </div>
                  <div className="health-item">
                    <span>Nutrient Levels</span>
                    <div className="health-bar">
                      <div className="health-fill nutrient" style={{ width: '92%' }}></div>
                    </div>
                    <span>92%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePanel === 'livestock' && (
            <div className="livestock-panel">
              <div className="livestock-stats">
                {livestockData.map(livestock => (
                  <div key={livestock.type} className="livestock-card">
                    <h4>{livestock.type}</h4>
                    <div className="livestock-metrics">
                      <div className="metric">
                        <span className="label">Count</span>
                        <span className="value">{livestock.count}</span>
                      </div>
                      <div className="metric">
                        <span className="label">Health</span>
                        <div className="health-circle-small">
                          <svg width="40" height="40">
                            <circle cx="20" cy="20" r="15" stroke="#e6e6e6" strokeWidth="4" fill="none" />
                            <circle
                              cx="20"
                              cy="20"
                              r="15"
                              stroke="#4CAF50"
                              strokeWidth="4"
                              fill="none"
                              strokeDasharray={2 * Math.PI * 15}
                              strokeDashoffset={(2 * Math.PI * 15 * (100 - livestock.health)) / 100}
                              strokeLinecap="round"
                              transform="rotate(-90 20 20)"
                            />
                          </svg>
                          <span>{livestock.health}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="feeding-schedule">
                <h3>Feeding Schedule</h3>
                <div className="schedule-grid">
                  <div className="schedule-item">
                    <span className="time">6:00 AM</span>
                    <span className="activity">Morning Feed</span>
                  </div>
                  <div className="schedule-item">
                    <span className="time">12:00 PM</span>
                    <span className="activity">Midday Supplements</span>
                  </div>
                  <div className="schedule-item">
                    <span className="time">6:00 PM</span>
                    <span className="activity">Evening Feed</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePanel === 'weather' && (
            <div className="weather-panel">
              {loading ? (
                <div className="loading">Loading weather data...</div>
              ) : weatherData ? (
                <>
                  <div className="current-weather">
                    <h3>Current Weather</h3>
                    <div className="weather-info">
                      <div className="temp">{Math.round(weatherData.current.temp)}°C</div>
                      <div className="condition">
                        {weatherData.current.weather[0].main}
                      </div>
                      <div className="details">
                        <span>Humidity: {weatherData.current.humidity}%</span>
                        <span>Wind: {weatherData.current.wind_speed} m/s</span>
                      </div>
                    </div>
                  </div>

                  <div className="weather-forecast">
                    <h3>7-Day Forecast</h3>
                    <div className="forecast-grid">
                      {weatherData.daily.slice(0, 7).map((day, index) => (
                        <div key={index} className="forecast-item">
                          <div className="day">
                            {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                          </div>
                          <div className="forecast-temp">
                            {Math.round(day.temp.day)}°C
                          </div>
                          <div className="forecast-condition">
                            {day.weather[0].main}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="no-data">Weather data unavailable</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};



const AppContent = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Auth />;
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/crops" element={<Crops />} />
      <Route path="/livestock" element={<Livestock />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/order-now" element={<OrderNow />} />
      <Route path="/more" element={<More />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
