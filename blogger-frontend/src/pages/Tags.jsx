// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// const TagSelectionScreen = ({heading='Topics that interest you',subtitle=`Select the topics you're interested in to personalize your blogging experience.\n +
//           We'll show you content that matches your preferences.`,context='onboarding'}) => {
//   const [selectedTags, setSelectedTags] = useState(new Set());

//   const tagCategories = {
//     'Technology': [
//       'Web Development', 'Mobile Apps', 'AI & Machine Learning', 'Data Science',
//       'Cybersecurity', 'Cloud Computing', 'DevOps', 'Programming', 'Software Engineering'
//     ],
//     'Lifestyle': [
//       'Health & Fitness', 'Travel', 'Food & Cooking', 'Fashion', 'Home & Garden',
//       'Relationships', 'Self Improvement', 'Mindfulness', 'Productivity'
//     ],
//     'Business': [
//       'Entrepreneurship', 'Marketing', 'Finance', 'Leadership', 'Startup',
//       'E-commerce', 'Digital Marketing', 'Business Strategy', 'Personal Branding'
//     ],
//     'Creative': [
//       'Photography', 'Design', 'Writing', 'Art', 'Music', 'Film & Video',
//       'Creative Writing', 'Graphic Design', 'Content Creation'
//     ],
//     'Education': [
//       'Learning', 'Online Courses', 'Career Development', 'Study Tips',
//       'Skills Development', 'Tutorials', 'Book Reviews', 'Research'
//     ],
//     'Entertainment': [
//       'Movies', 'TV Shows', 'Gaming', 'Books', 'Sports', 'Pop Culture',
//       'Celebrity News', 'Reviews', 'Entertainment News'
//     ]
//   };
//   const navigate = useNavigate();

//   const handleTagClick = (tag) => {
//     const newSelectedTags = new Set(selectedTags);
//     if (newSelectedTags.has(tag)) {
//       newSelectedTags.delete(tag);
//     } else {
//       newSelectedTags.add(tag);
//     }
//     setSelectedTags(newSelectedTags);
//   };

//   const handleContinue = () => {
//     console.log('Selected tags:', Array.from(selectedTags));
//     // Handle navigation or save preferences

//     navigate('../home', { replace: true })
//   };

//   const handleSkip = () => {
//     console.log('User skipped tag selection');
//     // Handle skip action
//     alert('Skipped tag selection');
//   };

//   const clearAllTags = () => {
//     setSelectedTags(new Set());
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.header}>
//         <h1 style={styles.mainTitle}>Choose {heading}</h1>
//         <p style={styles.subtitle}>
//           {subtitle}
//         </p>
//       </div>

//       <div style={styles.selectedCount}>
//         <span style={styles.countText}>
//           {selectedTags.size} tags selected
//         </span>
//         {selectedTags.size > 0 && (
//           <button style={styles.clearBtn} onClick={clearAllTags}>
//             Clear All
//           </button>
//         )}
//       </div>

//       <div style={styles.tagsContainer}>
//         {Object.entries(tagCategories).map(([category, tags]) => (
//           <div key={category} style={styles.tagSection}>
//             <h3 style={styles.sectionTitle}>{category}</h3>
//             <div style={styles.tagsGrid}>
//               {tags.map((tag) => (
//                 <div
//                   key={tag}
//                   style={{
//                     ...styles.tagItem,
//                     ...(selectedTags.has(tag) ? styles.tagItemSelected : {}),
//                   }}
//                   onClick={() => handleTagClick(tag)}
//                 >
//                   <span style={styles.tagText}>{tag}</span>
//                   {selectedTags.has(tag) && (
//                     <span style={styles.checkMark}>✓</span>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>

