import React from 'react';
import { ConfigProvider, useConfig } from './context/ConfigContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ShowroomView } from './components/ShowroomView';
import { ConfiguratorView } from './components/ConfiguratorView';
import { PerformanceView } from './components/PerformanceView';
import { TechnicalView } from './components/TechnicalView';
import { LegalViews } from './components/LegalViews';
import { ReserveModal } from './components/ReserveModal';

const AppContent: React.FC = () => {
  const { currentTab } = useConfig();

  return (
    <div className="flex flex-col min-h-screen bg-background text-primary selection:bg-primary-container selection:text-background">
      <Navbar />

      <main className="flex-1 flex flex-col w-full relative">
        {currentTab === 'showroom' && <ShowroomView />}
        {currentTab === 'configurator' && <ConfiguratorView />}
        {currentTab === 'performance' && <PerformanceView />}
        {currentTab === 'technical' && <TechnicalView />}
        {currentTab === 'terms' && <LegalViews type="terms" />}
        {currentTab === 'privacy' && <LegalViews type="privacy" />}
        {currentTab === 'legal' && <LegalViews type="legal" />}
      </main>

      <Footer />
      <ReserveModal />
    </div>
  );
};

export default function App() {
  return (
    <ConfigProvider>
      <AppContent />
    </ConfigProvider>
  );
}
