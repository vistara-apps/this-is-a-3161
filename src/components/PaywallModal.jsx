import React, { useState } from 'react';
import { X, Crown, Check, Zap } from 'lucide-react';
import { usePaymentContext } from '../hooks/usePaymentContext';

const PaywallModal = ({ onSubscribe }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { createSession } = usePaymentContext();

  const handleSubscribe = async (plan) => {
    setIsLoading(true);
    try {
      await createSession();
      onSubscribe();
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-surface border border-surface/50 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Crown className="w-6 h-6 text-warning" />
              <h2 className="text-2xl font-bold text-text-primary">Upgrade to Pro</h2>
            </div>
          </div>

          <p className="text-text-secondary mb-8">
            Your trial period has ended. Upgrade to continue accessing your stablecoin dashboard and unlock advanced features.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Plan */}
            <div className="border border-surface rounded-xl p-6">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-text-primary">Basic</h3>
                <div className="flex items-baseline space-x-1 mt-2">
                  <span className="text-3xl font-bold text-text-primary">$5</span>
                  <span className="text-text-secondary">/month</span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-6">
                <FeatureItem text="Unified dashboard access" />
                <FeatureItem text="Real-time deposit tracking" />
                <FeatureItem text="Basic yield monitoring" />
                <FeatureItem text="Protocol health overview" />
              </ul>

              <button
                onClick={() => handleSubscribe('basic')}
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : 'Choose Basic'}
              </button>
            </div>

            {/* Pro Plan */}
            <div className="border-2 border-accent bg-accent/5 rounded-xl p-6 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-accent text-white text-sm font-medium px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
              
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-text-primary">Pro</h3>
                <div className="flex items-baseline space-x-1 mt-2">
                  <span className="text-3xl font-bold text-text-primary">$15</span>
                  <span className="text-text-secondary">/month</span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-6">
                <FeatureItem text="Everything in Basic" />
                <FeatureItem text="Advanced yield optimization alerts" />
                <FeatureItem text="Protocol health insights" />
                <FeatureItem text="Custom alert thresholds" />
                <FeatureItem text="Historical analytics" />
                <FeatureItem text="Priority support" />
              </ul>

              <button
                onClick={() => handleSubscribe('pro')}
                disabled={isLoading}
                className="w-full bg-accent hover:bg-accent/90 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <Zap className="w-4 h-4" />
                <span>{isLoading ? 'Processing...' : 'Choose Pro'}</span>
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-text-secondary">
              Secure payments powered by Web3. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureItem = ({ text }) => {
  return (
    <li className="flex items-center space-x-3">
      <Check className="w-5 h-5 text-success flex-shrink-0" />
      <span className="text-text-secondary">{text}</span>
    </li>
  );
};

export default PaywallModal;