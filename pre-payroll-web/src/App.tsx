import { useState } from 'react';
import MainLayout from './layout/MainLayout';
import Step0_SelectItems from './pages/Step0_SelectItems';
import type { ItemConfig } from './pages/Step0_SelectItems';
import Step1_ReviewWorkspace from './pages/Step1_ReviewWorkspace';
import './App.css';

function App() {
  const [step, setStep] = useState<0 | 1>(0);
  const [selectedItems, setSelectedItems] = useState<ItemConfig[]>([]);

  return (
    <MainLayout>
      {step === 0 ? (
        <Step0_SelectItems 
          onContinue={(items) => {
            setSelectedItems(items);
            setStep(1);
          }} 
        />
      ) : (
        <Step1_ReviewWorkspace 
          items={selectedItems} 
          onBack={() => setStep(0)} 
        />
      )}
    </MainLayout>
  );
}

export default App;
