import './SecurityPage.css';

export default function SecurityPage() {
  const securityFeatures = [
    {
      icon: "🔐",
      title: "End-to-End Encryption",
      description: "All data is encrypted in transit and at rest using AES-256 encryption standards.",
      details: [
        "TLS 1.3 for data in transit",
        "AES-256 encryption for data at rest",
        "Encrypted database storage",
        "Secure key management"
      ]
    },
    {
      icon: "🏥",
      title: "HIPAA Compliance",
      description: "Full compliance with HIPAA regulations for handling protected health information.",
      details: [
        "Business Associate Agreements",
        "Administrative safeguards",
        "Physical safeguards",
        "Technical safeguards"
      ]
    },
    {
      icon: "🛡️",
      title: "SOC 2 Type II",
      description: "Independently audited and certified for security, availability, and confidentiality.",
      details: [
        "Annual SOC 2 audits",
        "Security controls validation",
        "Availability monitoring",
        "Confidentiality measures"
      ]
    },
    {
      icon: "🔍",
      title: "Continuous Monitoring",
      description: "24/7 security monitoring and threat detection across all systems.",
      details: [
        "Real-time threat detection",
        "Automated security alerts",
        "Incident response procedures",
        "Security event logging"
      ]
    },
    {
      icon: "👤",
      title: "Access Controls",
      description: "Strict access controls and authentication mechanisms protect your data.",
      details: [
        "Multi-factor authentication",
        "Role-based access control",
        "Principle of least privilege",
        "Regular access reviews"
      ]
    },
    {
      icon: "🏢",
      title: "Secure Infrastructure",
      description: "Enterprise-grade cloud infrastructure with multiple layers of security.",
      details: [
        "AWS/GCP secure cloud hosting",
        "Network segmentation",
        "DDoS protection",
        "Regular security updates"
      ]
    }
  ];

  const certifications = [
    {
      name: "HIPAA",
      description: "Health Insurance Portability and Accountability Act compliance",
      status: "Certified",
      date: "2024"
    },
    {
      name: "SOC 2 Type II",
      description: "Service Organization Control 2 audit certification",
      status: "Certified",
      date: "2024"
    },
    {
      name: "ISO 27001",
      description: "Information Security Management System certification",
      status: "In Progress",
      date: "2025"
    },
    {
      name: "GDPR",
      description: "General Data Protection Regulation compliance",
      status: "Compliant",
      date: "2024"
    }
  ];

  const securityPractices = [
    {
      category: "Data Protection",
      practices: [
        "Data minimization principles",
        "Automated data retention policies",
        "Secure data deletion procedures",
        "Data loss prevention (DLP) tools"
      ]
    },
    {
      category: "Network Security",
      practices: [
        "Web Application Firewall (WAF)",
        "Intrusion detection systems",
        "Network traffic monitoring",
        "VPN access for employees"
      ]
    },
    {
      category: "Application Security",
      practices: [
        "Secure code development practices",
        "Regular security code reviews",
        "Automated vulnerability scanning",
        "Penetration testing"
      ]
    },
    {
      category: "Incident Response",
      practices: [
        "24/7 security operations center",
        "Incident response playbooks",
        "Breach notification procedures",
        "Forensic investigation capabilities"
      ]
    }
  ];

  return (
    <div className="security-page">
      {/* Header */}
      <header className="security-header">
        <div className="container">
          <div className="security-header-content">
            <div>
              <h1 className="security-title">Security & Compliance</h1>
              <p className="security-subtitle">Enterprise-grade security for healthcare data</p>
            </div>
            <a href="/" className="btn btn-outline">Back to Home</a>
          </div>
        </div>
      </header>

      <main className="security-main">
        <div className="container">
          {/* Hero Section */}
          <div className="security-hero">
            <div className="hero-icon">🔒</div>
            <h2 className="hero-title">Security You Can Trust</h2>
            <p className="hero-description">
              MedLens is built with security and compliance at its core. We understand the critical importance 
              of protecting patient data and maintaining the highest standards of healthcare information security.
            </p>
          </div>

          {/* Security Features */}
          <div className="security-section">
            <h3 className="section-title">Security Features</h3>
            <div className="features-grid">
              {securityFeatures.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-card-body">
                    <div className="feature-header">
                      <div className="feature-icon">{feature.icon}</div>
                      <h4 className="feature-title">{feature.title}</h4>
                      <p className="feature-description">{feature.description}</p>
                    </div>
                    <ul className="feature-details">
                      {feature.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="feature-detail">
                          <span className="detail-check">✓</span>
                          <span className="detail-text">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="security-section">
            <h3 className="section-title">Certifications & Compliance</h3>
            <div className="certifications-grid">
              {certifications.map((cert, index) => (
                <div key={index} className="certification-card">
                  <div className="certification-card-body">
                    <div className={`certification-status ${
                      cert.status === 'Certified' || cert.status === 'Compliant' 
                        ? 'status-certified' 
                        : 'status-progress'
                    }`}>
                      {cert.status}
                    </div>
                    <h4 className="certification-name">{cert.name}</h4>
                    <p className="certification-description">{cert.description}</p>
                    <p className="certification-date">{cert.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Practices */}
          <div className="security-section">
            <h3 className="section-title">Security Practices</h3>
            <div className="practices-grid">
              {securityPractices.map((category, index) => (
                <div key={index} className="practice-card">
                  <div className="practice-card-body">
                    <h4 className="practice-category">{category.category}</h4>
                    <ul className="practice-list">
                      {category.practices.map((practice, practiceIndex) => (
                        <li key={practiceIndex} className="practice-item">
                          <span className="practice-bullet">•</span>
                          <span className="practice-text">{practice}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Stats */}
          <div className="security-card stats-card">
            <div className="security-card-body">
              <h3 className="stats-title">Security by the Numbers</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-number">99.9%</div>
                  <div className="stat-label">Uptime SLA</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">24/7</div>
                  <div className="stat-label">Security Monitoring</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">256-bit</div>
                  <div className="stat-label">AES Encryption</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">&lt;1hr</div>
                  <div className="stat-label">Incident Response</div>
                </div>
              </div>
            </div>
          </div>

          {/* Incident Response & Vulnerability Management */}
          <div className="response-grid">
            <div className="security-card">
              <div className="security-card-body">
                <h3 className="response-title">Incident Response</h3>
                <p className="response-description">
                  Our security team follows a comprehensive incident response plan to quickly identify, 
                  contain, and resolve any security incidents.
                </p>
                <ul className="response-steps">
                  <li className="response-step">
                    <span className="step-number">1.</span>
                    Detection and analysis
                  </li>
                  <li className="response-step">
                    <span className="step-number">2.</span>
                    Containment and eradication
                  </li>
                  <li className="response-step">
                    <span className="step-number">3.</span>
                    Recovery and monitoring
                  </li>
                  <li className="response-step">
                    <span className="step-number">4.</span>
                    Post-incident review
                  </li>
                </ul>
              </div>
            </div>
            <div className="security-card">
              <div className="security-card-body">
                <h3 className="response-title">Vulnerability Management</h3>
                <p className="response-description">
                  We maintain a proactive approach to identifying and addressing security vulnerabilities 
                  across our platform and infrastructure.
                </p>
                <ul className="vulnerability-list">
                  <li className="vulnerability-item">
                    <span className="vulnerability-check">✓</span>
                    Regular vulnerability assessments
                  </li>
                  <li className="vulnerability-item">
                    <span className="vulnerability-check">✓</span>
                    Automated security scanning
                  </li>
                  <li className="vulnerability-item">
                    <span className="vulnerability-check">✓</span>
                    Third-party penetration testing
                  </li>
                  <li className="vulnerability-item">
                    <span className="vulnerability-check">✓</span>
                    Responsible disclosure program
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Security Team */}
          <div className="security-card contact-card">
            <div className="security-card-body">
              <h3 className="contact-title">Security Questions?</h3>
              <p className="contact-description">
                Our security team is available to answer questions about our security practices, 
                compliance certifications, or to discuss your specific security requirements.
              </p>
              <div className="contact-actions">
                <a href="mailto:security@medlens.ai" className="btn btn-primary">
                  Contact Security Team
                </a>
                <button className="btn btn-outline">
                  Request Security Documentation
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
