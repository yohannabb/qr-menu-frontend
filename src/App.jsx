import React, { useState, useEffect } from 'react';
import CategoryNav, { MENU_STRUCTURE } from './components/CategoryNav';
import MenuCard from './components/MenuCard';
import AdminPanel from './components/AdminPanel';
import './App.css';

// Central localization dictionary data mapping
const translations = {
  en: {
    title: "CAFE & PASTRY HUB",
    tagline: "Fresh Cooking • Scan • Enjoy",
    loading: "Loading menu records...",
    noItems: "No items found in this section.",
    freshNotice: "ALL MEALS ARE PREPARED FRESH TO ORDER.",
    adminPortal: "[Admin Management Portal]",
    logoutAdmin: "[Logout Admin Panel]",
    currency: "ETB",
    general: "General",
    // Subcategories header overrides mapping fallback
    "all food": "All Food",
    "meat section": "Meat Section",
    "vegetarian / fasting": "Vegetarian / Fasting",
    "burgers & snacks": "Burgers & Snacks",
    "all drinks": "All Drinks",
    "hot drinks": "Hot Drinks",
    "soft drinks & juices": "Soft Drinks & Juices",
    "alcoholic beverages": "Alcoholic Beverages",
    "all dessert": "All Dessert",
    "cakes": "Cakes",
    "pastries": "Pastries"
  },
  am: {
    title: "ካፌና ፓስትሪ ማዕከል",
    tagline: "ትኩስ ምግብ • ይቅመሱ • ይደሰቱ",
    loading: "ሜኑ በመጫን ላይ ነው...",
    noItems: "በዚህ ክፍል ምንም አይነት ምግብ አልተገኘም።",
    freshNotice: "ሁሉም ምግቦች በታዘዙበት ቅጽበት በትኩስነታቸው የሚዘጋጁ ናቸው።",
    adminPortal: "[የአስተዳዳሪ መቆጣጠሪያ]",
    logoutAdmin: "[ከአስተዳዳሪ መቆጣጠሪያ ውጣ]",
    currency: "የኢትዮጵያ ብር",
    general: "ጠቅላላ",
    // Subcategories header overrides mapping fallback
    "all food": "ሁሉም ምግቦች",
    "meat section": "የስጋ ምግቦች",
    "vegetarian / fasting": "የጾም ምግቦች",
    "burgers & snacks": "በርገርና መክሰስ",
    "all drinks": "ሁሉም መጠጦች",
    "hot drinks": "ትኩስ መጠጦች",
    "soft drinks & juices": "ለስላሳ መጠጦችና ጁስ",
    "alcoholic beverages": "የአልኮል መጠጦች",
    "all dessert": "ሁሉም ጣፋጮች",
    "cakes": "ኬኮች",
    "pastries": "ፓስትሪዎች"
  }
};

