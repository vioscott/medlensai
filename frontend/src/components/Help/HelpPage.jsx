import { useState } from 'react';
import './HelpPage.css';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Getting Started',
    'Transcription',
    'AI Features',
    'Account & Billing',
    'Security',
    'Integrations',
    'Troubleshooting'
  ];

  const helpArticles = [
    {
      title: "Getting Started with MedLens",
      category: "Getting Started",
      description: "Learn how to set up your account and start your first transcription session.",
      readTime: "3 min"
    },
    {
      title: "How to Upload Audio Files",
      category: "Transcription",
      description: "Step-by-step guide to uploading and processing audio files for transcription.",
      readTime: "2 min"
    },
    {
      title: "Understanding Medical Entity Extraction",
      category: "AI Features",
      description: "Learn how our AI identifies and extracts medical entities from your transcriptions.",
      readTime: "5 min"
    },
    {
      title: "Managing Your Subscription",
      category: "Account & Billing",
      description: "How to upgrade, downgrade, or cancel your MedLens subscription.",
      readTime: "3 min"
    },
    {
      title: "HIPAA Compliance and Data Security",
      category: "Security",
      description: "Understanding how MedLens protects your patient data and maintains compliance.",
      readTime: "7 min"
    },
    {
      title: "EMR Integration Setup",
      category: "Integrations",
      description: "Connect MedLens with your existing Electronic Medical Record system.",
      readTime: "10 min"
    },
    {
      title: "Troubleshooting Audio Quality Issues",
      category: "Troubleshooting",
      description: "Common audio problems and how to resolve them for better transcription accuracy.",
      readTime: "4 min"
    },
    {
      title: "Using the Real-time Transcription Feature",
      category: "Transcription",
      description: "How to use live transcription during patient consultations.",
      readTime: "6 min"
    }
  ];

  const faqs = [
    {
      question: "How accurate is the transcription?",
      answer: "Our AI achieves 99.2% accuracy for medical transcriptions, with specialized training on medical terminology and clinical contexts."
    },
    {
      question: "Is my patient data secure?",
      answer: "Yes, we are fully HIPAA compliant with end-to-end encryption, secure data centers, and regular security audits."
    },
    {
      question: "Can I integrate with my existing EMR?",
      answer: "Yes, we support integration with major EMR systems including Epic, Cerner, and Allscripts through our API."
    },
    {
      question: "What audio formats are supported?",
      answer: "We support MP3, WAV, M4A, and FLAC formats. Maximum file size is 100MB per upload."
    },
    {
      question: "How long does transcription take?",
      answer: "Real-time transcription is instant. Uploaded files are typically processed within 2-5 minutes depending on length."
    }
  ];

  const filteredArticles = helpArticles.filter(article => {
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="help-page">
      {/* Header */}
      <header className="help-header">
        <div className="container">
          <div className="help-header-content">
            <div>
              <h1 className="help-title">Help Center</h1>
              <p className="help-subtitle">Find answers and get support</p>
            </div>
            <a href="/" className="btn btn-outline">Back to Home</a>
          </div>
        </div>
      </header>

      <main className="help-main">
        <div className="container">
          {/* Search Section */}
          <div className="search-section">
            <h2 className="search-title">How can we help you?</h2>
            <div className="search-container">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="Search for help articles..."
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="search-button">
                  🔍
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <div className="action-card">
              <div className="action-card-body">
                <div className="action-icon">📞</div>
                <h3 className="action-title">Contact Support</h3>
                <p className="action-description">Get help from our support team</p>
                <button className="btn btn-primary">Contact Us</button>
              </div>
            </div>
            <div className="action-card">
              <div className="action-card-body">
                <div className="action-icon">🎥</div>
                <h3 className="action-title">Video Tutorials</h3>
                <p className="action-description">Watch step-by-step guides</p>
                <button className="btn btn-outline">Watch Videos</button>
              </div>
            </div>
            <div className="action-card">
              <div className="action-card-body">
                <div className="action-icon">📚</div>
                <h3 className="action-title">API Documentation</h3>
                <p className="action-description">Technical integration guides</p>
                <button className="btn btn-outline">View Docs</button>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="categories-section">
            <h3 className="categories-title">Browse by Category</h3>
            <div className="categories-list">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedCategory(category)}
                  className={`category-button ${
                    selectedCategory === category
                      ? 'category-button-active'
                      : 'category-button-inactive'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Help Articles */}
          <div className="articles-grid">
            {filteredArticles.map((article, index) => (
              <div key={index} className="article-card">
                <div className="article-card-body">
                  <div className="article-header">
                    <span className="article-category">
                      {article.category}
                    </span>
                    <span className="article-read-time">{article.readTime}</span>
                  </div>
                  <h4 className="article-title">{article.title}</h4>
                  <p className="article-description">{article.description}</p>
                  <button className="article-link">
                    Read Article →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="faq-section">
            <div className="faq-card">
              <div className="faq-card-body">
                <h3 className="faq-title">Frequently Asked Questions</h3>
                <div className="faq-list">
                  {faqs.map((faq, index) => (
                    <div key={index} className="faq-item">
                      <h4 className="faq-question">{faq.question}</h4>
                      <p className="faq-answer">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Still Need Help */}
          <div className="support-section">
            <div className="support-card">
              <div className="support-card-body">
                <h3 className="support-title">Still need help?</h3>
                <p className="support-description">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
                <div className="support-actions">
                  <button className="btn btn-primary">Contact Support</button>
                  <button className="btn btn-outline">Schedule a Demo</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
