import './PricingPage.css';

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "$29",
      period: "per month",
      description: "Perfect for individual healthcare professionals",
      features: [
        "Up to 50 transcription hours/month",
        "Basic medical entity extraction",
        "Standard summarization",
        "Email support",
        "HIPAA compliant storage",
        "Basic analytics"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "$79",
      period: "per month",
      description: "Ideal for small to medium practices",
      features: [
        "Up to 200 transcription hours/month",
        "Advanced medical entity extraction",
        "AI-powered summarization",
        "Priority support",
        "HIPAA compliant storage",
        "Advanced analytics",
        "Custom templates",
        "API access"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "For large healthcare organizations",
      features: [
        "Unlimited transcription hours",
        "Premium medical entity extraction",
        "Custom AI models",
        "24/7 dedicated support",
        "HIPAA compliant storage",
        "Enterprise analytics",
        "Custom integrations",
        "Full API access",
        "On-premise deployment",
        "Custom training"
      ],
      popular: false
    }
  ];

  return (
    <div className="pricing-page">
      {/* Header */}
      <header className="pricing-header">
        <div className="container">
          <div className="pricing-header-content">
            <div>
              <h1 className="pricing-title">Pricing Plans</h1>
              <p className="pricing-subtitle">Choose the perfect plan for your healthcare practice</p>
            </div>
            <a href="/" className="btn btn-outline">Back to Home</a>
          </div>
        </div>
      </header>

      <main className="pricing-main">
        <div className="container">
          {/* Pricing Header */}
          <div className="pricing-hero">
            <h2 className="hero-title">Simple, Transparent Pricing</h2>
            <p className="hero-description">
              Start with our free trial and scale as your practice grows. All plans include HIPAA compliance and enterprise-grade security.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="pricing-grid">
            {plans.map((plan, index) => (
              <div key={index} className={`pricing-card ${plan.popular ? 'pricing-card-popular' : ''}`}>
                {plan.popular && (
                  <div className="popular-badge">
                    <span className="popular-text">Most Popular</span>
                  </div>
                )}
                <div className="pricing-card-body">
                  <div className="plan-header">
                    <h3 className="plan-name">{plan.name}</h3>
                    <div className="plan-price">
                      <span className="price-amount">{plan.price}</span>
                      <span className="price-period">{plan.period}</span>
                    </div>
                    <p className="plan-description">{plan.description}</p>
                  </div>

                  <ul className="features-list">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="feature-item">
                        <span className="feature-check">✓</span>
                        <span className="feature-text">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button className={`plan-button ${plan.popular ? 'btn-primary' : 'btn-outline'}`}>
                    {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="faq-section">
            <h3 className="faq-title">Frequently Asked Questions</h3>
            <div className="faq-grid">
              <div className="faq-card">
                <div className="faq-card-body">
                  <h4 className="faq-question">Is there a free trial?</h4>
                  <p className="faq-answer">Yes! All plans come with a 30-day free trial. No credit card required.</p>
                </div>
              </div>
              <div className="faq-card">
                <div className="faq-card-body">
                  <h4 className="faq-question">Can I change plans anytime?</h4>
                  <p className="faq-answer">Absolutely. You can upgrade or downgrade your plan at any time from your dashboard.</p>
                </div>
              </div>
              <div className="faq-card">
                <div className="faq-card-body">
                  <h4 className="faq-question">Is my data secure?</h4>
                  <p className="faq-answer">Yes. All plans include HIPAA compliance, end-to-end encryption, and enterprise-grade security.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
