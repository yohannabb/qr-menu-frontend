import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { MENU_STRUCTURE } from './CategoryNav';

export default function AdminPanel({ 
  editingItem, 
  form, 
  handleInputChange, 
  handleMainCategoryChange, 
  setImageFile, 
  handleSubmit, 
  cancelEdit 
}) {
  return (
    <div style={{ backgroundColor: '#1b120c', padding: '16px', borderBottom: '3px solid #f39c12', fontFamily: 'sans-serif' }}>
      
      {/* QR Code Container hidden completely inside Admin wrapper ecosystem */}
      <div className="qr-container" style={{ margin: '0 auto 20px auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', background: '#fff', padding: '10px', borderRadius: '8px', width: 'fit-content' }}>
        <QRCodeSVG 
          value={window.location.href} 
          size={120}
          bgColor={"#ffffff"}
          fgColor={"#1b120c"}
          level={"L"}
        />
        <span style={{ color: '#1b120c', fontSize: '0.65rem', fontWeight: 'bold' }}>SCAN FOR DIGITAL MENU</span>
      </div>

      <h3 style={{ color: '#f39c12', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
        {editingItem ? "⚡ Editing Mode" : "📝 Add New Cafeteria Item"}
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <input type="text" name="name" placeholder="Item Name" value={form.name} onChange={handleInputChange} style={{ padding: '8px', borderRadius: '4px', border: 'none' }} />
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <input type="number" step="0.01" name="price" placeholder="Price (ETB)" value={form.price} onChange={handleInputChange} style={{ padding: '8px', borderRadius: '4px', border: 'none', flex: 1 }} />
          
          <select name="category" value={form.category} onChange={handleMainCategoryChange} style={{ padding: '8px', borderRadius: '4px', border: 'none', flex: 1 }}>
            <option value="Food">Food</option>
            <option value="Drinks">Drinks</option>
            <option value="Dessert">Dessert & Pastry</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ color: '#f39c12', fontSize: '0.8rem', fontWeight: 'bold' }}>Specific Menu Section:</label>
          <select name="subcategory" value={form.subcategory} onChange={handleInputChange} style={{ padding: '8px', borderRadius: '4px', border: 'none', width: '100%' }}>
            {MENU_STRUCTURE[form.category].slice(1).map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>
        
        <label style={{ color: '#f39c12', fontSize: '0.85rem', fontWeight: 'bold' }}>Upload Item Image File:</label>
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => setImageFile(e.target.files[0])} 
          style={{ padding: '6px', color: '#fff', background: '#33231a', borderRadius: '4px' }} 
        />
        
        <textarea name="desc" placeholder="Ingredients description details..." value={form.desc} onChange={handleInputChange} rows="2" style={{ padding: '8px', borderRadius: '4px', border: 'none', fontFamily: 'sans-serif' }}></textarea>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="button" onClick={handleSubmit} style={{ backgroundColor: '#f39c12', color: '#000', border: 'none', padding: '10px', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer', flex: 2 }}>
            {editingItem ? "Update Item" : "Save to Cafeteria System"}
          </button>
          {editingItem && (
            <button type="button" onClick={cancelEdit} style={{ backgroundColor: '#777', color: '#fff', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer', flex: 1 }}>
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}