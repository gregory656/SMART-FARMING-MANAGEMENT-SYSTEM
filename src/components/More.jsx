import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import './More.css';

const More = () => {
  const [activeTab, setActiveTab] = useState('about');
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'about':
        const aboutInfo = [
          {
            id: 1,
            icon: "🌱",
            title: "Our Mission",
            description: "To promote sustainable agriculture through technology-driven solutions that help farmers optimize their operations, reduce environmental impact, and increase productivity for a better future."
          },
          {
            id: 2,
            icon: "👨‍💻",
            title: "Developer Team",
            description: "Meet Gregory Stephen, our Lead Developer passionate about creating innovative farming solutions. Connect with him on GitHub, Instagram, and WhatsApp for collaboration and support."
          }
        ];

        return (
          <div className="tab-content">
            <h2>About Us</h2>
            <div className="about-container">
              {aboutInfo.map(info => (
                <div key={info.id} className="about-card">
                  <div className="about-icon-large">{info.icon}</div>
                  <h3 className="about-title">{info.title}</h3>
                  <div className="about-description">
                    <p>{info.description}</p>
                  </div>
                  {info.id === 2 && (
                    <div className="about-links">
                      <a href="https://github.com/gregorystephen" target="_blank" rel="noopener noreferrer" className="about-link github">
                        <span className="icon">🐙</span> GitHub
                      </a>
                      <a href="https://instagram.com/gregorystephen" target="_blank" rel="noopener noreferrer" className="about-link instagram">
                        <span className="icon">📷</span> Instagram
                      </a>
                      <a href="https://wa.me/0719637416" target="_blank" rel="noopener noreferrer" className="about-link whatsapp">
                        <span className="icon">💬</span> WhatsApp
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      case 'services':
        const services = [
          {
            id: 1,
            icon: "💧",
            title: "Smart Irrigation Management",
            description: "Optimize water usage with AI-driven irrigation systems that monitor soil moisture levels and automatically adjust watering schedules to prevent overwatering and conserve resources."
          },
          {
            id: 2,
            icon: "🐛",
            title: "Pest Control Monitoring",
            description: "Advanced pest detection systems using sensors and cameras to identify pest infestations early, allowing for targeted interventions and reducing the need for broad-spectrum pesticides."
          },
          {
            id: 3,
            icon: "💰",
            title: "Financial Planning & Farm Budgeting",
            description: "Comprehensive financial management tools to track expenses, plan budgets, monitor profitability, and make data-driven decisions for sustainable farm operations."
          },
          {
            id: 4,
            icon: "📊",
            title: "Yield Tracking",
            description: "Real-time yield monitoring and prediction analytics that help farmers optimize crop production, track performance metrics, and improve future planning."
          },
          {
            id: 5,
            icon: "⚙️",
            title: "Resource Optimization",
            description: "Intelligent resource management systems that optimize the use of fertilizers, pesticides, and other inputs while maximizing productivity and minimizing environmental impact."
          }
        ];

        return (
          <div className="tab-content">
            <h2>Our Services</h2>
            <div className="services-container">
              {services.map(service => (
                <div key={service.id} className="service-card">
                  <div className="service-icon-large">{service.icon}</div>
                  <h3 className="service-title">{service.title}</h3>
                  <div className="service-description">
                    <p>{service.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'blogs':
        const [expandedBlogs, setExpandedBlogs] = useState({});

        const toggleBlogExpansion = (blogId) => {
          setExpandedBlogs(prev => ({
            ...prev,
            [blogId]: !prev[blogId]
          }));
        };

        const blogs = [
          {
            id: 1,
            title: "Best Farming Practices for Sustainable Agriculture",
            image: "🌾",
            excerpt: "Sustainable farming practices are essential for long-term agricultural success. This comprehensive guide covers crop rotation, organic pest control, water conservation techniques, and soil health management.",
            content: "Sustainable farming practices are essential for long-term agricultural success. This comprehensive guide covers crop rotation, organic pest control, water conservation techniques, and soil health management. By implementing these practices, farmers can reduce costs, improve soil quality, and create a more resilient farming operation. Key topics include integrated pest management, precision irrigation, and regenerative agriculture techniques that restore soil health and biodiversity. Learn about the benefits of cover cropping, the importance of maintaining soil organic matter, and how to implement conservation tillage practices. Discover how sustainable farming not only protects the environment but also improves long-term profitability through reduced input costs and enhanced ecosystem services."
          },
          {
            id: 2,
            title: "Revolutionizing Agriculture with IoT and Smart Technologies",
            image: "🤖",
            excerpt: "The Internet of Things (IoT) is revolutionizing agriculture by providing real-time data and automation capabilities. Smart sensors monitor soil moisture, temperature, and nutrient levels.",
            content: "The Internet of Things (IoT) is revolutionizing agriculture by providing real-time data and automation capabilities. Smart sensors monitor soil moisture, temperature, and nutrient levels, while automated irrigation systems optimize water usage. Drones equipped with multispectral cameras provide detailed crop health analysis, and AI-powered analytics help predict yields and detect problems early. This blog explores the latest IoT innovations and how they're helping farmers increase productivity and reduce waste. Discover how precision agriculture technologies are enabling variable rate application of fertilizers and pesticides, reducing costs while improving environmental outcomes. Learn about the integration of weather forecasting, soil sensors, and automated machinery to create truly smart farming operations."
          },
          {
            id: 3,
            title: "From Struggle to Success: Inspiring Farmer Stories",
            image: "🌟",
            excerpt: "Every successful farmer has a unique journey filled with challenges and triumphs. This collection of inspiring stories showcases individuals who overcame adversity through innovation.",
            content: "Every successful farmer has a unique journey filled with challenges and triumphs. This collection of inspiring stories showcases individuals who overcame adversity through innovation, perseverance, and smart technology adoption. From small-scale organic farmers to large commercial operations, these stories demonstrate how embracing new technologies and sustainable practices can lead to remarkable transformations. Learn from their experiences and discover the strategies that turned struggling operations into thriving businesses. Meet farmers who successfully transitioned to regenerative agriculture, implemented precision farming technologies, and built resilient operations that weather market fluctuations and climate challenges. These stories highlight the importance of continuous learning, adaptation, and community support in agricultural success."
          }
        ];

        return (
          <div className="tab-content">
            <h2>Latest Blogs</h2>
            <div className="blogs-container">
              {blogs.map(blog => (
                <div key={blog.id} className="blog-card">
                  <div className="blog-image">{blog.image}</div>
                  <h3 className="blog-title">{blog.title}</h3>
                  <div className="blog-content">
                    <p className="blog-excerpt">{blog.excerpt}</p>
                    {expandedBlogs[blog.id] && (
                      <p className="blog-full-content">{blog.content}</p>
                    )}
                    <button
                      className={expandedBlogs[blog.id] ? "read-less-btn" : "read-more-btn"}
                      onClick={() => toggleBlogExpansion(blog.id)}
                    >
                      {expandedBlogs[blog.id] ? "Read Less" : "Read More"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'gallery':
        const fertilizers = [
          {
            id: 1,
            name: "NPK 20-20-20 Fertilizer",
            image: "🌱",
            price: "$25.99",
            quality: "Premium Grade A",
            quantity: "50kg bag",
            description: "Balanced nitrogen, phosphorus, and potassium fertilizer perfect for all crops. Promotes healthy root development and abundant yields."
          },
          {
            id: 2,
            name: "Organic Compost",
            image: "🌿",
            price: "$18.50",
            quality: "100% Organic",
            quantity: "25kg bag",
            description: "Rich organic compost made from natural materials. Improves soil structure, retains moisture, and provides essential nutrients for sustainable farming."
          },
          {
            id: 3,
            name: "Calcium Nitrate Fertilizer",
            image: "⚗️",
            price: "$32.75",
            quality: "High Purity",
            quantity: "25kg bag",
            description: "Fast-acting calcium and nitrogen fertilizer. Prevents calcium deficiencies, strengthens cell walls, and improves fruit quality."
          },
          {
            id: 4,
            name: "Potassium Sulfate",
            image: "🧪",
            price: "$28.90",
            quality: "Agricultural Grade",
            quantity: "50kg bag",
            description: "Excellent source of potassium and sulfur. Enhances drought resistance, improves fruit quality, and increases overall plant health."
          },
          {
            id: 5,
            name: "Urea Fertilizer",
            image: "🌾",
            price: "$22.45",
            quality: "Industrial Grade",
            quantity: "50kg bag",
            description: "High-nitrogen fertilizer ideal for rapid growth. Cost-effective solution for nitrogen-deficient soils and maximum crop productivity."
          },
          {
            id: 6,
            name: "Bone Meal Fertilizer",
            image: "🦴",
            price: "$15.99",
            quality: "Natural Organic",
            quantity: "10kg bag",
            description: "Slow-release phosphorus fertilizer from natural sources. Perfect for root vegetables, flowers, and establishing strong root systems."
          }
        ];

        return (
          <div className="tab-content">
            <h2>Fertilizer Gallery</h2>
            <div className="gallery-container">
              {fertilizers.map(fertilizer => (
                <div key={fertilizer.id} className="gallery-card">
                  <div className="gallery-image">{fertilizer.image}</div>
                  <h3 className="gallery-title">{fertilizer.name}</h3>
                  <div className="gallery-details">
                    <p className="gallery-price"><strong>Price:</strong> {fertilizer.price}</p>
                    <p className="gallery-quality"><strong>Quality:</strong> {fertilizer.quality}</p>
                    <p className="gallery-quantity"><strong>Quantity:</strong> {fertilizer.quantity}</p>
                    <p className="gallery-description">{fertilizer.description}</p>
                  </div>
                  <button className="order-btn">Order Now</button>
                </div>
              ))}
            </div>
          </div>
        );
      case 'contact': {
        const handleContactSubmit = async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const messageData = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            message: formData.get('message'),
            createdAt: new Date(),
          };
          await addDoc(collection(db, 'users', currentUser.uid, 'messages'), messageData);
          alert('Message sent successfully!');
          e.target.reset();
        };

        return (
          <div className="tab-content">
            <h2>Contact Us</h2>
            <div className="developer-accounts">
              <h3>Developer Accounts</h3>
              <div className="account-links">
                <a href="https://github.com/gregorystephen" target="_blank" rel="noopener noreferrer" className="account-link github">
                  <span className="icon">🐙</span> GitHub
                </a>
                <a href="https://instagram.com/gregorystephen" target="_blank" rel="noopener noreferrer" className="account-link instagram">
                  <span className="icon">📷</span> Instagram
                </a>
                <a href="https://wa.me/0719637416" target="_blank" rel="noopener noreferrer" className="account-link whatsapp">
                  <span className="icon">💬</span> WhatsApp
                </a>
              </div>
            </div>
            <form className="contact-form" onSubmit={handleContactSubmit}>
              <input type="text" name="name" placeholder="Full Name" required />
              <input type="tel" name="phone" placeholder="Phone" required />
              <input type="email" name="email" placeholder="Email" required />
              <textarea name="message" placeholder="Message" required></textarea>
              <button type="submit">Send Message</button>
            </form>
            <div className="contact-info">
              <p>Phone: <a href="https://wa.me/0719637416">wa.me/0719637416</a></p>
              <p>Email: gregorystephen2006@gmail.com</p>
            </div>
          </div>
        );
      }
      case 'settings':
        const handleLoginAnother = async () => {
          await logout();
          navigate('/');
        };

        return (
          <div className="tab-content">
            <h2>Settings</h2>
            <div className="settings-section">
              <h3>Account</h3>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
              <button onClick={handleLoginAnother} className="login-another-btn">Login to Another Account</button>
            </div>
            <div className="settings-section">
              <h3>Theme</h3>
              <div className="theme-buttons">
                <button>Light</button>
                <button>Dark</button>
                <button>Green</button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="more-container">
      <div className="tabs">
        <button onClick={() => setActiveTab('about')}>About Us</button>
        <button onClick={() => setActiveTab('services')}>Services</button>
        <button onClick={() => setActiveTab('blogs')}>Blogs</button>
        <button onClick={() => setActiveTab('gallery')}>Gallery</button>
        <button onClick={() => setActiveTab('contact')}>Contact Us</button>
        <button onClick={() => setActiveTab('settings')}>Settings</button>
      </div>
      {renderTab()}
    </div>
  );
};

export default More;
