import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';

function App() {
  const [analyses, setAnalyses] = useState([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  const fetchAnalyses = async () => {
    const response = await fetch('http://localhost:8000/analyses');
    const data = await response.json();
    setAnalyses(data);
  };

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const handleSubmit = async (description) => {
    const response = await fetch('http://localhost:8000/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description }),
    });
    const data = await response.json();
    fetchAnalyses();
    setSelectedAnalysis(data);
  };

  const handleAnalysisClick = (analysis) => {
    setSelectedAnalysis(analysis);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar 
        analyses={analyses} 
        onAnalysisClick={handleAnalysisClick} 
      />
      <div style={{ 
        marginLeft: '300px',  // Match sidebar width
        flexGrow: 1,          // Take up remaining space
        minHeight: '100vh',
        width: 'calc(100% - 300px)'  // Ensure correct width calculation
      }}>
        <MainContent 
          onSubmit={handleSubmit}
          selectedAnalysis={selectedAnalysis}
        />
      </div>
    </div>
  );
}

export default App;