//       <div style={styles.actions}>
//         <Link to="../home">
//           <button style={styles.skipBtn} onClick={handleSkip}>
//             Skip for Now
//           </button>
//         </Link>
//         <Link to="../home" >
//           <button
//             style={{
//               ...styles.continueBtn,
//               ...(selectedTags.size === 0 ? styles.continueBtn.disabled : {})
//             }}
//             onClick={handleContinue}
//             disabled={selectedTags.size === 0}
//           >
//             Personalise your feed
//           </button>
//         </Link>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     maxWidth: '1000px',
//     margin: '0 auto',
//     padding: '40px 25px',
//     background: 'white',
//     borderRadius: '16px',
//     boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
//     border: '1px solid rgba(0, 119, 204, 0.1)',
//     minHeight: '80vh',
//     fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
//   },
//   header: {
//     textAlign: 'center',
//     marginBottom: '40px',
//   },
//   mainTitle: {
//     color: '#1a1a1a',
//     fontSize: '2.2rem',
//     fontWeight: '700',
//     marginBottom: '15px',
//     background: 'linear-gradient(135deg, #0077cc 0%, #005fa3 100%)',
//     WebkitBackgroundClip: 'text',
//     WebkitTextFillColor: 'transparent',
//     backgroundClip: 'text',
//   },
//   subtitle: {
//     color: '#64748b',
//     fontSize: '1.1rem',
//     fontWeight: '400',
//     lineHeight: '1.6',
//     maxWidth: '600px',
//     margin: '0 auto',
//   },
//   selectedCount: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: '30px',
//     padding: '15px 20px',
//     background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
//     borderRadius: '12px',
//     border: '1px solid rgba(0, 119, 204, 0.1)',
//   },
//   countText: {
//     fontSize: '1rem',
//     fontWeight: '600',
//     color: '#0077cc',
//   },
//   clearBtn: {
//     background: 'transparent',
//     border: '2px solid #ef4444',
//     color: '#ef4444',
//     padding: '8px 16px',
//     borderRadius: '8px',
//     fontSize: '0.9rem',
//     fontWeight: '500',
//     cursor: 'pointer',
//     transition: 'all 0.3s ease',
//   },
//   tagsContainer: {
//     marginBottom: '40px',
//   },
//   tagSection: {
//     marginBottom: '35px',
//   },
//   sectionTitle: {
//     fontSize: '1.3rem',
//     fontWeight: '600',
//     color: '#1a1a1a',
//     marginBottom: '20px',
//     paddingBottom: '10px',
//     borderBottom: '2px solid #f1f5f9',
//   },
//   tagsGrid: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
//     gap: '12px',
//   },
//   tagItem: {
//     background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
//     border: '2px solid transparent',
//     borderRadius: '12px',
//     padding: '15px 20px',
//     textAlign: 'center',
//     cursor: 'pointer',
//     transition: 'all 0.3s ease',
//     position: 'relative',
//     overflow: 'hidden',
//     userSelect: 'none',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: '8px',
//     minHeight: '50px',
//   },
//   tagItemSelected: {
//     background: 'linear-gradient(135deg, #0077cc 0%, #005fa3 100%)',
//     color: 'white',
//     transform: 'translateY(-2px)',
//     boxShadow: '0 6px 20px rgba(0, 119, 204, 0.3)',
//     borderColor: '#0077cc',
//   },
//   tagText: {
//     fontSize: '0.95rem',
//     fontWeight: '500',
//     lineHeight: '1.3',
//   },
//   checkMark: {
//     fontSize: '1.1rem',
//     fontWeight: 'bold',
//   },
//   actions: {
//     display: 'flex',
//     justifyContent: 'center',
//     gap: '20px',
//     paddingTop: '20px',
//     borderTop: '2px solid #f1f5f9',
//   },
//   skipBtn: {
//     background: 'transparent',
//     border: '2px solid #64748b',
//     color: '#64748b',
//     padding: '12px 30px',
//     borderRadius: '12px',
//     fontSize: '1rem',
//     fontWeight: '600',
//     cursor: 'pointer',
//     transition: 'all 0.3s ease',
//   },
//   continueBtn: {
//     background: 'linear-gradient(135deg, #0077cc 0%, #005fa3 100%)',
//     border: '2px solid #0077cc',
//     color: 'white',
//     padding: '12px 30px',
//     borderRadius: '12px',
//     fontSize: '1rem',
//     fontWeight: '600',
//     cursor: 'pointer',
//     transition: 'all 0.3s ease',
//     disabled: {
//       background: '#e2e8f0',
//       borderColor: '#e2e8f0',
//       color: '#94a3b8',
//       cursor: 'not-allowed',
//     },
//   },
// };

