import { useState } from 'react';
import { FaSearch, FaExternalLinkAlt, FaSpinner, FaArrowDown } from 'react-icons/fa';

const MainContent = ({ onSubmit, selectedAnalysis }) => {
  const [description, setDescription] = useState('');
  const [numCandidates, setNumCandidates] = useState('5');
  const [loading, setLoading] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showFullFlow, setShowFullFlow] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;
    
    try {
      setLoading(true);
      const data = {
        description: description.trim(),
        num_candidates: parseInt(numCandidates, 10)
      };
      
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', {
          status: response.status,
          statusText: response.statusText,
          data: errorData
        });
        throw new Error('Network response was not ok');
      }
      
      const result = await response.json();
      await onSubmit(result);
      setDescription('');
    } catch (error) {
      console.error('Error submitting job description:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const getDescriptionLines = (text) => text?.split('\n') || [];
  
  const renderDescription = (text) => {
    if (!text) return '';
    const lines = getDescriptionLines(text);
    if (lines.length <= 5) return text;
    
    return showFullDescription 
      ? text 
      : lines.slice(0, 5).join('\n') + '...';
  };

  const renderFlow = (flow) => {
    if (!flow) return [];
    if (flow.length <= 3 || showFullFlow) return flow;
    return flow.slice(0, 3);
  };

  return (
    <div className="main-content" style={{ 
      padding: '40px',
      flex: 1,
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      {!selectedAnalysis && (
        <form onSubmit={handleSubmit} style={{
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h1 style={{
              color: '#495057',
              fontSize: '22px',
              marginBottom: '10px'
            }}>Enter Job Description </h1>
          <div style={{
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <label htmlFor="numCandidates" style={{
              color: '#495057',
              fontSize: '16px'
            }}>
              Number of Candidates:
            </label>
            <input
              id="numCandidates"
              type="number"
              min="1"
              max="10"
              value={numCandidates}
              onChange={(e) => setNumCandidates(String(e.target.value))}
              style={{
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                width: '80px'
              }}
            />
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter job description..."
            style={{
              width: '100%',
              height: '',
              marginBottom: '20px',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '16px',
              resize: 'vertical',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          />
          <button 
            type="submit" 
            disabled={loading}
            style={{
              backgroundColor: '#000000',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background-color 0.2s',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? (
              <>
                <FaSpinner className="spinner" style={{animation: 'spin 1s linear infinite'}} />
                Searching...
              </>
            ) : (
              <>
                <FaSearch />
                Begin Search
              </>
            )}
          </button>
        </form>
      )}

      {selectedAnalysis && (
        <div style={{ 
          marginTop: '40px',
          maxWidth: '800px',
          margin: '40px auto'
        }}>
          <h2 style={{ 
            borderBottom: '2px solid #000000',
            paddingBottom: '10px',
            color: '#2c3e50',
            fontSize: '24px'
          }}>Talent Discovery Results</h2>
          
          <div style={{
            display: 'flex',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div style={{
              flex: '2',
              backgroundColor: '#f1f4f9',
              padding: '20px',
              borderRadius: '8px',
              maxHeight: showFullDescription ? 'none' : '320px',
              overflow: showFullDescription ? 'visible' : 'hidden',
              position: 'relative',
              paddingBottom: '40px'
            }}>
              <h3 style={{
                color: '#495057',
                fontSize: '20px',
                marginBottom: '10px'
              }}>Job Description</h3>
              <p style={{
                lineHeight: '1.6',
                color: '#666',
                whiteSpace: 'pre-wrap',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}>{renderDescription(selectedAnalysis.description)}</p>
              {console.log('Description length:', getDescriptionLines(selectedAnalysis.description).length)}
              {getDescriptionLines(selectedAnalysis.description).length > 5 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  style={{
                    background: 'none',
                    border: 'none', 
                    color: '#000000',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    padding: '5px 0',
                    display: 'block',
                    width: '100%',
                    fontWeight: 'bold',
                    position: 'absolute',
                    bottom: '10px',
                    left: '0',
                  }}
                >
                  {showFullDescription ? 'Show Less' : 'Show More'}
                </button>
              )}
            </div>

            {selectedAnalysis && selectedAnalysis.result && selectedAnalysis.result.flow && (
              <div style={{
                flex: '1',
                backgroundColor: '#f8f9fa',
                padding: '20px',
                borderRadius: '8px',
              }}>
                <h3 style={{
                  color: '#495057',
                  fontSize: '20px',
                  marginBottom: '15px',
                  textAlign: 'center'
                }}>Search Flow</h3>
                <div style={{
                  paddingLeft: '20px',
                  margin: 0,
                  color: '#666'
                }}>
                  {renderFlow(selectedAnalysis.result.flow).map((step, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <span style={{
                        lineHeight: '1.6',
                        fontSize: '14px',
                        textAlign: 'center'
                      }}>
                        {step}
                      </span>
                      {index < renderFlow(selectedAnalysis.result.flow).length - 1 && (
                        <FaArrowDown style={{
                          margin: '8px 0',
                          color: 'blue',
                          fontSize: '20px'
                        }} />
                      )}
                    </div>
                  ))}
                  {selectedAnalysis.result.flow.length > 3 && (
                    <button
                      onClick={() => setShowFullFlow(!showFullFlow)}
                      style={{
                        background: 'none',
                        border: 'none', 
                        color: '#000000',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        marginTop: '10px',
                        padding: '5px 0',
                        display: 'block',
                        width: '100%',
                        fontWeight: 'bold'
                      }}
                    >
                      {showFullFlow ? 'Show Less' : 'Show More'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {selectedAnalysis && selectedAnalysis.result && selectedAnalysis.result.candidates && 
            selectedAnalysis.result.candidates.map((candidate, index) => (
              <div 
                key={index} 
                style={{ 
                  padding: '25px',
                  marginBottom: '25px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  backgroundColor: '#fff',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  ':hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 12px rgba(0,0,0,0.15)'
                  }
                }}
              >
                <h3 style={{ 
                  color: '#000000',
                  marginTop: 0,
                  fontSize: '20px',
                  borderBottom: '2px solid #eee',
                  paddingBottom: '10px'
                }}>{candidate.name}</h3>
                
                <p style={{ 
                  lineHeight: '1.8',
                  color: '#495057',
                  fontSize: '15px'
                }}>{candidate.summary}</p>
                
                <div style={{ marginTop: '15px' }}>
                  <strong style={{color: '#2c3e50'}}>Relevant Links:</strong>
                  <ul style={{ 
                    paddingLeft: '20px',
                    listStyle: 'none'
                  }}>
                    {candidate.relevant_urls.map((url, urlIndex) => (
                      <li key={urlIndex} style={{marginTop: '8px'}}>
                        <a 
                          href={url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ 
                            color: '#000000',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '14px'
                          }}
                        >
                          {url}
                          <FaExternalLinkAlt size={12} />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          }
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          from {transform: rotate(0deg);}
          to {transform: rotate(360deg);}
        }
      `}</style>
    </div>
  );
};

export default MainContent;