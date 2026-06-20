import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/shared/ScrollToTop';
import HomePage from './components/HomePage';
import PropertiesPage from './components/PropertiesPage';
import PropertyDetail from './components/PropertyDetail';
import HowItWorksPage from './components/HowItWorksPage';
import LearnPage from './components/LearnPage';
import ContactPage from './components/ContactPage';
import AboutPage from './components/AboutPage';
import NotFoundPage from './components/NotFoundPage';
import ChatPage from './components/ChatPage';

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/properties" element={<PropertiesPage />} />
        <Route path="/property/:id" element={<PropertyDetail />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
