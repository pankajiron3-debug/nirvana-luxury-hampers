import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Truck, Sparkles, CreditCard, QrCode, Building2, MapPin, Phone, User, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const FREE_SHIPPING_THRESHOLD = 2999;
const STANDARD_SHIPPING_FEE = 199;

const INDIAN_STATES = [
  'Maharashtra',
  'Delhi (NCT)',
  'Karnataka',
  'Tamil Nadu',
  'Gujarat',
  'West Bengal',
  'Uttar Pradesh',
  'Bihar',
  'Rajasthan',
  'Telangana',
  'Punjab',
  'Haryana',
  'Madhya Pradesh',
  'Kerala',
  'Goa',
  'Odisha',
  'Assam',
  'Andhra Pradesh',
  'Uttarakhand',
  'Jammu & Kashmir',
];

const CheckoutModal = ({ isOpen, onClose, items, onClearCart }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: 'Maharashtra',
    pinCode: '',
    giftNote: '',
    paymentMethod: 'upi',
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = subtotal === 0 ? 0 : isFreeShipping ? 0 : STANDARD_SHIPPING_FEE;
  const total = subtotal + shippingFee;

  const validate = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^(?:\+91|91|0)?[6-9]\d{9}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit Indian phone number';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.address.trim()) errors.address = 'Delivery address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.pinCode.trim()) {
      errors.pinCode = 'PIN Code is required';
    } else if (!/^[1-9][0-9]{5}$/.test(formData.pinCode.trim())) {
      errors.pinCode = 'Please enter a valid 6-digit Indian PIN Code (e.g. 110001)';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please complete all delivery details correctly.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const orderId = `NLH-IN-${Math.floor(100000 + Math.random() * 900000)}`;
      setConfirmedOrder({
        orderId,
        items: [...items],
        subtotal,
        shippingFee,
        total,
        shippingDetails: { ...formData },
        date: new Date().toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      });
      setIsSubmitting(false);
      setIsOrderPlaced(true);
      onClearCart();
      toast.success(`Luxury order ${orderId} reserved successfully!`, {
        icon: '👑',
        duration: 5000,
      });
    }, 900);
  };

  const handleModalClose = () => {
    setIsOrderPlaced(false);
    setConfirmedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-3xl bg-gradient-to-b from-slate-900 via-slate-925 to-slate-950 border border-slate-800 shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gold-500/10 text-gold-400 border border-gold-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-white tracking-wide">
                {isOrderPlaced ? 'Bespoke Order Confirmed' : 'Pan-India Bespoke Delivery & Checkout'}
              </h2>
              <p className="text-xs text-slate-400">
                {isOrderPlaced
                  ? 'Your luxury curated hampers are being prepared for dispatch'
                  : 'White-glove priority courier with temperature-controlled transit across India'}
              </p>
            </div>
          </div>
          <button
            onClick={handleModalClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        {isOrderPlaced && confirmedOrder ? (
          /* Order Confirmation View */
          <div className="p-6 sm:p-10 space-y-8 animate-in zoom-in-95 duration-300">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-white">
                Thank You, {confirmedOrder.shippingDetails.fullName}!
              </h3>
              <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                Your luxury hamper order has been placed successfully. A dedicated gifting concierge has been assigned to oversee white-glove packaging.
              </p>
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 font-mono text-xs font-semibold">
                <span>Order Reference: {confirmedOrder.orderId}</span>
              </div>
            </div>

            {/* Delivery & Financial Summary Receipt */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/80 rounded-2xl border border-slate-800 p-6 text-xs">
              <div className="space-y-3">
                <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gold-400" />
                  <span>Dispatch Address (India)</span>
                </h4>
                <div className="space-y-1 text-slate-300 leading-relaxed font-sans">
                  <p className="font-semibold text-white">{confirmedOrder.shippingDetails.fullName}</p>
                  <p>{confirmedOrder.shippingDetails.address}</p>
                  <p>
                    {confirmedOrder.shippingDetails.city}, {confirmedOrder.shippingDetails.state} -{' '}
                    <strong className="text-gold-300 font-mono">PIN Code: {confirmedOrder.shippingDetails.pinCode}</strong>
                  </p>
                  <p className="text-slate-400 font-mono">Phone: {confirmedOrder.shippingDetails.phone}</p>
                  <p className="text-slate-400 font-mono">Email: {confirmedOrder.shippingDetails.email}</p>
                </div>
              </div>

              <div className="space-y-3 border-t md:border-t-0 md:border-l border-slate-800 md:pl-6 pt-4 md:pt-0">
                <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-gold-400" />
                  <span>Order Summary</span>
                </h4>
                <div className="space-y-1.5 text-slate-300 font-mono">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{confirmedOrder.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pan-India Shipping:</span>
                    <span className={confirmedOrder.shippingFee === 0 ? 'text-emerald-400' : ''}>
                      {confirmedOrder.shippingFee === 0 ? 'FREE' : `₹${confirmedOrder.shippingFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes:</span>
                    <span>All GST Included</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-sm text-gold-300">
                    <span>Total Paid (INR):</span>
                    <span>₹{confirmedOrder.total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <button
                onClick={handleModalClose}
                className="px-8 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-gold-500/20 active:scale-95"
              >
                Return to Storefront
              </button>
            </div>
          </div>
        ) : (
          /* Checkout & Shipping Form View */
          <form onSubmit={handlePlaceOrder} className="p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Indian Shipping Details Form */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-gold-400 pb-2 border-b border-slate-800">
                  <MapPin className="w-4 h-4" />
                  <span>1. Indian Shipping Destination</span>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Recipient Full Name <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. Arjun Singhania"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 ${
                        formErrors.fullName ? 'border-rose-500' : 'border-slate-800'
                      }`}
                    />
                  </div>
                  {formErrors.fullName && (
                    <p className="text-rose-400 text-xs mt-1">{formErrors.fullName}</p>
                  )}
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Phone Number <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 ${
                          formErrors.phone ? 'border-rose-500' : 'border-slate-800'
                        }`}
                      />
                    </div>
                    {formErrors.phone && (
                      <p className="text-rose-400 text-xs mt-1">{formErrors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Email Address <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        placeholder="arjun@luxury.in"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 ${
                          formErrors.email ? 'border-rose-500' : 'border-slate-800'
                        }`}
                      />
                    </div>
                    {formErrors.email && (
                      <p className="text-rose-400 text-xs mt-1">{formErrors.email}</p>
                    )}
                  </div>
                </div>

                {/* Street Address */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Delivery Address (Flat / House / Street) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bungalow 7, Malabar Hill, B.G. Kher Marg"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 ${
                      formErrors.address ? 'border-rose-500' : 'border-slate-800'
                    }`}
                  />
                  {formErrors.address && (
                    <p className="text-rose-400 text-xs mt-1">{formErrors.address}</p>
                  )}
                </div>

                {/* City, State, PIN Code */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* City */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      City <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. New Delhi, Mumbai, Patna"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 ${
                        formErrors.city ? 'border-rose-500' : 'border-slate-800'
                      }`}
                    />
                    {formErrors.city && (
                      <p className="text-rose-400 text-xs mt-1">{formErrors.city}</p>
                    )}
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      State <span className="text-rose-400">*</span>
                    </label>
                    <select
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st} className="bg-slate-900 text-white">
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* PIN Code */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      PIN Code <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength="6"
                      placeholder="e.g. 110001"
                      value={formData.pinCode}
                      onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 ${
                        formErrors.pinCode ? 'border-rose-500' : 'border-slate-800'
                      }`}
                    />
                    {formErrors.pinCode && (
                      <p className="text-rose-400 text-xs mt-1">{formErrors.pinCode}</p>
                    )}
                  </div>
                </div>

                {/* Personalized Greeting Card Note */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Personalized Greeting Note (Complimentary Gold-Foil Calligraphy)
                  </label>
                  <textarea
                    rows="2"
                    placeholder="Wishing you elegance, prosperity, and joyous celebrations..."
                    value={formData.giftNote}
                    onChange={(e) => setFormData({ ...formData, giftNote: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 resize-none"
                  ></textarea>
                </div>

                {/* Payment Options (Indian Gateways) */}
                <div className="pt-2">
                  <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-gold-400 pb-2 border-b border-slate-800 mb-3">
                    <CreditCard className="w-4 h-4" />
                    <span>2. Indian Payment Preference</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label
                      className={`p-3 rounded-xl border flex items-center space-x-2.5 cursor-pointer transition-all ${
                        formData.paymentMethod === 'upi'
                          ? 'bg-gold-500/10 border-gold-500/60 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="upi"
                        checked={formData.paymentMethod === 'upi'}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="text-gold-500 focus:ring-gold-500"
                      />
                      <QrCode className="w-4 h-4 text-gold-400 shrink-0" />
                      <div className="text-xs">
                        <span className="font-semibold block text-slate-200">UPI / QR</span>
                        <span className="text-[10px] text-slate-500">GPay, PhonePe, Paytm</span>
                      </div>
                    </label>

                    <label
                      className={`p-3 rounded-xl border flex items-center space-x-2.5 cursor-pointer transition-all ${
                        formData.paymentMethod === 'netbanking'
                          ? 'bg-gold-500/10 border-gold-500/60 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="netbanking"
                        checked={formData.paymentMethod === 'netbanking'}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="text-gold-500 focus:ring-gold-500"
                      />
                      <Building2 className="w-4 h-4 text-gold-400 shrink-0" />
                      <div className="text-xs">
                        <span className="font-semibold block text-slate-200">Net Banking</span>
                        <span className="text-[10px] text-slate-500">HDFC, ICICI, SBI</span>
                      </div>
                    </label>

                    <label
                      className={`p-3 rounded-xl border flex items-center space-x-2.5 cursor-pointer transition-all ${
                        formData.paymentMethod === 'concierge'
                          ? 'bg-gold-500/10 border-gold-500/60 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="concierge"
                        checked={formData.paymentMethod === 'concierge'}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="text-gold-500 focus:ring-gold-500"
                      />
                      <Sparkles className="w-4 h-4 text-gold-400 shrink-0" />
                      <div className="text-xs">
                        <span className="font-semibold block text-slate-200">Concierge POD</span>
                        <span className="text-[10px] text-slate-500">Pay upon Delivery</span>
                      </div>
                    </label>
                  </div>
                </div>

              </div>

              {/* Right Column: Order Summary & Placement */}
              <div className="lg:col-span-5 bg-slate-950/70 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-800">
                    Order Summary ({items.length} {items.length === 1 ? 'Hamper' : 'Hampers'})
                  </h3>

                  {/* Selected Items List */}
                  <div className="max-h-56 overflow-y-auto divide-y divide-slate-800/80 my-3 pr-1">
                    {items.map(({ product, quantity }) => (
                      <div key={product._id} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-3 truncate">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-800 shrink-0"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=150&q=80';
                            }}
                          />
                          <div className="truncate">
                            <span className="text-slate-200 font-medium block truncate">
                              {product.name}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              Qty: {quantity} · ₹{Number(product.price).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                        <span className="font-mono font-semibold text-white ml-2 shrink-0">
                          ₹{(product.price * quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing Breakdown in INR */}
                  <div className="space-y-2 pt-3 border-t border-slate-800 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Subtotal</span>
                      <span className="text-slate-200 font-mono font-semibold">
                        ₹{subtotal.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-400 items-center">
                      <span>Pan-India Luxury Shipping</span>
                      <span className={isFreeShipping ? 'text-emerald-400 font-semibold' : 'text-slate-200 font-mono'}>
                        {isFreeShipping ? 'FREE' : `₹${STANDARD_SHIPPING_FEE}`}
                      </span>
                    </div>

                    <div className="p-2 rounded-lg bg-gold-500/5 border border-gold-500/20 text-[11px] text-slate-300">
                      {isFreeShipping ? (
                        <p className="text-emerald-400">
                          ✨ <strong>Complimentary Shipping Applied:</strong> Order value is ₹{subtotal.toLocaleString('en-IN')} (Free above ₹{FREE_SHIPPING_THRESHOLD.toLocaleString('en-IN')})
                        </p>
                      ) : (
                        <p className="text-slate-400">
                          Standard Shipping: <strong>₹{STANDARD_SHIPPING_FEE}</strong> · Free on orders above <strong>₹{FREE_SHIPPING_THRESHOLD.toLocaleString('en-IN')}</strong>
                        </p>
                      )}
                    </div>

                    <div className="flex justify-between text-slate-400">
                      <span>Taxes & Duties</span>
                      <span className="text-slate-400">Included (All Indian GST)</span>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                      <span className="text-sm font-serif font-bold text-white uppercase tracking-wider">
                        Total Amount (₹ INR)
                      </span>
                      <span className="text-2xl font-serif font-bold text-gold-300">
                        ₹{total.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submit Order Button */}
                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <button
                    type="submit"
                    disabled={isSubmitting || items.length === 0}
                    className="w-full py-4 rounded-xl bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold text-sm tracking-wider uppercase transition-all shadow-xl shadow-gold-500/20 active:scale-98 disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <span className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                        <span>Place Luxury Order · ₹{total.toLocaleString('en-IN')}</span>
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-center text-slate-500">
                    Protected by 256-bit bank-grade encryption · Pan-India White Glove Guarantee
                  </p>
                </div>

              </div>

            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default CheckoutModal;
