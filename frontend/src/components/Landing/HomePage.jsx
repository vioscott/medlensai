import { useState } from 'react';
import {
  MicrophoneIcon,
  CpuChipIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  BuildingOffice2Icon,
  SparklesIcon,
  PhotoIcon,
  LockClosedIcon,
  CogIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import './HomePage.css';

export default function HomePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="homepage-container">
      {/* Navigation */}
      <nav className="homepage-nav">
        <div className="container">
          <div className="nav-content">
            <div className="nav-brand">
              <div className="nav-logo">
                <span>M</span>
              </div>
              <span className="nav-title">MedLens</span>
              <span className="nav-badge">AI</span>
            </div>

            {/* Desktop Navigation */}
            <div className="nav-links">
              <a href="#features" className="nav-link">Features</a>
              <a href="/security" className="nav-link">Security</a>
              <a href="/pricing" className="nav-link">Pricing</a>
              <a href="#contact" className="nav-link">Contact</a>
            </div>

            <div className="nav-actions">
              <a href="/login" className="nav-signin">Sign In</a>
              <a href="/login" className="btn btn-primary">Start Free Trial</a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-button"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="mobile-menu-icon" />
              ) : (
                <Bars3Icon className="mobile-menu-icon" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          <div className={`mobile-menu ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
            <div className="mobile-menu-links">
              <a href="#features" className="mobile-nav-link" onClick={closeMobileMenu}>Features</a>
              <a href="/security" className="mobile-nav-link" onClick={closeMobileMenu}>Security</a>
              <a href="/pricing" className="mobile-nav-link" onClick={closeMobileMenu}>Pricing</a>
              <a href="#contact" className="mobile-nav-link" onClick={closeMobileMenu}>Contact</a>
            </div>
            <div className="mobile-menu-actions">
              <a href="/login" className="mobile-nav-signin" onClick={closeMobileMenu}>Sign In</a>
              <a href="/login" className="btn btn-primary btn-mobile" onClick={closeMobileMenu}>Start Free Trial</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Transform Medical Documentation with
              <span className="hero-text-gradient"> AI-Powered</span> Transcription
            </h1>
            <p className="hero-subtitle">
              MedLens revolutionizes healthcare documentation by providing real-time transcription,
              intelligent medical entity extraction, and automated note generation - all while maintaining
              HIPAA compliance and the highest security standards.
            </p>
            <div className="hero-actions">
              <a href="/login" className="btn btn-primary btn-lg">
                Start Free 30-Day Trial
              </a>
              <a href="/demo" className="btn btn-outline btn-lg">
                Watch Demo
              </a>
            </div>
            <div className="trust-indicators">
              <div className="trust-indicator">
                <span className="trust-indicator-dot"></span>
                HIPAA Compliant
              </div>
              <div className="trust-indicator">
                <span className="trust-indicator-dot"></span>
                SOC 2 Certified
              </div>
              <div className="trust-indicator">
                <span className="trust-indicator-dot"></span>
                99.9% Uptime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-header">
            <h2 className="stats-title">
              Trusted by Healthcare Professionals Worldwide
            </h2>
            <p className="stats-subtitle">
              Join thousands of doctors, nurses, and healthcare administrators who rely on MedLens
              for accurate, efficient medical documentation.
            </p>
          </div>

          <div className="stats-grid">
            <div className="stat-item">
              <div className="stats-number">10,000+</div>
              <div className="stat-label">Healthcare Providers</div>
            </div>
            <div className="stat-item">
              <div className="stats-number">1M+</div>
              <div className="stat-label">Patient Encounters</div>
            </div>
            <div className="stat-item">
              <div className="stats-number">99.2%</div>
              <div className="stat-label">Transcription Accuracy</div>
            </div>
            <div className="stat-item">
              <div className="stats-number">45%</div>
              <div className="stat-label">Time Saved</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="features-header">
            <h2 className="features-title">
              Comprehensive Medical Documentation Suite
            </h2>
            <p className="features-subtitle">
              Everything you need to streamline medical documentation, improve accuracy,
              and save valuable time for patient care.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <MicrophoneIcon />
              </div>
              <h3 className="feature-title">Real-time Transcription</h3>
              <p className="feature-description">
                Advanced speech-to-text technology with medical terminology recognition
                and real-time processing for immediate documentation.
              </p>
              <ul className="feature-list">
                <li>• 99.2% accuracy rate</li>
                <li>• Medical vocabulary optimized</li>
                <li>• Multi-speaker recognition</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <CpuChipIcon />
              </div>
              <h3 className="feature-title">AI Entity Extraction</h3>
              <p className="feature-description">
                Automatically identify and extract medical entities like symptoms,
                medications, dosages, and procedures from transcribed text.
              </p>
              <ul className="feature-list">
                <li>• Symptoms & conditions</li>
                <li>• Medications & dosages</li>
                <li>• Procedures & tests</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <DocumentTextIcon />
              </div>
              <h3 className="feature-title">Smart Summarization</h3>
              <p className="feature-description">
                Generate professional medical summaries and patient-friendly explanations
                automatically from consultation transcripts.
              </p>
              <ul className="feature-list">
                <li>• Doctor summaries</li>
                <li>• Patient explanations</li>
                <li>• PDF export ready</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <PhotoIcon />
              </div>
              <h3 className="feature-title">Medical Image Analysis</h3>
              <p className="feature-description">
                Upload and analyze medical images with AI-powered classification
                and automated reporting capabilities.
              </p>
              <ul className="feature-list">
                <li>• X-ray analysis</li>
                <li>• Image classification</li>
                <li>• Automated reports</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <LockClosedIcon />
              </div>
              <h3 className="feature-title">HIPAA Compliance</h3>
              <p className="feature-description">
                Enterprise-grade security with end-to-end encryption, audit logging,
                and full HIPAA compliance for healthcare data protection.
              </p>
              <ul className="feature-list">
                <li>• End-to-end encryption</li>
                <li>• Audit trail logging</li>
                <li>• Role-based access</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <CogIcon />
              </div>
              <h3 className="feature-title">Workflow Integration</h3>
              <p className="feature-description">
                Seamlessly integrate with existing EMR systems and healthcare workflows
                with our comprehensive API and webhook support.
              </p>
              <ul className="feature-list">
                <li>• EMR integration</li>
                <li>• API & webhooks</li>
                <li>• Custom workflows</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">
              Ready to Transform Your Medical Documentation?
            </h2>
            <p className="cta-subtitle">
              Join thousands of healthcare professionals who have already improved their
              documentation efficiency with MedLens AI.
            </p>
            <div className="cta-actions">
              <a href="/login" className="btn btn-cta-primary btn-lg">
                Start Free Trial
              </a>
              <a href="/demo" className="btn btn-cta-outline btn-lg">
                Try Demo
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-section">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="footer-logo-icon">
                  <span>M</span>
                </div>
                <span className="footer-logo-text">MedLens</span>
              </div>
              <p className="footer-description">
                AI-powered medical transcription and documentation platform for healthcare professionals.
              </p>
            </div>
            <div className="footer-column">
              <h4 className="footer-heading">Product</h4>
              <ul className="footer-links">
                <li><a href="#features" className="footer-link">Features</a></li>
                <li><a href="/pricing" className="footer-link">Pricing</a></li>
                <li><a href="#features" className="footer-link">Demo</a></li>
                <li><a href="#features" className="footer-link">API</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4 className="footer-heading">Company</h4>
              <ul className="footer-links">
                <li><a href="#features" className="footer-link">About</a></li>
                <li><a href="#contact" className="footer-link">Contact</a></li>
                <li><a href="#features" className="footer-link">Careers</a></li>
                <li><a href="#features" className="footer-link">Blog</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4 className="footer-heading">Support</h4>
              <ul className="footer-links">
                <li><a href="/help" className="footer-link">Help Center</a></li>
                <li><a href="/privacy" className="footer-link">Privacy Policy</a></li>
                <li><a href="/terms" className="footer-link">Terms of Service</a></li>
                <li><a href="/security" className="footer-link">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 MedLens. All rights reserved. HIPAA Compliant Medical Documentation Platform.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
