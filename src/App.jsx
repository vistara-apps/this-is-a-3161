import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import AppShell from './components/AppShell';
import Dashboard from './components/Dashboard';
import PaywallModal from './components/PaywallModal';
import WelcomeScreen from './components/WelcomeScreen';
import { usePaymentContext } from './hooks/usePaymentContext';

function App() {
  const { isConnected } = useAccount();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [hasTrialAccess, setHasTrialAccess] = useState(false);

  // Simulate trial period (5 minutes for demo)
  useEffect(() => {
    if (isConnected && !isSubscribed) {
      setHasTrialAccess(true);
      const trialTimer = setTimeout(() => {
        setHasTrialAccess(false);
        setShowPaywall(true);
      }, 300000); // 5 minutes trial

      return () => clearTimeout(trialTimer);
    }
  }, [isConnected, isSubscribed]);

  const handleSubscribe = async () => {
    try {
      setIsSubscribed(true);
      setShowPaywall(false);
      setHasTrialAccess(false);
    } catch (error) {
      console.error('Subscription failed:', error);
    }
  };

  if (!isConnected) {
    return <WelcomeScreen />;
  }

  if (showPaywall && !isSubscribed) {
    return <PaywallModal onSubscribe={handleSubscribe} />;
  }

  return (
    <AppShell>
      <Dashboard 
        isSubscribed={isSubscribed} 
        hasTrialAccess={hasTrialAccess}
        onUpgrade={() => setShowPaywall(true)}
      />
    </AppShell>
  );
}

export default App;