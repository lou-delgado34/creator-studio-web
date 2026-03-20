export default function PricingPage() {
  return (
    <div className="page-grid">
      <section className="hero-card">
        <span className="badge">Monetization Setup</span>
        <h1>Pricing</h1>
        <p>
          These are your starter business plans. Later we can connect these directly to Stripe.
        </p>
      </section>

      <section className="pricing-grid">
        <div className="pricing-card">
          <h2>Free</h2>
          <p>Starter access for new creators</p>
          <div className="plan-price">$0</div>
          <div className="plan-list">
            <div>• 3 projects</div>
            <div>• 10 AI credits</div>
            <div>• Basic editor</div>
            <div>• Community support</div>
          </div>
          <button className="secondary-btn">Current Starter Plan</button>
        </div>

        <div className="pricing-card featured">
          <h2>Pro</h2>
          <p>Best for serious creators</p>
          <div className="plan-price">$19/mo</div>
          <div className="plan-list">
            <div>• 50 projects</div>
            <div>• 500 AI credits</div>
            <div>• Premium templates</div>
            <div>• Priority support</div>
          </div>
          <button className="primary-btn">Upgrade to Pro</button>
        </div>

        <div className="pricing-card">
          <h2>Teams</h2>
          <p>Best for agencies and group creators</p>
          <div className="plan-price">$49/mo</div>
          <div className="plan-list">
            <div>• Shared workspace</div>
            <div>• 1500 AI credits</div>
            <div>• Team seats</div>
            <div>• Brand kit tools</div>
          </div>
          <button className="secondary-btn">Upgrade to Teams</button>
        </div>
      </section>
    </div>
  );
}
