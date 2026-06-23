import React from 'react';

// Shared structural configuration mapping matrix
export const MENU_STRUCTURE = {
  Food: ['All Food', 'Meat Section', 'Vegetarian / Fasting', 'Burgers & Snacks'],
  Drinks: ['All Drinks', 'Hot Drinks', 'Soft Drinks & Juices', 'Alcoholic Beverages'],
  Dessert: ['All Dessert', 'Cakes', 'Pastries']
};

export default function CategoryNav({ 
  activeCategory, 
  activeSubcategory, 
  onCategoryChange, 
  onSubcategoryChange 
}) {
  return (
    <>
      {/* Main Category Level */}
      <nav className="category-bar">
        {['Food', 'Drinks', 'Dessert'].map((cat) => (
          <button 
            key={cat} 
            className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => onCategoryChange(cat)}
          >
            {cat === 'Dessert' ? 'Dessert & Pastry' : cat}
          </button>
        ))}
      </nav>

      {/* Subcategory Scroll Track */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '8px 16px', background: '#261a10' }}>
        {MENU_STRUCTURE[activeCategory].map((sub) => (
          <button
            key={sub}
            onClick={() => onSubcategoryChange(sub)}
            style={{
              padding: '6px 12px',
              borderRadius: '20px',
              border: 'none',
              fontSize: '0.8rem',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              backgroundColor: activeSubcategory === sub ? '#f39c12' : '#3d2b1d',
              color: activeSubcategory === sub ? '#000' : '#ccc',
              fontWeight: 'bold',
              transition: 'all 0.2s ease'
            }}
          >
            {sub}
          </button>
        ))}
      </div>
    </>
  );
}