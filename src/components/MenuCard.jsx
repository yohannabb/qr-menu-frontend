import React from 'react';

const CARD_COLORS = ['card-red', 'card-orange', 'card-green'];

export default function MenuCard({ item, index, isAdmin, onEdit, onDelete, onSelect }) {
  const assignedColor = CARD_COLORS[index % CARD_COLORS.length];

  return (
    <div 
      className={`menu-card ${assignedColor}`}
      onClick={() => onSelect(item)} 
    >
      {isAdmin && (
        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px', zIndex: 5 }} onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => onEdit(item)} 
            style={{ backgroundColor: '#2196F3', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}
          >
            EDIT
          </button>
          <button 
            onClick={() => onDelete(item._id)} 
            style={{ backgroundColor: '#f44336', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}
          >
            DELETE
          </button>
        </div>
      )}

      <div className="item-details">
        <h3 className="item-name" style={{ marginTop: isAdmin ? '24px' : '0' }}>{item.name}</h3>
        <span style={{ fontSize: '0.7rem', color: '#f39c12', background: '#1b120c', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', marginBottom: '6px' }}>
          {item.subcategory || "General Section"}
        </span>
        <p className="item-desc">{item.desc}</p>
        
        <div className="price-badge-circle">
          <span className="badge-size-label">PRICE</span>
          <span className="item-price">{item.price ? item.price.toFixed(2) : '0.00'}</span>
        </div>
      </div>

      <div className="item-image-wrapper">
        <img src={item.img} alt={item.name} className="item-image" />
      </div>
    </div>
  );
}