// // Add hover effects and responsive styles
// const globalStyles = `
//   .tag-item:hover:not(.selected) {
//     background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%) !important;
//     transform: translateY(-1px);
//     box-shadow: 0 4px 15px rgba(0, 119, 204, 0.2);
//   }

//   .skip-btn:hover {
//     background: #64748b !important;
//     color: white !important;
//   }

//   .continue-btn:hover:not(:disabled) {
//     transform: translateY(-2px);
//     box-shadow: 0 8px 25px rgba(0, 119, 204, 0.4) !important;
//   }

//   .clear-btn:hover {
//     background: #ef4444 !important;
//     color: white !important;
//   }

//   @media (max-width: 768px) {
//     .container {
//       padding: 20px 15px !important;
//     }

//     .main-title {
//       font-size: 1.8rem !important;
//     }

//     .subtitle {
//       font-size: 1rem !important;
//     }

//     .tags-grid {
//       grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)) !important;
//       gap: 10px !important;
//     }

//     .tag-item {
//       padding: 12px 15px !important;
//       font-size: 0.9rem !important;
//     }

//     .actions {
//       flex-direction: column !important;
//       gap: 15px !important;
//     }

//     .skip-btn, .continue-btn {
//       width: 100% !important;
//       padding: 15px !important;
//     }
//   }

//   @media (max-width: 480px) {
//     .container {
//       padding: 15px 10px !important;
//     }

//     .main-title {
//       font-size: 1.5rem !important;
//     }

//     .tags-grid {
//       grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)) !important;
//     }

//     .selected-count {
//       flex-direction: column !important;
//       gap: 10px !important;
//       text-align: center !important;
//     }
//   }
// `;

// // Inject global styles
// const styleSheet = document.createElement("style");
// styleSheet.innerText = globalStyles;
// document.head.appendChild(styleSheet);

// export default TagSelectionScreen;

import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { userAPI } from '../api/userAPI';


export default function TagSelectionScreenWrapper() {
  const location = useLocation();
  const { preSelectedTags = [] } = location.state || {};

  return (
    <TagSelectionScreen
      preSelectedTags={preSelectedTags}
    />
  );
}

