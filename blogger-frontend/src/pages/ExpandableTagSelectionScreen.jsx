import React, { useState } from 'react';
import { ChevronDown, ChevronUp, X, Check } from 'lucide-react';

// Expandable Tag Section Component
const ExpandableTagSection = ({ 
  category, 
  tags, 
  selectedTags, 
  onTagToggle, 
  isExpanded, 
  onToggleExpand 
}) => {
  const selectedCount = tags.filter(tag => selectedTags.has(tag)).length;

  return (
    <div style={styles.tagSection}>
      <div 
        style={styles.sectionHeader}
        onClick={onToggleExpand}
      >
        <div style={styles.sectionLeft}>
          <h3 style={styles.sectionTitle}>{category}</h3>
          {selectedCount > 0 && (
            <span style={styles.selectedBadge}>
              {selectedCount} selected
            </span>
          )}
        </div>
        <div style={styles.expandIcon}>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>
      
      {isExpanded && (
        <div style={styles.tagsGrid}>
          {tags.map((tag) => (
            <div
              key={tag}
              style={{
                ...styles.tagItem,
                ...(selectedTags.has(tag) ? styles.tagItemSelected : {}),
              }}
              onClick={() => onTagToggle(tag)}
            >
              <span style={styles.tagText}>{tag}</span>
              {selectedTags.has(tag) && (
                <Check size={16} style={styles.checkMark} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Selected Tags Display Component
const SelectedTagsDisplay = ({ selectedTags, onRemoveTag, onClearAll }) => {
  if (selectedTags.size === 0) return null;

  return (
    <div style={styles.selectedTagsContainer}>
      <div style={styles.selectedTagsHeader}>
        <h3 style={styles.selectedTagsTitle}>Selected Tags ({selectedTags.size})</h3>
        <button style={styles.clearAllBtn} onClick={onClearAll}>
          Clear All
        </button>
      </div>
      <div style={styles.selectedTagsList}>
        {Array.from(selectedTags).map((tag) => (
          <div key={tag} style={styles.selectedTag}>
            <span>{tag}</span>
            <button 
              style={styles.removeTagBtn}
              onClick={() => onRemoveTag(tag)}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Tag Selection Component
const ExpandableTagSelectionScreen = ({
  heading = 'Choose tags',
  subtitle = `Select the topics that are most relevant to your blog\nThis will enhance the blog's visibility.`,
  onTagsChange,
  initialSelectedTags = new Set()
}) => {
  const [selectedTags, setSelectedTags] = useState(initialSelectedTags);
  const [expandedSections, setExpandedSections] = useState(new Set(['Technology'])); // Technology expanded by default

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

  const handleTagToggle = (tag) => {
    const newSelectedTags = new Set(selectedTags);
    if (newSelectedTags.has(tag)) {
      newSelectedTags.delete(tag);
    } else {
      newSelectedTags.add(tag);
    }
    setSelectedTags(newSelectedTags);
    onTagsChange?.(Array.from(newSelectedTags));
  };

  const handleSectionToggle = (category) => {
    const newExpandedSections = new Set(expandedSections);
    if (newExpandedSections.has(category)) {
      newExpandedSections.delete(category);
    } else {
      newExpandedSections.add(category);
    }
    setExpandedSections(newExpandedSections);
  };

  const handleRemoveTag = (tag) => {
    const newSelectedTags = new Set(selectedTags);
    newSelectedTags.delete(tag);
    setSelectedTags(newSelectedTags);
    onTagsChange?.(Array.from(newSelectedTags));
  };

  const handleClearAll = () => {
    setSelectedTags(new Set());
    onTagsChange?.([]);
  };

  const expandAll = () => {
    setExpandedSections(new Set(Object.keys(tagCategories)));
  };

  const collapseAll = () => {
    setExpandedSections(new Set());
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.mainTitle}>{heading}</h1>
        <p style={styles.subtitle}>{subtitle}</p>
      </div>

      <div style={styles.controls}>
        <div style={styles.expandControls}>
          <button style={styles.controlBtn} onClick={expandAll}>
            Expand All
          </button>
          <button style={styles.controlBtn} onClick={collapseAll}>
            Collapse All
          </button>
        </div>
        <div style={styles.tagCount}>
          Total: {selectedTags.size} tags selected
        </div>
      </div>

      <SelectedTagsDisplay 
        selectedTags={selectedTags}
        onRemoveTag={handleRemoveTag}
        onClearAll={handleClearAll}
      />

      <div style={styles.categoriesContainer}>
        {Object.entries(tagCategories).map(([category, tags]) => (
          <ExpandableTagSection
            key={category}
            category={category}
            tags={tags}
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
            isExpanded={expandedSections.has(category)}
            onToggleExpand={() => handleSectionToggle(category)}
          />
        ))}
      </div>

      {/* <div style={styles.actions}>
        <button
          style={{
            ...styles.saveBtn,
            ...(selectedTags.size === 0 ? styles.saveBtnDisabled : {})
          }}
          onClick={() => {
            console.log('Saved tags:', Array.from(selectedTags));
            alert(`Saved ${selectedTags.size} tags!`);
          }}
          disabled={selectedTags.size === 0}
        >
          Save Preferences ({selectedTags.size})
        </button>
      </div> */}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '30px 20px',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  mainTitle: {
    color: '#1a1a1a',
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '10px',
    background: 'linear-gradient(135deg, #0077cc 0%, #005fa3 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    color: '#64748b',
    fontSize: '1rem',
    lineHeight: '1.6',
    maxWidth: '600px',
    margin: '0 auto',
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
    padding: '15px 20px',
    background: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
  },
  expandControls: {
    display: 'flex',
    gap: '10px',
  },
  controlBtn: {
    background: 'transparent',
    border: '1px solid #64748b',
    color: '#64748b',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  tagCount: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#0077cc',
  },
  selectedTagsContainer: {
    marginBottom: '30px',
    padding: '20px',
    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
    borderRadius: '12px',
    border: '1px solid #0ea5e9',
  },
  selectedTagsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  selectedTagsTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#0369a1',
    margin: 0,
  },
  clearAllBtn: {
    background: 'transparent',
    border: '1px solid #ef4444',
    color: '#ef4444',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  selectedTagsList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  selectedTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: '#0ea5e9',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  removeTagBtn: {
    background: 'transparent',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    padding: '2px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s ease',
  },
  categoriesContainer: {
    marginBottom: '30px',
  },
  tagSection: {
    marginBottom: '15px',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 20px',
    background: '#f8fafc',
    cursor: 'pointer',
    transition: 'background 0.2s ease',
    borderBottom: '1px solid #e2e8f0',
  },
  sectionLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1a1a1a',
    margin: 0,
  },
  selectedBadge: {
    background: '#0077cc',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: '500',
  },
  expandIcon: {
    color: '#64748b',
    transition: 'transform 0.2s ease',
  },
  tagsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '10px',
    padding: '20px',
    background: 'white',
  },
  tagItem: {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '12px 16px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    userSelect: 'none',
  },
  tagItemSelected: {
    background: 'linear-gradient(135deg, #0077cc 0%, #005fa3 100%)',
    color: 'white',
    borderColor: '#0077cc',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(0, 119, 204, 0.3)',
  },
  tagText: {
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  checkMark: {
    color: 'white',
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '20px',
    borderTop: '1px solid #e2e8f0',
  },
  saveBtn: {
    background: 'linear-gradient(135deg, #0077cc 0%, #005fa3 100%)',
    border: 'none',
    color: 'white',
    padding: '12px 30px',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  saveBtnDisabled: {
    background: '#e2e8f0',
    color: '#94a3b8',
    cursor: 'not-allowed',
  },
};

export default ExpandableTagSelectionScreen