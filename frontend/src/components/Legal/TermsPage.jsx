import './TermsPage.css';

export default function TermsPage() {
  const sections = [
    {
      title: "Acceptance of Terms",
      content: [
        "By accessing or using MedLens services, you agree to be bound by these Terms of Service.",
        "If you do not agree to these terms, you may not use our services.",
        "We may update these terms from time to time, and continued use constitutes acceptance of changes.",
        "You must be at least 18 years old and legally able to enter into contracts to use our services."
      ]
    },
    {
      title: "Description of Service",
      content: [
        "MedLens provides AI-powered medical transcription and documentation services.",
        "Our services include real-time transcription, medical entity extraction, and automated summarization.",
        "We offer both web-based and API access to our platform.",
        "Service availability and features may vary based on your subscription plan."
      ]
    },
    {
      title: "User Accounts and Responsibilities",
      content: [
        "You are responsible for maintaining the confidentiality of your account credentials.",
        "You must provide accurate and complete information when creating your account.",
        "You are responsible for all activities that occur under your account.",
        "You must notify us immediately of any unauthorized use of your account.",
        "You may not share your account with others or create multiple accounts."
      ]
    },
    {
      title: "Acceptable Use Policy",
      content: [
        "You may only use our services for lawful purposes and in accordance with these terms.",
        "You may not use our services to process non-medical content or for unauthorized purposes.",
        "You may not attempt to reverse engineer, hack, or compromise our systems.",
        "You may not upload malicious content, viruses, or harmful code.",
        "You must comply with all applicable laws and regulations, including HIPAA."
      ]
    },
    {
      title: "Data and Privacy",
      content: [
        "You retain ownership of all medical data and content you upload to our platform.",
        "You grant us a limited license to process your data to provide our services.",
        "We will handle your data in accordance with our Privacy Policy and HIPAA requirements.",
        "You are responsible for ensuring you have the right to upload and process any data.",
        "We may retain anonymized, aggregated data for service improvement purposes."
      ]
    },
    {
      title: "Payment and Billing",
      content: [
        "Subscription fees are billed in advance on a monthly or annual basis.",
        "All fees are non-refundable except as required by law or our refund policy.",
        "We may change our pricing with 30 days' notice to existing customers.",
        "You are responsible for all taxes associated with your use of our services.",
        "Accounts may be suspended for non-payment after appropriate notice."
      ]
    },
    {
      title: "Intellectual Property",
      content: [
        "MedLens and our technology are protected by intellectual property laws.",
        "You may not copy, modify, or distribute our software or proprietary technology.",
        "We respect the intellectual property rights of others and expect users to do the same.",
        "Any feedback or suggestions you provide may be used by us without compensation.",
        "Our trademarks and logos may not be used without our written permission."
      ]
    },
    {
      title: "Service Availability and Support",
      content: [
        "We strive to maintain 99.9% uptime but do not guarantee uninterrupted service.",
        "Scheduled maintenance will be announced in advance when possible.",
        "Support is provided according to your subscription plan terms.",
        "We may temporarily suspend service for maintenance, security, or legal reasons.",
        "Service level agreements (SLAs) are detailed in your subscription agreement."
      ]
    }
  ];

  return (
    <div className="terms-page">
      {/* Header */}
      <header className="terms-header">
        <div className="container">
          <div className="terms-header-content">
            <div>
              <h1 className="terms-title">Terms of Service</h1>
              <p className="terms-subtitle">Legal terms and conditions for using MedLens</p>
            </div>
            <a href="/" className="btn btn-outline">Back to Home</a>
          </div>
        </div>
      </header>

      <main className="terms-main">
        <div className="container">
          <div className="terms-content">
            {/* Introduction */}
            <div className="terms-card terms-intro">
              <div className="terms-card-body">
                <div className="intro-header">
                  <div className="intro-icon">📋</div>
                  <h2 className="intro-title">Terms of Service</h2>
                  <p className="intro-description">
                    These Terms of Service govern your use of MedLens and our AI-powered medical 
                    documentation platform. Please read them carefully.
                  </p>
                </div>
                
                <div className="effective-date">
                  <h3 className="effective-date-title">Effective Date: December 15, 2024</h3>
                  <p className="effective-date-text">
                    These terms are effective as of the date listed above and apply to all users of 
                    MedLens services. By using our platform, you agree to these terms.
                  </p>
                </div>
              </div>
            </div>

            {/* Terms Sections */}
            {sections.map((section, index) => (
              <div key={index} className="terms-card">
                <div className="terms-card-body">
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

            {/* Limitation of Liability */}
            <div className="terms-card">
              <div className="terms-card-body">
                <h2 className="section-title">Limitation of Liability</h2>
                <div className="liability-warning">
                  <p className="liability-intro">
                    <strong>IMPORTANT:</strong> MedLens provides technology tools to assist with medical 
                    documentation. Our services are not intended to replace professional medical judgment 
                    or clinical decision-making.
                  </p>
                  <ul className="liability-list">
                    <li className="liability-item">
                      <span className="liability-icon">⚠</span>
                      Healthcare professionals remain responsible for all clinical decisions
                    </li>
                    <li className="liability-item">
                      <span className="liability-icon">⚠</span>
                      All transcriptions and AI outputs should be reviewed for accuracy
                    </li>
                    <li className="liability-item">
                      <span className="liability-icon">⚠</span>
                      MedLens liability is limited to the amount paid for services
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Termination */}
            <div className="terms-card">
              <div className="terms-card-body">
                <h2 className="section-title">Termination</h2>
                <div className="termination-grid">
                  <div className="termination-section">
                    <h3 className="termination-subtitle">By You</h3>
                    <ul className="termination-list">
                      <li>• Cancel your subscription at any time</li>
                      <li>• Download your data before termination</li>
                      <li>• No refunds for partial billing periods</li>
                      <li>• Account access ends at subscription expiry</li>
                    </ul>
                  </div>
                  <div className="termination-section">
                    <h3 className="termination-subtitle">By MedLens</h3>
                    <ul className="termination-list">
                      <li>• For violation of these terms</li>
                      <li>• For non-payment of fees</li>
                      <li>• For illegal or harmful activities</li>
                      <li>• With 30 days' notice for convenience</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Governing Law */}
            <div className="terms-card">
              <div className="terms-card-body">
                <h2 className="section-title">Governing Law and Disputes</h2>
                <div className="governing-law">
                  <p>
                    These terms are governed by the laws of the State of California, United States, 
                    without regard to conflict of law principles.
                  </p>
                  <p>
                    Any disputes arising from these terms or your use of our services will be resolved 
                    through binding arbitration in San Francisco, California.
                  </p>
                  <p>
                    You agree to resolve disputes individually and waive any right to participate in 
                    class action lawsuits or class-wide arbitration.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="terms-card">
              <div className="terms-card-body">
                <h2 className="section-title">Questions About These Terms</h2>
                <p className="contact-intro">
                  If you have questions about these Terms of Service, please contact our legal team:
                </p>
                <div className="contact-grid">
                  <div className="contact-section">
                    <h3 className="contact-subtitle">Legal Department</h3>
                    <div className="contact-details">
                      <p>Email: legal@medlens.ai</p>
                      <p>Phone: 1-800-MEDLENS</p>
                      <p>Response Time: Within 5 business days</p>
                    </div>
                  </div>
                  <div className="contact-section">
                    <h3 className="contact-subtitle">Mailing Address</h3>
                    <div className="contact-details">
                      <p>MedLens Legal Team</p>
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
