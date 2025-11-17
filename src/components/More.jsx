import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import './More.css';

const More = () => {
  const [activeTab, setActiveTab] = useState('about');
  const [expandedBlogs, setExpandedBlogs] = useState({});
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
            icon: "steve.png",
            title: "Our Mission",
            description: "To promote sustainable agriculture through technology-driven solutions that help farmers optimize their operations, reduce environmental impact, and increase productivity for a better future."
          },
          {
            id: 2,
            icon: "steve.png",
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
                  <div className="about-icon-large">
                    <img src={info.icon} alt={info.title} style={{ width: '50px', height: '50px' }} />
                  </div>
                  <h3 className="about-title">{info.title}</h3>
                  <div className="about-description">
                    <p>{info.description}</p>
                  </div>
                  {info.id === 2 && (
                    <div className="about-links">
                      <a href="https://github.com/gregory656" target="_blank" rel="noopener noreferrer" className="about-link github">
                        <span className="icon">🐙</span> GitHub
                      </a>
                      <a href="https://instagram.com/reddevcode" target="_blank" rel="noopener noreferrer" className="about-link instagram">
                        <span className="icon">📷</span> Instagram
                      </a>
                      <a href="wa.me/0719637416" target="_blank" rel="noopener noreferrer" className="about-link whatsapp">
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
            icon: "steve.png",
            title: "Smart Irrigation Management",
            description: "Optimize water usage with AI-driven irrigation systems that monitor soil moisture levels and automatically adjust watering schedules to prevent overwatering and conserve resources."
          },
          {
            id: 2,
            icon: "steve.png",
            title: "Pest Control Monitoring",
            description: "Advanced pest detection systems using sensors and cameras to identify pest infestations early, allowing for targeted interventions and reducing the need for broad-spectrum pesticides."
          },
          {
            id: 3,
            icon: "steve.png",
            title: "Financial Planning & Farm Budgeting",
            description: "Comprehensive financial management tools to track expenses, plan budgets, monitor profitability, and make data-driven decisions for sustainable farm operations."
          },
          {
            id: 4,
            icon: "steve.png",
            title: "Yield Tracking",
            description: "Real-time yield monitoring and prediction analytics that help farmers optimize crop production, track performance metrics, and improve future planning."
          },
          {
            id: 5,
            icon: "steve.png",
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
                  <div className="gallery-image">
                    <img src={service.icon} alt={service.title} />
                  </div>
                  <h3 className="gallery-title">{service.title}</h3>
                  <div className="service-description">
                    <p>{service.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'blogs':
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
            image: "steve.png",
            excerpt: "Sustainable farming practices are essential for long-term agricultural success. This comprehensive guide covers crop rotation, organic pest control, water conservation techniques, and soil health management.",
            content: "Sustainable farming practices are essential for long-term agricultural success. This comprehensive guide covers crop rotation, organic pest control, water conservation techniques, and soil health management. By implementing these practices, farmers can reduce costs, improve soil quality, and create a more resilient farming operation. Key topics include integrated pest management, precision irrigation, and regenerative agriculture techniques that restore soil health and biodiversity. Learn about the benefits of cover cropping, the importance of maintaining soil organic matter, and how to implement conservation tillage practices. Discover how sustainable farming not only protects the environment but also improves long-term profitability through reduced input costs and enhanced ecosystem services."
          },
          {
            id: 2,
            title: "Revolutionizing Agriculture with IoT and Smart Technologies",
            image: "steve.png",
            excerpt: "The Internet of Things (IoT) is revolutionizing agriculture by providing real-time data and automation capabilities. Smart sensors monitor soil moisture, temperature, and nutrient levels.",
            content: "The Internet of Things (IoT) is revolutionizing agriculture by providing real-time data and automation capabilities. Smart sensors monitor soil moisture, temperature, and nutrient levels, while automated irrigation systems optimize water usage. Drones equipped with multispectral cameras provide detailed crop health analysis, and AI-powered analytics help predict yields and detect problems early. This blog explores the latest IoT innovations and how they're helping farmers increase productivity and reduce waste. Discover how precision agriculture technologies are enabling variable rate application of fertilizers and pesticides, reducing costs while improving environmental outcomes. Learn about the integration of weather forecasting, soil sensors, and automated machinery to create truly smart farming operations."
          },
          {
            id: 3,
            title: "From Struggle to Success: Inspiring Farmer Stories",
            image: "steve.png",
            excerpt: "Every successful farmer has a unique journey filled with challenges and triumphs. This collection of inspiring stories showcases individuals who overcame adversity through innovation.",
            content: "Every successful farmer has a unique journey filled with challenges and triumphs. This collection of inspiring stories showcases individuals who overcame adversity through innovation, perseverance, and smart technology adoption. From small-scale organic farmers to large commercial operations, these stories demonstrate how embracing new technologies and sustainable practices can lead to remarkable transformations. Learn from their experiences and discover the strategies that turned struggling operations into thriving businesses. Meet farmers who successfully transitioned to regenerative agriculture, implemented precision farming technologies, and built resilient operations that weather market fluctuations and climate challenges. These stories highlight the importance of continuous learning, adaptation, and community support in agricultural success."
          }
        ];

        return (
          <div className="tab-content">
            <h2>Latest Blogs</h2>
            <div className="row">
              {blogs.map(blog => (
                <div key={blog.id} className="col-md-6 mb-4">
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="gallery-image">
                        <img src={blog.image} alt={blog.title} />
                      </div>
                      <h3 className="gallery-title">{blog.title}</h3>
                      <p className="card-text">{blog.excerpt}</p>
                      {expandedBlogs[blog.id] && (
                        <p className="card-text">{blog.content}</p>
                      )}
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => toggleBlogExpansion(blog.id)}
                      >
                        {expandedBlogs[blog.id] ? "Read Less" : "Read More"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'gallery':
        const farmingTools = [
          {
            id: 1,
            name: "Tractor",
            image: "https://picsum.photos/seed/tractor/200/200",
            price: "$15,000",
            quality: "Heavy Duty",
            quantity: "1 unit",
            description: "Powerful tractor for plowing, tilling, and hauling. Essential for modern farming operations."
          },
          {
            id: 2,
            name: "Irrigation System",
            image: "https://picsum.photos/seed/irrigation/200/200",
            price: "$2,500",
            quality: "Drip Irrigation",
            quantity: "1 acre kit",
            description: "Efficient drip irrigation system that conserves water and delivers nutrients directly to plant roots."
          },
          {
            id: 3,
            name: "Plow",
            image: "https://picsum.photos/seed/plow/200/200",
            price: "$800",
            quality: "Steel Blade",
            quantity: "1 unit",
            description: "Durable plow for breaking up soil and preparing fields for planting."
          },
          {
            id: 4,
            name: "Seeder",
            image: "https://picsum.photos/seed/seeder/200/200",
            price: "$1,200",
            quality: "Precision Seeding",
            quantity: "1 unit",
            description: "Precision seeder for accurate seed placement and optimal crop spacing."
          },
          {
            id: 5,
            name: "Harvester",
            image: "https://picsum.photos/seed/harvester/200/200",
            price: "$25,000",
            quality: "Combine Harvester",
            quantity: "1 unit",
            description: "Advanced combine harvester for efficient grain harvesting and threshing."
          },
          {
            id: 6,
            name: "Sprayer",
            image: "https://picsum.photos/seed/sprayer/200/200",
            price: "$600",
            quality: "Backpack Sprayer",
            quantity: "1 unit",
            description: "Portable sprayer for applying pesticides, herbicides, and fertilizers."
          }
        ];

        return (
          <div className="tab-content">
            <h2>Farming Tools Gallery</h2>
            <div className="gallery-container">
              {farmingTools.map(tool => (
                <div key={tool.id} className="gallery-card">
                  <div className="gallery-image">
                    <img src={tool.image} alt={tool.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                  </div>
                  <h3 className="gallery-title">{tool.name}</h3>
                  <div className="gallery-details">
                    <p className="gallery-price"><strong>Price:</strong> {tool.price}</p>
                    <p className="gallery-quality"><strong>Quality:</strong> {tool.quality}</p>
                    <p className="gallery-quantity"><strong>Quantity:</strong> {tool.quantity}</p>
                    <p className="gallery-description">{tool.description}</p>
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
                <a href="https://github.com/gregory656" target="_blank" rel="noopener noreferrer" className="account-link github">
                  <span className="icon">🐙</span> GitHub
                </a>
                <a href="https://instagram.com/reddevcode" target="_blank" rel="noopener noreferrer" className="account-link instagram">
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
              <p>Phone: <a href="https://wa.me/0719637416">0719637416</a></p>
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
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <ul className="nav nav-tabs" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'about' ? 'active' : ''}`}
                onClick={() => setActiveTab('about')}
              >
                About Us
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'services' ? 'active' : ''}`}
                onClick={() => setActiveTab('services')}
              >
                Services
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'blogs' ? 'active' : ''}`}
                onClick={() => setActiveTab('blogs')}
              >
                Blogs
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'gallery' ? 'active' : ''}`}
                onClick={() => setActiveTab('gallery')}
              >
                Gallery
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'contact' ? 'active' : ''}`}
                onClick={() => setActiveTab('contact')}
              >
                Contact Us
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                Settings
              </button>
            </li>
          </ul>
          <div className="more-tab-wrapper mt-4">
            {renderTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default More;
