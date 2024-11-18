import UniLinkLogo from '../assets/UniLink.png';

const Sidebar = ({ analyses, onAnalysisClick, selectedAnalysis }) => {
    return (
      <div style={{
        width: '300px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e0e0e0',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        overflowY: 'auto',
        boxShadow: '2px 0 5px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #e0e0e0'
        }}>
          <img 
            src={UniLinkLogo} 
            alt="UniLink Logo"
            style={{
              padding: '20px',
              width: '70%',
              height: 'auto',
              objectFit: 'contain',
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}
          />
        </div>
        
        <button
          onClick={() => onAnalysisClick(null)}
          style={{
            width: '100%',
            padding: '12px 20px',
            backgroundColor: '#000000',
            color: 'white',
            border: 'none',
            borderBottom: '1px solid #eee',
            cursor: 'pointer',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          New Search
        </button>

        {analyses.map((analysis) => (
          <div 
            key={analysis.id} 
            onClick={() => onAnalysisClick(analysis)}
            className="analysis-item"
            style={{ 
              cursor: 'pointer', 
              padding: '15px 20px',
              borderBottom: '1px solid #eee',
              backgroundColor: selectedAnalysis?.id === analysis.id ? '#f0f0f0' : '#fff',
            }}
          >
            <div style={{
              fontSize: '14px',
              color: '#495057',
              lineHeight: '1.5',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}>
              {analysis.description.substring(0, 100)}...
            </div>
          </div>
        ))}
        
        <style jsx>{`
          .analysis-item:hover {
            background-color: ${selectedAnalysis ? '#e0e0e0' : '#f8f9fa'} !important;
          }
        `}</style>
      </div>
    );
  };
  
  export default Sidebar;