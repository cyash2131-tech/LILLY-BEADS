import React, { useState, useMemo } from 'react';
import { useApp } from '../AppContext';
import { StorageManager } from '../db';
import { Product, Category, Order, CustomRequest, AppSettings } from '../types';
import { 
  BarChart, 
  ShoppingBag, 
  FolderHeart, 
  Sparkles, 
  Settings, 
  Plus, 
  Edit3, 
  Trash2, 
  DollarSign, 
  TrendingUp, 
  Boxes, 
  Check, 
  X,
  Eye,
  RefreshCw
} from 'lucide-react';

export default function AdminView() {
  const { 
    products, 
    categories, 
    orders, 
    customRequests, 
    settings, 
    updateSettings, 
    setProducts,
    setCategories,
    setOrders,
    setCustomRequests
  } = useApp();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'categories' | 'orders' | 'custom' | 'settings'>('dashboard');

  // MODALS STATE
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // PRODUCT FORM STATE
  const [pName, setPName] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pPrice, setPPrice] = useState(0);
  const [pSalePrice, setPSalePrice] = useState<string>('');
  const [pStock, setPStock] = useState(0);
  const [pCategory, setPCategory] = useState('');
  const [pImages, setPImages] = useState<string[]>(['']);
  const [pFeatured, setPFeatured] = useState(false);

  // CATEGORY FORM STATE
  const [catName, setCatName] = useState('');
  const [catImage, setCatImage] = useState('');

  // SETTINGS FORM STATE
  const [setStoreName, setSetStoreName] = useState(settings.storeName);
  const [setLogo, setSetLogo] = useState(settings.logo);
  const [setInstagram, setSetInstagram] = useState(settings.socialInstagram);
  const [setWhatsApp, setSetWhatsApp] = useState(settings.whatsAppNumber);
  const [setShipping, setSetShipping] = useState(settings.shippingCharges);
  const [setTax, setSetTax] = useState(settings.taxPercent);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // METRICS COMPUTATION
  const stats = useMemo(() => {
    const totalSales = orders.reduce((sum, o) => o.paymentStatus === 'Paid' ? sum + o.totalAmount : sum, 0);
    const totalOrdersCount = orders.length;
    const pendingCustoms = customRequests.length;
    const totalProductsCount = products.length;
    return { totalSales, totalOrdersCount, pendingCustoms, totalProductsCount };
  }, [orders, customRequests, products]);

  // HANDLE SETTINGS SAVE
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings({
      storeName: setStoreName,
      logo: setLogo,
      socialInstagram: setInstagram,
      whatsAppNumber: setWhatsApp,
      shippingCharges: Number(setShipping),
      taxPercent: Number(setTax),
      bannerImages: settings.bannerImages
    });
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 2000);
  };

  // OPEN PRODUCT MODAL (ADD / EDIT)
  const openProductModal = (prod: Product | null = null) => {
    if (prod) {
      setEditingProduct(prod);
      setPName(prod.name);
      setPDesc(prod.description);
      setPPrice(prod.price);
      setPSalePrice(prod.salePrice !== undefined ? String(prod.salePrice) : '');
      setPStock(prod.stock);
      setPCategory(prod.category);
      setPImages(prod.images.length > 0 ? [...prod.images] : ['']);
      setPFeatured(prod.featured);
    } else {
      setEditingProduct(null);
      setPName('');
      setPDesc('');
      setPPrice(15);
      setPSalePrice('');
      setPStock(10);
      setPCategory(categories[0]?.id || 'bracelets');
      setPImages(['https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=400&auto=format&fit=crop']);
      setPFeatured(false);
    }
    setProductModalOpen(true);
  };

  // SAVE PRODUCT
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalSalePrice = pSalePrice.trim() !== '' ? Number(pSalePrice) : undefined;
    
    const productPayload: Product = {
      id: editingProduct ? editingProduct.id : 'prod-' + Date.now(),
      name: pName,
      description: pDesc,
      price: Number(pPrice),
      salePrice: finalSalePrice,
      stock: Number(pStock),
      category: pCategory,
      images: pImages.filter(img => img.trim() !== ''),
      rating: editingProduct ? editingProduct.rating : 5,
      reviewsCount: editingProduct ? editingProduct.reviewsCount : 0,
      featured: pFeatured,
      available: pStock > 0
    };

    await StorageManager.saveProduct(productPayload);
    
    // Refresh parent state
    const updatedProds = await StorageManager.getProducts();
    setProducts(updatedProds);
    setProductModalOpen(false);
  };

  // DELETE PRODUCT
  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await StorageManager.deleteProduct(id);
      const updated = await StorageManager.getProducts();
      setProducts(updated);
    }
  };

  // UPDATE ORDER STATUS
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    const matched = orders.find(o => o.id === orderId);
    if (matched) {
      const updatedOrder = { ...matched, orderStatus: status };
      await StorageManager.saveOrder(updatedOrder);
      const updated = await StorageManager.getOrders();
      setOrders(updated);
    }
  };

  // UPDATE CUSTOM REQUEST STATUS
  const handleUpdateCustomStatus = async (reqId: string, status: string) => {
    const matched = customRequests.find(r => r.id === reqId);
    if (matched) {
      const updatedReq = { ...matched, status };
      await StorageManager.saveCustomRequest(updatedReq);
      const updated = await StorageManager.getCustomRequests();
      setCustomRequests(updated);
    }
  };

  // OPEN CATEGORY MODAL
  const openCategoryModal = (cat: Category | null = null) => {
    if (cat) {
      setEditingCategory(cat);
      setCatName(cat.name);
      setCatImage(cat.image);
    } else {
      setEditingCategory(null);
      setCatName('');
      setCatImage('https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=300&auto=format&fit=crop');
    }
    setCategoryModalOpen(true);
  };

  // SAVE CATEGORY
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Category = {
      id: editingCategory ? editingCategory.id : catName.toLowerCase().replace(/\s+/g, '-'),
      name: catName,
      image: catImage
    };
    await StorageManager.saveCategory(payload);
    const updated = await StorageManager.getCategories();
    setCategories(updated);
    setCategoryModalOpen(false);
  };

  // DELETE CATEGORY
  const handleDeleteCategory = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      await StorageManager.deleteCategory(id);
      const updated = await StorageManager.getCategories();
      setCategories(updated);
    }
  };

  return (
    <div id="admin-view" className="max-w-7xl mx-auto px-6 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Sidebar navigation */}
      <div className="lg:col-span-3 flex flex-col gap-2 bg-white rounded-3xl border border-brand-border/40 p-5 shadow-sm h-max">
        <div className="flex items-center gap-2 px-3 pb-4 mb-3 border-b border-brand-border/20">
          <span className="text-xl">🛠️</span>
          <h2 className="font-heading text-lg font-bold text-gray-800">Admin Control</h2>
        </div>

        <button
          onClick={() => setActiveTab('dashboard')}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold text-left transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'dashboard' ? 'bg-secondary text-accent' : 'text-gray-500 hover:bg-secondary/20'
          }`}
        >
          <BarChart size={14} /> Dashboard Overview
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold text-left transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'products' ? 'bg-secondary text-accent' : 'text-gray-500 hover:bg-secondary/20'
          }`}
        >
          <ShoppingBag size={14} /> Product Catalog ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold text-left transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'categories' ? 'bg-secondary text-accent' : 'text-gray-500 hover:bg-secondary/20'
          }`}
        >
          <FolderHeart size={14} /> Categories Catalog
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold text-left transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'orders' ? 'bg-secondary text-accent' : 'text-gray-500 hover:bg-secondary/20'
          }`}
        >
          <Boxes size={14} /> Customer Orders ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('custom')}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold text-left transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'custom' ? 'bg-secondary text-accent' : 'text-gray-500 hover:bg-secondary/20'
          }`}
        >
          <Sparkles size={14} /> Custom Orders ({customRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold text-left transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'settings' ? 'bg-secondary text-accent' : 'text-gray-500 hover:bg-secondary/20'
          }`}
        >
          <Settings size={14} /> General Settings
        </button>
      </div>

      {/* Main content viewport */}
      <div className="lg:col-span-9 flex flex-col gap-6">
        
        {/* TAB: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div id="admin-tab-dashboard" className="flex flex-col gap-8">
            <h1 className="text-2xl font-bold font-heading text-gray-800">Overview</h1>
            
            {/* Bento Grid Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              
              <div className="bg-white p-5 rounded-3xl border border-brand-border/40 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-gray-400">Total Sales</span>
                <span className="text-2xl font-bold font-heading text-gray-800 block mt-1">${stats.totalSales.toFixed(2)}</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-brand-border/40 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-gray-400">Completed Orders</span>
                <span className="text-2xl font-bold font-heading text-gray-800 block mt-1">{stats.totalOrdersCount}</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-brand-border/40 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-gray-400">Custom Requests</span>
                <span className="text-2xl font-bold font-heading text-gray-800 block mt-1">{stats.pendingCustoms}</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-brand-border/40 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-gray-400">Jewelry Models</span>
                <span className="text-2xl font-bold font-heading text-gray-800 block mt-1">{stats.totalProductsCount}</span>
              </div>

            </div>

            {/* Quick action checklist */}
            <div className="bg-secondary/15 rounded-3xl border border-brand-border/30 p-6">
              <h3 className="font-heading text-base font-bold text-gray-800 mb-3">Live Developer Testing Channels</h3>
              <p className="text-xs text-gray-600 leading-relaxed max-w-xl">
                Use this dashboard to manage products, categories, orders, settings, and view customer custom requests. Any edits you make here immediately sync to our local state engine (and cloud if active).
              </p>
            </div>
          </div>
        )}

        {/* TAB: PRODUCTS */}
        {activeTab === 'products' && (
          <div id="admin-tab-products" className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold font-heading text-gray-800">Products</h1>
              <button
                onClick={() => openProductModal(null)}
                className="py-2 px-4 rounded-full bg-accent hover:bg-accent/90 text-white font-heading font-semibold text-xs transition-all shadow-sm flex items-center gap-1 cursor-pointer"
              >
                <Plus size={14} /> Add New Jewelry
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white border border-brand-border/40 rounded-3xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-secondary/20 text-gray-700 font-bold border-b border-brand-border/20">
                    <th className="p-4">Image</th>
                    <th className="p-4">Product Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((prod) => (
                    <tr key={prod.id} className="border-b border-brand-border/10 hover:bg-bg-brand/40 text-gray-600">
                      <td className="p-4 shrink-0">
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-lg object-cover bg-bg-brand border"
                        />
                      </td>
                      <td className="p-4 font-semibold text-gray-800">{prod.name}</td>
                      <td className="p-4 uppercase text-[10px] tracking-wide font-medium">{prod.category}</td>
                      <td className="p-4 font-mono font-bold text-accent">
                        {prod.salePrice !== undefined ? (
                          <div className="flex flex-col">
                            <span>${prod.salePrice}</span>
                            <span className="text-[10px] text-gray-400 line-through">${prod.price}</span>
                          </div>
                        ) : (
                          `$${prod.price}`
                        )}
                      </td>
                      <td className="p-4 font-bold">{prod.stock} pcs</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          prod.stock > 0 ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-500 border border-red-200'
                        }`}>
                          {prod.stock > 0 ? 'Active' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openProductModal(prod)}
                            className="p-1.5 rounded-lg border border-brand-border/60 text-gray-500 hover:bg-secondary/25 hover:text-accent cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit3 size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-1.5 rounded-lg border border-brand-border/60 text-gray-500 hover:bg-rose-50 hover:text-rose-500 cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: CATEGORIES */}
        {activeTab === 'categories' && (
          <div id="admin-tab-categories" className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold font-heading text-gray-800">Categories</h1>
              <button
                onClick={() => openCategoryModal(null)}
                className="py-2 px-4 rounded-full bg-accent hover:bg-accent/90 text-white font-heading font-semibold text-xs transition-all shadow-sm flex items-center gap-1 cursor-pointer"
              >
                <Plus size={14} /> Add New Category
              </button>
            </div>

            {/* Categories Table */}
            <div className="bg-white border border-brand-border/40 rounded-3xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-secondary/20 text-gray-700 font-bold border-b border-brand-border/20">
                    <th className="p-4">Category Image</th>
                    <th className="p-4">Category ID</th>
                    <th className="p-4">Category Name</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.id} className="border-b border-brand-border/10 text-gray-600">
                      <td className="p-4">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-xl object-cover bg-bg-brand border"
                        />
                      </td>
                      <td className="p-4 font-mono font-bold text-gray-800">{cat.id}</td>
                      <td className="p-4 font-bold text-accent">{cat.name}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openCategoryModal(cat)}
                            className="p-1.5 rounded-lg border border-brand-border/60 text-gray-500 hover:bg-secondary/25 hover:text-accent cursor-pointer"
                          >
                            <Edit3 size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-1.5 rounded-lg border border-brand-border/60 text-gray-500 hover:bg-rose-50 hover:text-rose-500 cursor-pointer"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: CUSTOMERS ORDERS */}
        {activeTab === 'orders' && (
          <div id="admin-tab-orders" className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold font-heading text-gray-800">Customer Orders</h1>

            <div className="bg-white border border-brand-border/40 rounded-3xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-secondary/20 text-gray-700 font-bold border-b border-brand-border/20">
                    <th className="p-4">Order Details</th>
                    <th className="p-4">Customer Contact</th>
                    <th className="p-4">Shipping Address</th>
                    <th className="p-4">Items / Counts</th>
                    <th className="p-4">Total Amount</th>
                    <th className="p-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((ord) => (
                    <tr key={ord.id} className="border-b border-brand-border/10 text-gray-600">
                      <td className="p-4">
                        <span className="font-bold text-gray-800 block">ID: {ord.id}</span>
                        <span className="text-[10px] text-gray-400 block">Date: {ord.orderDate}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold block text-gray-800">{ord.customerName}</span>
                        <span className="text-[10px] block">{ord.email}</span>
                        {ord.phone && <span className="text-[10px] block text-gray-400">{ord.phone}</span>}
                      </td>
                      <td className="p-4 max-w-xs">{ord.shippingAddress}</td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          {ord.items.map((it, idx) => (
                            <span key={idx} className="text-[10px] font-medium">
                              - {it.name} (Qty: {it.quantity})
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 font-mono font-bold text-accent">${ord.totalAmount.toFixed(2)}</td>
                      <td className="p-4 text-center">
                        <select
                          value={ord.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                          className="py-1 px-2 text-[10px] font-bold rounded-lg bg-bg-brand border border-brand-border focus:outline-none"
                        >
                          <option value="Pending">Pending 🌸</option>
                          <option value="Processing">Processing 🛠️</option>
                          <option value="Shipped">Shipped ✈️</option>
                          <option value="Delivered">Delivered ✅</option>
                          <option value="Cancelled">Cancelled ❌</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: CUSTOM ORDERS REQUESTS */}
        {activeTab === 'custom' && (
          <div id="admin-tab-custom" className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold font-heading text-gray-800">Custom Jewelry Design Inquiries</h1>

            <div className="bg-white border border-brand-border/40 rounded-3xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-secondary/20 text-gray-700 font-bold border-b border-brand-border/20">
                    <th className="p-4">Ref Image</th>
                    <th className="p-4">Co-Designer Contact</th>
                    <th className="p-4">Beads Material & Colors</th>
                    <th className="p-4">Specification Details</th>
                    <th className="p-4">Budget / Target</th>
                    <th className="p-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {customRequests.map((req) => (
                    <tr key={req.id} className="border-b border-brand-border/10 text-gray-600">
                      <td className="p-4">
                        <img
                          src={req.referenceImage}
                          alt="Reference preview"
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-xl object-cover bg-bg-brand border"
                        />
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-gray-800 block">{req.name}</span>
                        <span className="text-[10px] block">{req.email}</span>
                        {req.phone && <span className="text-[10px] block text-gray-400">{req.phone}</span>}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1.5">
                          <div>
                            <span className="text-[9px] font-bold text-gray-400 uppercase">Colors:</span>
                            <div className="flex flex-wrap gap-1 mt-0.5">
                              {req.preferredColors.map((c, i) => (
                                <span key={i} className="px-1.5 py-0.5 rounded-full bg-secondary/30 text-[9px] font-semibold text-accent">
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-gray-400 uppercase">Beads:</span>
                            <div className="flex flex-wrap gap-1 mt-0.5">
                              {req.preferredBeads.map((b, i) => (
                                <span key={i} className="px-1.5 py-0.5 rounded-full bg-secondary/30 text-[9px] font-semibold text-accent">
                                  {b.split(' ')[0]}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 max-w-xs text-[11px] leading-relaxed italic">{req.description}</td>
                      <td className="p-4 font-mono font-bold text-accent">
                        <div>Max: ${req.budget}</div>
                        {req.deliveryDate && <div className="text-[9px] font-normal text-gray-400">By: {req.deliveryDate}</div>}
                      </td>
                      <td className="p-4 text-center">
                        <select
                          value={req.status}
                          onChange={(e) => handleUpdateCustomStatus(req.id, e.target.value)}
                          className="py-1 px-2 text-[10px] font-bold rounded-lg bg-bg-brand border border-brand-border focus:outline-none"
                        >
                          <option value="Received">Received 🌸</option>
                          <option value="Reviewed">Reviewed 💡</option>
                          <option value="Under Fabrication">Fabricating 🪡</option>
                          <option value="Dispatched">Dispatched 📦</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: SETTINGS */}
        {activeTab === 'settings' && (
          <div id="admin-tab-settings" className="bg-white p-6 rounded-3xl border border-brand-border/40 shadow-sm">
            <h1 className="text-xl font-bold font-heading text-gray-800 mb-6 pb-2 border-b border-brand-border/10">General Settings</h1>

            <form onSubmit={handleSaveSettings} className="flex flex-col gap-5 max-w-lg">
              
              {/* Store Name */}
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">E-commerce Brand Name</label>
                <input
                  type="text"
                  required
                  value={setStoreName}
                  onChange={(e) => setSetStoreName(e.target.value)}
                  className="w-full h-11 px-4 text-xs rounded-xl bg-bg-brand border border-brand-border focus:outline-none focus:ring-1 focus:ring-accent text-gray-700"
                />
              </div>

              {/* Logo URL */}
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Logo Icon Image URL</label>
                <input
                  type="url"
                  required
                  value={setLogo}
                  onChange={(e) => setSetLogo(e.target.value)}
                  className="w-full h-11 px-4 text-xs rounded-xl bg-bg-brand border border-brand-border focus:outline-none focus:ring-1 focus:ring-accent text-gray-700"
                />
              </div>

              {/* Instagram URL */}
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Instagram Brand Link</label>
                <input
                  type="url"
                  required
                  value={setInstagram}
                  onChange={(e) => setSetInstagram(e.target.value)}
                  className="w-full h-11 px-4 text-xs rounded-xl bg-bg-brand border border-brand-border focus:outline-none focus:ring-1 focus:ring-accent text-gray-700"
                />
              </div>

              {/* WhatsApp Number */}
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Direct WhatsApp Line</label>
                <input
                  type="text"
                  required
                  value={setWhatsApp}
                  onChange={(e) => setSetWhatsApp(e.target.value)}
                  className="w-full h-11 px-4 text-xs rounded-xl bg-bg-brand border border-brand-border focus:outline-none focus:ring-1 focus:ring-accent text-gray-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Shipping Charges */}
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Flat Shipping Charges ($)</label>
                  <input
                    type="number"
                    required
                    value={setShipping}
                    onChange={(e) => setSetShipping(Number(e.target.value))}
                    className="w-full h-11 px-4 text-xs rounded-xl bg-bg-brand border border-brand-border focus:outline-none focus:ring-1 focus:ring-accent text-gray-700"
                  />
                </div>

                {/* Tax Percent */}
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Sales Tax Percent (%)</label>
                  <input
                    type="number"
                    required
                    value={setTax}
                    onChange={(e) => setSetTax(Number(e.target.value))}
                    className="w-full h-11 px-4 text-xs rounded-xl bg-bg-brand border border-brand-border focus:outline-none focus:ring-1 focus:ring-accent text-gray-700"
                  />
                </div>
              </div>

              {settingsSuccess && (
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 animate-scale">
                  <Check size={10} /> Store settings updated successfully!
                </span>
              )}

              <button
                id="admin-settings-submit-btn"
                type="submit"
                className="w-full h-11 rounded-xl bg-accent hover:bg-accent/90 text-white font-heading font-semibold text-xs transition-all shadow-sm cursor-pointer mt-2"
              >
                Save Settings Configuration
              </button>

            </form>
          </div>
        )}

      </div>

      {/* MODAL: ADD / EDIT PRODUCT */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40">
          <div className="bg-white rounded-[2rem] border border-brand-border max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center pb-3 border-b border-brand-border/20">
              <h3 className="font-heading text-lg font-bold text-gray-800">
                {editingProduct ? 'Edit Bead Model' : 'Add Cute Bead Model'}
              </h3>
              <button onClick={() => setProductModalOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="flex flex-col gap-4 text-xs text-gray-600">
              
              {/* Name */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">Bead Model Name</label>
                <input
                  type="text"
                  required
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-bg-brand border border-brand-border focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">Detailed Description</label>
                <textarea
                  required
                  rows={3}
                  value={pDesc}
                  onChange={(e) => setPDesc(e.target.value)}
                  className="w-full p-4 rounded-xl bg-bg-brand border border-brand-border focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Price */}
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Standard Price ($)</label>
                  <input
                    type="number"
                    required
                    value={pPrice}
                    onChange={(e) => setPPrice(Number(e.target.value))}
                    className="w-full h-11 px-4 rounded-xl bg-bg-brand border border-brand-border focus:outline-none"
                  />
                </div>

                {/* Sale Price */}
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Sale Price (Optional)</label>
                  <input
                    type="number"
                    placeholder="None"
                    value={pSalePrice}
                    onChange={(e) => setPSalePrice(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-bg-brand border border-brand-border focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Stock */}
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Stock Pieces</label>
                  <input
                    type="number"
                    required
                    value={pStock}
                    onChange={(e) => setPStock(Number(e.target.value))}
                    className="w-full h-11 px-4 rounded-xl bg-bg-brand border border-brand-border focus:outline-none"
                  />
                </div>

                {/* Category selection */}
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Category</label>
                  <select
                    value={pCategory}
                    onChange={(e) => setPCategory(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-bg-brand border border-brand-border focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">Product Main Image URL</label>
                <input
                  type="url"
                  required
                  value={pImages[0]}
                  onChange={(e) => {
                    const next = [...pImages];
                    next[0] = e.target.value;
                    setPImages(next);
                  }}
                  className="w-full h-11 px-4 rounded-xl bg-bg-brand border border-brand-border focus:outline-none"
                />
              </div>

              {/* Featured toggle */}
              <div className="flex items-center gap-2">
                <input
                  id="admin-prod-featured"
                  type="checkbox"
                  checked={pFeatured}
                  onChange={(e) => setPFeatured(e.target.checked)}
                  className="w-4 h-4 accent-accent cursor-pointer"
                />
                <label htmlFor="admin-prod-featured" className="font-semibold text-gray-700 cursor-pointer">
                  Feature this on the Home page best-sellers/carousel
                </label>
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-accent hover:bg-accent/90 text-white font-heading font-semibold text-xs mt-2 transition-all cursor-pointer"
              >
                Save Bead Model
              </button>

            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT CATEGORY */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40">
          <div className="bg-white rounded-[2rem] border border-brand-border max-w-md w-full shadow-2xl p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center pb-3 border-b border-brand-border/20">
              <h3 className="font-heading text-lg font-bold text-gray-800">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h3>
              <button onClick={() => setCategoryModalOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="flex flex-col gap-4 text-xs text-gray-600">
              
              <div>
                <label className="font-bold text-gray-700 block mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Phone Straps"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-bg-brand border border-brand-border focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Category Illustration Image URL</label>
                <input
                  type="url"
                  required
                  value={catImage}
                  onChange={(e) => setCatImage(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-bg-brand border border-brand-border focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-accent hover:bg-accent/90 text-white font-heading font-semibold text-xs mt-2 transition-all cursor-pointer"
              >
                Save Category
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