function App() {
  const [menuItems, setMenuItems] = useState([]); 
  const [activeCategory, setActiveCategory] = useState('Food');
  const [activeSubcategory, setActiveSubcategory] = useState('All Food');
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  
  // Language State: 'en' for English, 'am' for Amharic
  const [lang, setLang] = useState('en');
  const t = translations[lang];

  // Admin Controller Nodes
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingItem, setEditingItem] = useState(null); 
  const [form, setForm] = useState({ name: '', price: '', category: 'Food', subcategory: 'Meat Section', desc: '', img: '' });

  const fetchMenu = () => {
    setLoading(true);
    fetch('https://qr-menu-backend-qkfd.onrender.com/api/menu')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch data');
        return res.json();
      })
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

  const handleMainCategoryChange = (e) => {
    const mainCat = e.target.value;
    const defaultSub = MENU_STRUCTURE[mainCat][1]; 
    setForm(prev => ({ ...prev, category: mainCat, subcategory: defaultSub }));
  };

  const handleNavCategoryChange = (cat) => {
    setActiveCategory(cat);
    setActiveSubcategory(MENU_STRUCTURE[cat][0]); 
  };

  const handleAdminLogin = () => {
    if (isAdmin) {
      setIsAdmin(false); 
    } else {
      const pin = prompt("Enter Admin Password Pin:");
      if (pin === "1234") setIsAdmin(true);
      else alert("Incorrect Pin Code!");
    }
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!form.name || !form.price) {
      alert("Please provide at least a Name and Price.");
      return;
    }
    
    const finalCategory = form.category || 'Food';
    let finalSubcategory = form.subcategory || MENU_STRUCTURE[finalCategory][1];

    const formData = new FormData();
    formData.append('name', form.name.trim());
    formData.append('price', form.price);
    formData.append('category', finalCategory);
    formData.append('subcategory', finalSubcategory); 
    formData.append('desc', form.desc ? form.desc.trim() : '');
    
    if (editingItem && !imageFile) formData.append('img', form.img);
    if (imageFile) formData.append('image', imageFile);

    const url = editingItem 
      ? `https://qr-menu-backend-qkfd.onrender.com/api/menu/${editingItem._id}` 
      : 'https://qr-menu-backend-qkfd.onrender.com/api/menu';
    const method = editingItem ? 'PUT' : 'POST';

    fetch(url, { method, body: formData })
    .then(res => {
      if (!res.ok) throw new Error("Database saving error operation failed.");
      return res.json();
    })
    .then(() => {
      alert(editingItem ? "Item Updated!" : "Item Added!");
      cancelEdit();
      fetchMenu(); 
    })
    .catch(err => alert(`❌ Error: ${err.message}`));
  };

  const startEdit = (item) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      price: item.price,
      category: item.category || 'Food',
      subcategory: item.subcategory || 'Meat Section',
      desc: item.desc || '',
      img: item.img || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setForm({ name: '', price: '', category: 'Food', subcategory: 'Meat Section', desc: '', img: '' });
    setImageFile(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this menu item?")) {
      fetch(`https://qr-menu-backend-qkfd.onrender.com/api/menu/${id}`, { method: 'DELETE' })
        .then(res => {
          if (!res.ok) throw new Error('Deletion rejected');
          fetchMenu();
          alert("Item Deleted!");
        })
        .catch(err => console.error(err));
    }
  };

  // Keyword filtering logic algorithm block remains unchanged
  const filteredMenu = menuItems.filter(item => {
    const itemCat = item.category ? item.category.trim().toLowerCase() : 'food';
    const activeCat = activeCategory.trim().toLowerCase();
    if (itemCat !== activeCat && !(activeCat === 'dessert' && itemCat.includes('dessert'))) return false;
    if (activeSubcategory.toLowerCase().startsWith('all')) return true; 

    const targetSub = activeSubcategory.trim().toLowerCase();
    const nameLower = item.name ? item.name.toLowerCase() : '';
    const descLower = item.desc ? item.desc.toLowerCase() : '';
    
    if (targetSub.includes('meat')) return (nameLower.includes('tibs') || nameLower.includes('tibis') || nameLower.includes('meat') || nameLower.includes('kitfo') || nameLower.includes('shekla') || nameLower.includes('gore'));
    if (targetSub.includes('fasting') || targetSub.includes('veg')) return (nameLower.includes('shiro') || nameLower.includes('beyaynetu') || nameLower.includes('fasting') || nameLower.includes('veg') || nameLower.includes('misir'));
    if (targetSub.includes('burger') || targetSub.includes('snack')) return (nameLower.includes('burger') || nameLower.includes('chips') || nameLower.includes('sandwich'));
    if (targetSub.includes('hot')) return (nameLower.includes('coffee') || nameLower.includes('tea') || nameLower.includes('macchiato') || nameLower.includes('bunna') || nameLower.includes('shai') || nameLower.includes('milk'));
    if (targetSub.includes('soft') || targetSub.includes('juice')) return (nameLower.includes('juice') || nameLower.includes('coke') || nameLower.includes('fanta') || nameLower.includes('water') || nameLower.includes('ambo'));
    if (targetSub.includes('alcohol')) return (nameLower.includes('beer') || nameLower.includes('wine') || nameLower.includes('draft'));
    if (targetSub.includes('cake')) return (nameLower.includes('cake') || descLower.includes('cake'));
    if (targetSub.includes('pastr')) return (nameLower.includes('pastry') || nameLower.includes('croissant') || nameLower.includes('sambusa'));
    
    return false;
  });

  return (
    <div className="mobile-layout" style={{ position: 'relative' }}>
      
      {/* Floating Language Toggle Switch Trigger */}
      <div style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 10 }}>
        <button 
          onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
          style={{
            backgroundColor: '#f39c12',
            color: '#000',
            border: 'none',
            padding: '6px 14px',
            borderRadius: '20px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '0.8rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            transition: 'transform 0.1s ease'
          }}
        >
          {lang === 'en' ? 'አማርኛ' : 'English'}
        </button>
      </div>

      <header className="menu-header" style={{ textAlign: 'center', padding: '20px 10px' }}>
        <div className="brand-badge"><h1 className="restaurant-name">{t.title}</h1></div>
        <p className="restaurant-tagline">{t.tagline}</p>
      </header>

      {isAdmin && (
        <AdminPanel 
          editingItem={editingItem} form={form} handleInputChange={handleInputChange}
          handleMainCategoryChange={handleMainCategoryChange} setImageFile={setImageFile}
          handleSubmit={handleSubmit} cancelEdit={cancelEdit}
        />
      )}

      {/* Passing lang variable down to sync structural elements dynamically */}
      <CategoryNav 
        activeCategory={activeCategory} activeSubcategory={activeSubcategory}
        onCategoryChange={handleNavCategoryChange} onSubcategoryChange={setActiveSubcategory}
        lang={lang}
      />

      <div className="menu-section-header">
        <h2>{(t[activeSubcategory.toLowerCase()] || activeSubcategory).toUpperCase()}</h2>
      </div>

      <main className="menu-list">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>{t.loading}</div>
        ) : filteredMenu.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', opacity: 0.7 }}>{t.noItems}</div>
        ) : (
          filteredMenu.map((item, index) => (
            <MenuCard 
              key={item._id} item={item} index={index} isAdmin={isAdmin}
              onEdit={startEdit} onDelete={handleDelete} onSelect={setSelectedItem}
            />
          ))
        )}
      </main>

      {selectedItem && (
        <div className="modal-backdrop" onClick={() => setSelectedItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedItem(null)}>×</button>
            <img src={selectedItem.img} alt={selectedItem.name} className="modal-image" />
            <div className="modal-body">
              <div className="modal-header-row">
                <h3>{selectedItem.name}</h3>
                <span className="modal-item-price">
                  {selectedItem.price ? selectedItem.price.toFixed(2) : '0.00'}{' '}
                  <small style={{fontSize:'0.6rem', fontWeight: 'bold'}}>{t.currency}</small>
                </span>
              </div>
              <span className="modal-category-tag">
                {t[selectedItem.category.toLowerCase()] || selectedItem.category} • {t[selectedItem.subcategory?.toLowerCase()] || selectedItem.subcategory || t.general}
              </span>
              <p className="modal-item-desc">{selectedItem.desc}</p>
            </div>
          </div>
        </div>
      )}

      <footer className="menu-footer">
        <p className="footer-line-1">{t.freshNotice}</p>
        <button onClick={handleAdminLogin} style={{ background: 'none', border: 'none', color: '#f39c12', opacity: 0.3, fontSize: '0.7rem', marginTop: '12px', cursor: 'pointer', textDecoration: 'underline' }}>
          {isAdmin ? t.logoutAdmin : t.adminPortal}
        </button>
      </footer>
    </div>
  );
}

export default App;