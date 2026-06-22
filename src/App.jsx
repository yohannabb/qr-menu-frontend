import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react'; 
import './App.css';

const CARD_COLORS = ['card-red', 'card-orange', 'card-green'];

function App() {
  const [menuItems, setMenuItems] = useState([]); 
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);

  // Admin Dashboard States
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingItem, setEditingItem] = useState(null); 
  const [form, setForm] = useState({ name: '', price: '', category: 'Food', desc: '', img: '' });

  // Fetch items from database
  const fetchMenu = () => {
    setLoading(true);
    fetch('https://qr-menu-backend-qkfd.onrender.com')
      .then((res) => res.json())
      .then((data) => {
        setMenuItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // Admin Login Handler
  const handleAdminLogin = () => {
    if (isAdmin) {
      setIsAdmin(false); 
    } else {
      const pin = prompt("Enter Admin Password Pin:");
      if (pin === "1234") { 
        setIsAdmin(true);
      } else {
        alert("Incorrect Pin Code!");
      }
    }
  };

  // Form input changer helper
  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle Add or Update Submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Frontend Tracking Alerts
    alert("handleSubmit function has started running!");
    console.log("Form state right now:", form);

    // Simple validation safeguard
    if (!form.name || !form.price) {
      alert("Please provide at least a Name and Price before saving.");
      return;
    }
    
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('price', form.price);
    formData.append('category', form.category);
    formData.append('desc', form.desc);
    
    if (editingItem && !imageFile) {
      formData.append('img', form.img);
    }
    
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const url = editingItem 
  ? `https://qr-menu-backend-qkfd.onrender.com/api/menu/${editingItem._id}` 
  : 'https://qr-menu-backend-qkfd.onrender.com/api/menu';
    
    const method = editingItem ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      body: formData 
    })
    .then(res => res.json())
    .then(() => {
      alert(editingItem ? "Item Updated!" : "Item Added Successfully!");
      setForm({ name: '', price: '', category: 'Food', desc: '', img: '' });
      setImageFile(null); 
      setEditingItem(null);
      fetchMenu();
    })
    .catch(err => {
      alert("Network or Server connection error occurred!");
      console.error("Error saving item:", err);
    });
  };

  // Populate form fields for Editing
  const startEdit = (item, e) => {
    e.stopPropagation(); 
    setEditingItem(item);
    setForm({
      name: item.name,
      price: item.price,
      category: item.category,
      desc: item.desc || '',
      img: item.img || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  // Delete Handler
  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm("Are you completely sure you want to delete this menu item?")) {
      fetch(`https://qr-menu-backend-qkfd.onrender.com/api/menu/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(() => {
          alert("Item Deleted!");
          fetchMenu();
        })
        .catch(err => console.error("Error deleting:", err));
    }
  };

  const filteredMenu = activeCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category && item.category.trim().toLowerCase() === activeCategory.trim().toLowerCase());

  return (
    <div className="mobile-layout">
      {/* Header Layout */}
      <header className="menu-header">
        <div className="brand-badge">
          <h1 className="restaurant-name">HABESHA'S HOTEL</h1>
        </div>
        <p className="restaurant-tagline">Savour the Taste • Scan • Order • Enjoy</p>
      </header>

      {/* ADMIN CONTROL PANEL DASHBOARD VIEW */}
      {isAdmin && (
        <div style={{ backgroundColor: '#1b120c', padding: '16px', borderBottom: '3px solid #f39c12', fontFamily: 'sans-serif' }}>
          <h3 style={{ color: '#f39c12', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
            {editingItem ? "⚡ Editing Mode" : "📝 Add New Menu Item"}
          </h3>
          
          {/* CHANGED FROM <form> TO <div> TO BYPASS BROWSER VALIDATION ENTIRELY */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input type="text" name="name" placeholder="Food Name" value={form.name} onChange={handleInputChange} style={{ padding: '8px', borderRadius: '4px', border: 'none' }} />
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="number" step="0.01" name="price" placeholder="Price ($)" value={form.price} onChange={handleInputChange} style={{ padding: '8px', borderRadius: '4px', border: 'none', flex: 1 }} />
              <select name="category" value={form.category} onChange={handleInputChange} style={{ padding: '8px', borderRadius: '4px', border: 'none', flex: 1 }}>
                <option value="Food">Food</option>
                <option value="Drinks">Drinks</option>
                <option value="Dessert">Dessert</option>
              </select>
            </div>
            
            <label style={{ color: '#f39c12', fontSize: '0.85rem', fontWeight: 'bold' }}>Upload Food Image File:</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setImageFile(e.target.files[0])} 
              style={{ padding: '6px', color: '#fff', background: '#33231a', borderRadius: '4px' }} 
            />
            
            <textarea name="desc" placeholder="Item Ingredients or Description..." value={form.desc} onChange={handleInputChange} rows="2" style={{ padding: '8px', borderRadius: '4px', border: 'none', fontFamily: 'sans-serif' }}></textarea>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              {/* ADDED onClick HERE TO FORCE THE FUNCTION TO RUN EXPLICITLY */}
              <button type="button" onClick={handleSubmit} style={{ backgroundColor: '#f39c12', color: '#000', border: 'none', padding: '10px', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer', flex: 2 }}>
                {editingItem ? "Update Item" : "Save to Database"}
              </button>
              {editingItem && (
                <button type="button" onClick={() => { setEditingItem(null); setForm({ name: '', price: '', category: 'Food', desc: '', img: '' }); }} style={{ backgroundColor: '#777', color: '#fff', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer', flex: 1 }}>
                  Cancel
                </button>
              )}
            </div>
          </div>

          <div style={{ 
            marginTop: '20px', 
            padding: '16px', 
            backgroundColor: '#261a10', 
            borderRadius: '6px', 
            textAlign: 'center',
            border: '1px dashed #f39c12' 
          }}>
            <h4 style={{ color: '#f39c12', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
              📱 Restaurant Table QR Code
            </h4>
            <p style={{ color: '#ccc', fontSize: '0.85rem', margin: '0 0 12px 0' }}>
              Scan this code with your phone to view the live menu layout.
            </p>
            
            <div style={{ background: '#fff', padding: '12px', display: 'inline-block', borderRadius: '4px' }}>
              <QRCodeSVG 
                value={window.location.href} 
                size={180}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"M"}
              />
            </div>
            
            <div style={{ color: '#f39c12', fontSize: '0.8rem', marginTop: '8px', wordBreak: 'break-all' }}>
              <strong>Target Link:</strong> {window.location.href}
            </div>
          </div>

        </div>
      )}
      {/* Category Navigation Bar */}
      <nav className="category-bar">
        {['All', 'Food', 'Drinks', 'Dessert'].map((cat) => (
          <button 
            key={cat} 
            className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </nav>

      <div className="menu-section-header">
        <h2>{activeCategory === 'All' ? 'MAIN DISHES' : `${activeCategory.toUpperCase()}`}</h2>
      </div>

      {/* Menu Cards Display */}
      <main className="menu-list">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', fontFamily: 'sans-serif' }}>Loading delicious menu...</div>
        ) : filteredMenu.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', fontFamily: 'sans-serif', opacity: 0.7 }}>No items found.</div>
        ) : (
          filteredMenu.map((item, index) => {
            const assignedColor = CARD_COLORS[index % CARD_COLORS.length];

            return (
              <div 
                key={item._id} 
                className={`menu-card ${assignedColor}`}
                onClick={() => setSelectedItem(item)} 
              >
                {isAdmin && (
                  <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px', zIndex: 5 }}>
                    <button onClick={(e) => startEdit(item, e)} style={{ backgroundColor: '#2196F3', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}>EDIT</button>
                    <button onClick={(e) => handleDelete(item._id, e)} style={{ backgroundColor: '#f44336', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}>DELETE</button>
                  </div>
                )}

                <div className="item-details">
                  <h3 className="item-name" style={{ marginTop: isAdmin ? '24px' : '0' }}>{item.name}</h3>
                  <p className="item-desc">{item.desc}</p>
                  
                  <div className="price-badge-circle">
                    <span className="badge-size-label">PRICE</span>
                    <span className="item-price">${item.price ? item.price.toFixed(2) : '0.00'}</span>
                  </div>
                </div>

                <div className="item-image-wrapper">
                  <img src={item.img} alt={item.name} className="item-image" />
                </div>
              </div>
            );
          })
        )}
      </main>

      {/* DETAILS POPUP MODAL */}
      {selectedItem && (
        <div className="modal-backdrop" onClick={() => setSelectedItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedItem(null)}>×</button>
            <img src={selectedItem.img} alt={selectedItem.name} className="modal-image" />
            <div className="modal-body">
              <div className="modal-header-row">
                <h3 className="modal-item-name">{selectedItem.name}</h3>
                <span className="modal-item-price">${selectedItem.price ? selectedItem.price.toFixed(2) : '0.00'}</span>
              </div>
              <span className="modal-category-tag">{selectedItem.category}</span>
              <p className="modal-item-desc">{selectedItem.desc}</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer System */}
      <footer className="menu-footer">
        <p className="footer-line-1">ALL MEALS ARE PREPARED FRESH TO ORDER.</p>
        <p className="footer-line-2">THANK YOU FOR YOUR PATRONAGE!</p>
        <button 
          onClick={handleAdminLogin} 
          style={{ background: 'none', border: 'none', color: '#f39c12', opacity: 0.3, fontSize: '0.7rem', marginTop: '12px', cursor: 'pointer', textDecoration: 'underline' }}
        >
          {isAdmin ? "[Logout Admin Panel]" : "[Admin Management Portal]"}
        </button>
      </footer>
    </div>
  );
}

export default App;