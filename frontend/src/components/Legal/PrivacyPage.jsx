import './PrivacyPage.css';

export default function PrivacyPage() {
  const sections = [
    {
      title: "Information We Collect",
      content: [
        "Account Information: Name, email address, phone number, and billing information when you create an account.",
        "Medical Data: Audio recordings, transcriptions, and related medical information you upload or create using our services.",
        "Usage Data: Information about how you use our platform, including features accessed and time spent.",
        "Technical Data: IP address, browser type, device information, and other technical identifiers."
      ]
    },
    {
      title: "How We Use Your Information",
      content: [
        "Provide and improve our transcription and AI services",
        "Process payments and manage your account",
        "Communicate with you about our services and support",
        "Ensure security and prevent fraud",
        "Comply with legal obligations and regulatory requirements",
        "Develop new features and enhance our platform"
      ]
    },
    {
      title: "Information Sharing and Disclosure",
      content: [
        "We do not sell, trade, or rent your personal information to third parties.",
        "We may share information with service providers who assist in our operations (under strict confidentiality agreements).",
        "We may disclose information when required by law or to protect our rights and safety.",
        "In case of business transfer, your information may be transferred to the acquiring entity."
      ]
    },
    {
      title: "Data Security",
      content: [
        "End-to-end encryption for all data transmission and storage",
        "HIPAA-compliant infrastructure and processes",
        "Regular security audits and penetration testing",
        "Access controls and authentication mechanisms",
        "Secure data centers with physical and digital safeguards",
        "Employee training on data protection and privacy"
      ]
    },
    {
      title: "Data Retention",
      content: [
        "Medical data is retained according to healthcare regulations and your subscription terms.",
        "Account information is kept for as long as your account is active.",
        "You can request deletion of your data at any time (subject to legal requirements).",
        "Backup data is securely deleted according to our retention schedule."
      ]
    },
    {
      title: "Your Rights",
      content: [
        "Access: Request a copy of your personal information",
        "Correction: Update or correct inaccurate information",
        "Deletion: Request deletion of your personal information",
        "Portability: Receive your data in a portable format",
        "Restriction: Limit how we process your information",
        "Objection: Object to certain types of processing"
      ]
    }
  ];

  return (
    <div className="privacy-page">
      {/* Header */}
      <header className="privacy-header">
        <div className="container">
          <div className="privacy-header-content">
            <div>
              <h1 className="privacy-title">Privacy Policy</h1>
              <p className="privacy-subtitle">How we protect and handle your information</p>
            </div>
            <a href="/" className="btn btn-outline">Back to Home</a>
          </div>
        </div>
      </header>

      <main className="privacy-main">
        <div className="container">
          <div className="privacy-content">
            {/* Introduction */}
            <div className="privacy-card privacy-intro">
              <div className="privacy-card-body">
                <div className="intro-header">
                  <div className="intro-icon">🔒</div>
                  <h2 className="intro-title">Your Privacy Matters</h2>
                  <p className="intro-description">
                    At MedLens, we are committed to protecting your privacy and maintaining the confidentiality 
                    of your medical information. This Privacy Policy explains how we collect, use, and safeguard 
                    your information.
                  </p>
                </div>
                
                <div className="effective-date">
                  <h3 className="effective-date-title">Last Updated: December 15, 2024</h3>
                  <p className="effective-date-text">
                    This Privacy Policy is effective as of the date listed above and applies to all users of 
                    the MedLens platform and services.
                  </p>
                </div>
              </div>
            </div>

            {/* HIPAA Compliance */}
            <div className="privacy-card">
              <div className="privacy-card-body">
                <h2 className="section-title">HIPAA Compliance</h2>
                <div className="hipaa-grid">
                  <div className="hipaa-section">
                    <h3 className="hipaa-subtitle">Business Associate Agreement</h3>
                    <p className="hipaa-description">
                      MedLens operates as a Business Associate under HIPAA and maintains a signed Business 
                      Associate Agreement (BAA) with all covered entities.
                    </p>
                    <ul className="hipaa-list">
                      <li className="hipaa-item">
                        <span className="hipaa-check">✓</span>
                        Administrative safeguards
                      </li>
                      <li className="hipaa-item">
                        <span className="hipaa-check">✓</span>
                        Physical safeguards
                      </li>
                      <li className="hipaa-item">
                        <span className="hipaa-check">✓</span>
                        Technical safeguards
                      </li>
                    </ul>
                  </div>
                  <div className="hipaa-section">
                    <h3 className="hipaa-subtitle">Protected Health Information</h3>
                    <p className="hipaa-description">
                      We handle Protected Health Information (PHI) according to HIPAA requirements and 
                      industry best practices.
                    </p>
                    <ul className="hipaa-list">
                      <li className="hipaa-item">
                        <span className="hipaa-check">✓</span>
                        Minimum necessary standard
                      </li>
                      <li className="hipaa-item">
                        <span className="hipaa-check">✓</span>
                        Audit logging and monitoring
                      </li>
                      <li className="hipaa-item">
                        <span className="hipaa-check">✓</span>
                        Breach notification procedures
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Sections */}
            {sections.map((section, index) => (
              <div key={index} className="privacy-card">
                <div className="privacy-card-body">
                  <h2 className="section-title">{section.title}</h2>
                  <ul className="section-content">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="section-item">
                        <span className="section-bullet">•</span>
                        <span className="section-text">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}

            {/* International Transfers */}
            <div className="privacy-card">
              <div className="privacy-card-body">
                <h2 className="section-title">International Data Transfers</h2>
                <p className="transfer-description">
                  MedLens operates primarily in the United States. If you are accessing our services from 
                  outside the US, please be aware that your information may be transferred to, stored, and 
                  processed in the United States.
                </p>
                <div className="transfer-warning">
                  <p className="transfer-warning-text">
                    <strong>EU/UK Users:</strong> We comply with applicable data protection laws including 
                    GDPR and provide appropriate safeguards for international transfers.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="privacy-card">
              <div className="privacy-card-body">
                <h2 className="section-title">Contact Us</h2>
                <p className="contact-intro">
                  If you have questions about this Privacy Policy or our privacy practices, please contact us:
                </p>
                <div className="contact-grid">
                  <div className="contact-section">
                    <h3 className="contact-subtitle">Privacy Officer</h3>
                    <div className="contact-details">
                      <p>Email: privacy@medlens.ai</p>
                      <p>Phone: 1-800-MEDLENS</p>
                      <p>Response Time: Within 48 hours</p>
                    </div>
                  </div>
                  <div className="contact-section">
                    <h3 className="contact-subtitle">Mailing Address</h3>
                    <div className="contact-details">
                      <p>MedLens Privacy Team</p>
                      <p>123 Healthcare Blvd</p>
                      <p>San Francisco, CA 94105</p>
                      <p>United States</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
