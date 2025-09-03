import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
const TagSelectionScreen = ({heading='Topics that interest you',subtitle=`Select the topics you're interested in to personalize your blogging experience.\n +
          We'll show you content that matches your preferences.`,context='onboarding'}) => {
  const [selectedTags, setSelectedTags] = useState(new Set());

  const tagCategories = {
    'Technology': [
      'Web Development', 'Mobile Apps', 'AI & Machine Learning', 'Data Science',
      'Cybersecurity', 'Cloud Computing', 'DevOps', 'Programming', 'Software Engineering'
    ],
    'Lifestyle': [
      'Health & Fitness', 'Travel', 'Food & Cooking', 'Fashion', 'Home & Garden',
      'Relationships', 'Self Improvement', 'Mindfulness', 'Productivity'
    ],
    'Business': [
      'Entrepreneurship', 'Marketing', 'Finance', 'Leadership', 'Startup',
      'E-commerce', 'Digital Marketing', 'Business Strategy', 'Personal Branding'
    ],
    'Creative': [
      'Photography', 'Design', 'Writing', 'Art', 'Music', 'Film & Video',
      'Creative Writing', 'Graphic Design', 'Content Creation'
    ],
    'Education': [
      'Learning', 'Online Courses', 'Career Development', 'Study Tips',
      'Skills Development', 'Tutorials', 'Book Reviews', 'Research'
    ],
    'Entertainment': [
      'Movies', 'TV Shows', 'Gaming', 'Books', 'Sports', 'Pop Culture',
      'Celebrity News', 'Reviews', 'Entertainment News'
    ]
  };
  const navigate = useNavigate();

  const handleTagClick = (tag) => {
    const newSelectedTags = new Set(selectedTags);
    if (newSelectedTags.has(tag)) {
      newSelectedTags.delete(tag);
    } else {
      newSelectedTags.add(tag);
    }
    setSelectedTags(newSelectedTags);
  };

  const handleContinue = () => {
    console.log('Selected tags:', Array.from(selectedTags));
    // Handle navigation or save preferences
    navigate('../home', { replace: true })
  };

  const handleSkip = () => {
    console.log('User skipped tag selection');
    // Handle skip action
    alert('Skipped tag selection');
  };

  const clearAllTags = () => {
    setSelectedTags(new Set());
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.mainTitle}>Choose {heading}</h1>
        <p style={styles.subtitle}>
          {subtitle}
        </p>
      </div>

      <div style={styles.selectedCount}>
        <span style={styles.countText}>
          {selectedTags.size} tags selected
        </span>
        {selectedTags.size > 0 && (
          <button style={styles.clearBtn} onClick={clearAllTags}>
            Clear All
          </button>
        )}
      </div>

      <div style={styles.tagsContainer}>
        {Object.entries(tagCategories).map(([category, tags]) => (
          <div key={category} style={styles.tagSection}>
            <h3 style={styles.sectionTitle}>{category}</h3>
            <div style={styles.tagsGrid}>
              {tags.map((tag) => (
                <div
                  key={tag}
                  style={{
                    ...styles.tagItem,
                    ...(selectedTags.has(tag) ? styles.tagItemSelected : {}),
                  }}
                  onClick={() => handleTagClick(tag)}
                >
                  <span style={styles.tagText}>{tag}</span>
                  {selectedTags.has(tag) && (
                    <span style={styles.checkMark}>✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={styles.actions}>
        <Link to="../home">
          <button style={styles.skipBtn} onClick={handleSkip}>
            Skip for Now
          </button>
        </Link>
        <Link to="../home" >
          <button
            style={{
              ...styles.continueBtn,
              ...(selectedTags.size === 0 ? styles.continueBtn.disabled : {})
            }}
            onClick={handleContinue}
            disabled={selectedTags.size === 0}
          >
            Proceed
          </button>
        </Link>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '40px 25px',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(0, 119, 204, 0.1)',
    minHeight: '80vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  mainTitle: {
    color: '#1a1a1a',
    fontSize: '2.2rem',
    fontWeight: '700',
    marginBottom: '15px',
    background: 'linear-gradient(135deg, #0077cc 0%, #005fa3 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    color: '#64748b',
    fontSize: '1.1rem',
    fontWeight: '400',
    lineHeight: '1.6',
    maxWidth: '600px',
    margin: '0 auto',
  },
  selectedCount: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    padding: '15px 20px',
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    borderRadius: '12px',
    border: '1px solid rgba(0, 119, 204, 0.1)',
  },
  countText: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#0077cc',
  },
  clearBtn: {
    background: 'transparent',
    border: '2px solid #ef4444',
    color: '#ef4444',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  tagsContainer: {
    marginBottom: '40px',
  },
  tagSection: {
    marginBottom: '35px',
  },
  sectionTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: '2px solid #f1f5f9',
  },
  tagsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '12px',
  },
  tagItem: {
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    border: '2px solid transparent',
    borderRadius: '12px',
    padding: '15px 20px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    userSelect: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    minHeight: '50px',
  },
  tagItemSelected: {
    background: 'linear-gradient(135deg, #0077cc 0%, #005fa3 100%)',
    color: 'white',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(0, 119, 204, 0.3)',
    borderColor: '#0077cc',
  },
  tagText: {
    fontSize: '0.95rem',
    fontWeight: '500',
    lineHeight: '1.3',
  },
  checkMark: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    paddingTop: '20px',
    borderTop: '2px solid #f1f5f9',
  },
  skipBtn: {
    background: 'transparent',
    border: '2px solid #64748b',
    color: '#64748b',
    padding: '12px 30px',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  continueBtn: {
    background: 'linear-gradient(135deg, #0077cc 0%, #005fa3 100%)',
    border: '2px solid #0077cc',
    color: 'white',
    padding: '12px 30px',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    disabled: {
      background: '#e2e8f0',
      borderColor: '#e2e8f0',
      color: '#94a3b8',
      cursor: 'not-allowed',
    },
  },
};

// Add hover effects and responsive styles
const globalStyles = `
  .tag-item:hover:not(.selected) {
    background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%) !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(0, 119, 204, 0.2);
  }
  
  .skip-btn:hover {
    background: #64748b !important;
    color: white !important;
  }
  
  .continue-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 119, 204, 0.4) !important;
  }
  
  .clear-btn:hover {
    background: #ef4444 !important;
    color: white !important;
  }
  
  @media (max-width: 768px) {
    .container {
      padding: 20px 15px !important;
    }
    
    .main-title {
      font-size: 1.8rem !important;
    }
    
    .subtitle {
      font-size: 1rem !important;
    }
    
    .tags-grid {
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)) !important;
      gap: 10px !important;
    }
    
    .tag-item {
      padding: 12px 15px !important;
      font-size: 0.9rem !important;
    }
    
    .actions {
      flex-direction: column !important;
      gap: 15px !important;
    }
    
    .skip-btn, .continue-btn {
      width: 100% !important;
      padding: 15px !important;
    }
  }
  
  @media (max-width: 480px) {
    .container {
      padding: 15px 10px !important;
    }
    
    .main-title {
      font-size: 1.5rem !important;
    }
    
    .tags-grid {
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)) !important;
    }
    
    .selected-count {
      flex-direction: column !important;
      gap: 10px !important;
      text-align: center !important;
    }
  }
`;

// Inject global styles
const styleSheet = document.createElement("style");
styleSheet.innerText = globalStyles;
document.head.appendChild(styleSheet);

export default TagSelectionScreen;