const TagSelectionScreen = ({
  heading = 'Topics that interest you',
  subtitle = `Select the topics you're interested in to personalize your blogging experience.\nWe'll show you content that matches your preferences.`,
  context = 'onboarding',
  preSelectedTags = []
}) => {
  const [selectedTags, setSelectedTags] = useState(new Set());
  const [initialTags] = useState(new Set(preSelectedTags));
  const [tagsToAdd, setTagsToAdd] = useState(new Set());
  const [tagsToRemove, setTagsToRemove] = useState(new Set());

  const tagCategories = {
    'Technology': [
      'Web Development', 'Mobile Apps', 'AI & Machine Learning', 'Data Science',
      'Cybersecurity', 'Cloud Computing', 'DevOps', 'Programming', 'Software Engineering','React.js','Node.js','Django','Flask','Machine Learning','Deep Learning','NLP','Computer Vision','AWS','Azure','Kubernetes','Docker','Agile Methodologies','Microservices','Blockchain','IoT','AR/VR','Quantum Computing','5G Technology','Edge Computing','Robotics','Automation','Big Data','Data Visualization','Data Engineering','R Programming','Scala','Hadoop','Spark'
    ],
    'Lifestyle': [
      'Health & Fitness', 'Travel', 'Food & Cooking', 'Fashion', 'Home & Garden',
      'Relationships', 'Self Improvement', 'Mindfulness', 'Productivity','Yoga','Meditation','Vegan Recipes','Interior Design','Personal Finance','Mental Health','Work-Life Balance','Sustainable Living','Parenting','Beauty Tips'
    ],
    'Business': [
      'Entrepreneurship', 'Marketing', 'Finance', 'Leadership', 'Startup',
      'E-commerce', 'Digital Marketing', 'Business Strategy', 'Personal Branding','SEO','Content Marketing','Social Media Marketing','Investment Strategies','Cryptocurrency','Project Management','Sales Techniques','Customer Experience','Business Analytics','Remote Work','Gig Economy'
    ],
    'Creative': [
      'Photography', 'Design', 'Writing', 'Art', 'Music', 'Film & Video',
      'Creative Writing', 'Graphic Design', 'Content Creation','Illustration','Animation','UX/UI Design','Poetry','Songwriting','Filmmaking','Video Editing','Podcasting','Creative Entrepreneurship'
    ],
    'Education': [
      'Learning', 'Online Courses', 'Career Development', 'Study Tips',
      'Skills Development', 'Tutorials', 'Book Reviews', 'Research','Language Learning','Coding Tutorials','Career Advice','Academic Research','E-learning Platforms','Time Management','Exam Preparation','Scholarships','Educational Technology'
    ],
    'Entertainment': [
      'Movies', 'TV Shows', 'Gaming', 'Books', 'Sports', 'Pop Culture',
      'Celebrity News', 'Reviews', 'Entertainment News','Video Games','Board Games','Comics & Graphic Novels','Fantasy Sports','Movie Reviews','TV Show Recaps','Music Reviews','Concerts & Festivals'
    ]
  };

  const navigate = useNavigate();

  // Initialize selected tags with pre-selected ones
  useEffect(() => {
    setSelectedTags(new Set(preSelectedTags));
  }, [preSelectedTags]);

  // Update add/remove sets whenever selectedTags changes
  useEffect(() => {
    const newTagsToAdd = new Set();
    const newTagsToRemove = new Set();

    // Check for tags to add (in selected but not in initial)
    selectedTags.forEach(tag => {
      if (!initialTags.has(tag)) {
        newTagsToAdd.add(tag);
      }
    });

    // Check for tags to remove (in initial but not in selected)
    initialTags.forEach(tag => {
      if (!selectedTags.has(tag)) {
        newTagsToRemove.add(tag);
      }
    });

    setTagsToAdd(newTagsToAdd);
    setTagsToRemove(newTagsToRemove);
  }, [selectedTags, initialTags]);

  const handleTagClick = (tag) => {
    const newSelectedTags = new Set(selectedTags);
    if (newSelectedTags.has(tag)) {
      newSelectedTags.delete(tag);
    } else {
      newSelectedTags.add(tag);
    }
    setSelectedTags(newSelectedTags);
  };

  const handleContinue = async () => {
    console.log('Selected tags:', Array.from(selectedTags));
    console.log('Tags to add:', Array.from(tagsToAdd));
    console.log('Tags to remove:', Array.from(tagsToRemove));

    // You can now use tagsToAdd and tagsToRemove for your API calls
    // For example:
    // await updateUserTags({ add: Array.from(tagsToAdd), remove: Array.from(tagsToRemove) });
    await userAPI.editTags(Array.from(tagsToAdd), Array.from(tagsToRemove));

    navigate('../home', { replace: true });
  };

  const handleSkip = () => {
    console.log('User skipped tag selection');
    console.log('No changes made - Tags to add:', Array.from(tagsToAdd));
    console.log('No changes made - Tags to remove:', Array.from(tagsToRemove));
    alert('Skipped tag selection');
  };

  const clearAllTags = () => {
    setSelectedTags(new Set());
  };

  const resetToInitial = () => {
    setSelectedTags(new Set(initialTags));
  };

  const hasChanges = tagsToAdd.size > 0 || tagsToRemove.size > 0;

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
        <div style={styles.buttonGroup}>
          {selectedTags.size > 0 && (
            <button style={styles.clearBtn} onClick={clearAllTags}>
              Clear All
            </button>
          )}
          {hasChanges && (
            <button style={styles.resetBtn} onClick={resetToInitial}>
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Show changes summary if there are any */}
      {hasChanges && (
        <div style={styles.changesContainer}>
          <div style={styles.changesHeader}>Changes:</div>
          <div style={styles.changesContent}>
            {tagsToAdd.size > 0 && (
              <span style={styles.addedTags}>
                +{tagsToAdd.size} to add
              </span>
            )}
            {tagsToRemove.size > 0 && (
              <span style={styles.removedTags}>
                -{tagsToRemove.size} to remove
              </span>
            )}
          </div>
        </div>
      )}

      <div style={styles.tagsContainer}>
        {Object.entries(tagCategories).map(([category, tags]) => (
          <div key={category} style={styles.tagSection}>
            <h3 style={styles.sectionTitle}>{category}</h3>
            <div style={styles.tagsGrid}>
              {tags.map((tag) => {
                const isSelected = selectedTags.has(tag);
                const isInitiallySelected = initialTags.has(tag);
                const isNewlyAdded = tagsToAdd.has(tag);
                const isBeingRemoved = tagsToRemove.has(tag);

                return (
                  <div
                    key={tag}
                    style={{
                      ...styles.tagItem,
                      ...(isSelected ? styles.tagItemSelected : {}),
                      ...(isNewlyAdded ? styles.tagItemNew : {}),
                      ...(isBeingRemoved ? styles.tagItemRemoving : {}),
                    }}
                    onClick={() => handleTagClick(tag)}
                  >
                    <span style={styles.tagText}>{tag}</span>
                    {isSelected && (
                      <span style={styles.checkMark}>✓</span>
                    )}
                    {isNewlyAdded && (
                      <span style={styles.newIndicator}>NEW</span>
                    )}
                  </div>
                );
              })}
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

        <button
          style={{
            ...styles.continueBtn,
            ...(selectedTags.size === 0 ? styles.continueBtn.disabled : {})
          }}
          onClick={() => handleContinue()}
          disabled={selectedTags.size === 0}
        >
          {hasChanges ? 'Save Changes' : 'Personalise your feed'}
        </button>

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
    marginBottom: '20px',
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
  buttonGroup: {
    display: 'flex',
    gap: '10px',
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
  resetBtn: {
    background: 'transparent',
    border: '2px solid #f59e0b',
    color: '#f59e0b',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  changesContainer: {
    marginBottom: '20px',
    padding: '15px 20px',
    background: 'linear-gradient(135deg, #fef7ff 0%, #fdf4ff 100%)',
    borderRadius: '12px',
    border: '1px solid rgba(168, 85, 247, 0.2)',
  },
  changesHeader: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#7c3aed',
    marginBottom: '8px',
  },
  changesContent: {
    display: 'flex',
    gap: '15px',
  },
  addedTags: {
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#059669',
    background: '#d1fae5',
    padding: '4px 8px',
    borderRadius: '6px',
  },
  removedTags: {
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#dc2626',
    background: '#fee2e2',
    padding: '4px 8px',
    borderRadius: '6px',
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
  tagItemNew: {
    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    color: 'white',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(5, 150, 105, 0.3)',
    borderColor: '#059669',
  },
  tagItemRemoving: {
    background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
    color: '#dc2626',
    border: '2px solid #fca5a5',
    opacity: '0.7',
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
  newIndicator: {
    fontSize: '0.7rem',
    fontWeight: 'bold',
    background: 'rgba(255, 255, 255, 0.3)',
    padding: '2px 6px',
    borderRadius: '4px',
    position: 'absolute',
    top: '4px',
    right: '4px',
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
  
  .reset-btn:hover {
    background: #f59e0b !important;
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
    
    .button-group {
      justify-content: center !important;
    }
    
    .changes-content {
      flex-direction: column !important;
      gap: 8px !important;
    }
  }
`;

// Inject global styles
const styleSheet = document.createElement("style");
styleSheet.innerText = globalStyles;
document.head.appendChild(styleSheet);

// export default TagSelectionScreen;