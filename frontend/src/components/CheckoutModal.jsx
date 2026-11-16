import React, { useState } from 'react';
import { X, CheckCircle2, Truck, CreditCard, MapPin, Phone, User, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { paymentApi } from '../api/client';

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

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

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
      errors.pinCode = 'Please enter a valid 6-digit Indian PIN Code';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fill in all required delivery details.');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Ensure Razorpay SDK is ready
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded && !window.Razorpay) {
        toast.error('Razorpay SDK failed to load. Please check your internet connection.');
        setIsSubmitting(false);
        return;
      }

      // 2. Create Razorpay order on backend
      const orderRes = await paymentApi.createOrder(total);

      if (!orderRes || !orderRes.success) {
        toast.error(orderRes?.message || 'Could not initiate payment session.');
        setIsSubmitting(false);
        return;
      }

      // 3. Configure Razorpay modal options
      const options = {
        key: orderRes.keyId || 'rzp_test_U10yTA9Fi9d9cf',
        amount: orderRes.amount,
        currency: orderRes.currency || 'INR',
        name: 'Nirvana Luxury Hampers',
        description: 'Handcrafted Celebrations & Festive Hampers',
        order_id: orderRes.orderId,
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#9E331E', // Sindoor Terracotta
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
            toast('Payment process was not completed.', { icon: 'ℹ️' });
          },
        },
        handler: async function (response) {
          // 4. Verify signature & record order in MongoDB
          try {
            setIsSubmitting(true);
            const verifyRes = await paymentApi.verifyPayment({
              razorpay_order_id: response.razorpay_order_id || orderRes.orderId,
              razorpay_payment_id: response.razorpay_payment_id || `pay_mock_${Date.now()}`,
              razorpay_signature: response.razorpay_signature || 'verified_test',
              items,
              shippingDetails: formData,
              subtotal,
              shippingFee,
              total,
            });

            if (verifyRes && verifyRes.success) {
              setConfirmedOrder(verifyRes.order || {
                orderId: `NLH-IN-${Math.floor(100000 + Math.random() * 900000)}`,
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
              setIsOrderPlaced(true);
              onClearCart();
              toast.success('Payment verified and order confirmed!');
            } else {
              toast.error(verifyRes?.message || 'Payment verification failed.');
            }
          } catch (verifyErr) {
            console.error('Payment verification error:', verifyErr);
            toast.error('Payment could not be verified. Please contact support.');
          } finally {
            setIsSubmitting(false);
          }
        },
      };

      // 4. Open Razorpay payment gateway
      if (window.Razorpay) {
        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.on('payment.failed', function (failResponse) {
          console.error('Payment failure:', failResponse.error);
          toast.error(failResponse.error?.description || 'Payment was unsuccessful. Please try again.');
          setIsSubmitting(false);
        });
        razorpayInstance.open();
      } else {
        throw new Error('Razorpay client unavailable.');
      }
    } catch (err) {
      console.error('Error initiating checkout:', err);
      toast.error(err.response?.data?.message || 'Error launching payment gateway.');
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setIsOrderPlaced(false);
    setConfirmedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl rounded-md bg-[#FCFBF8] border border-[#E5DEC9] shadow-modal overflow-hidden my-6">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E5DEC9] bg-[#F7F3EB]/70 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1E1916]">
              {isOrderPlaced ? 'Order Confirmed' : 'Delivery & Payment'}
            </h2>
            <p className="text-xs text-[#6B6259] mt-0.5">
              {isOrderPlaced
                ? 'Carefully packed and dispatched across India.'
                : 'Complete recipient details to proceed with Razorpay test checkout.'}
            </p>
          </div>
          <button
            onClick={handleModalClose}
            className="p-2 rounded-md text-[#6B6259] hover:text-[#1E1916] hover:bg-[#E5DEC9]/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        {isOrderPlaced && confirmedOrder ? (
          /* Order Confirmation View */
          <div className="p-6 sm:p-10 space-y-8 animate-in zoom-in-98 duration-200">
            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#EBF2EB] border border-[#C3D6C2] flex items-center justify-center mx-auto text-[#3D5A3C]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1E1916]">
                Thank You, {confirmedOrder.shippingDetails?.fullName}!
              </h3>
              <p className="text-sm text-[#6B6259] max-w-lg mx-auto leading-relaxed">
                Your hamper order has been placed successfully. It is being carefully packaged with festive care for safe delivery.
              </p>
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-sm bg-[#F7F3EB] border border-[#E5DEC9] text-[#1E1916] font-sans text-xs font-semibold">
                <span>Order Reference: {confirmedOrder.orderId}</span>
              </div>
            </div>

            {/* Receipt Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#F7F3EB] rounded-md border border-[#E5DEC9] p-6 text-xs">
              <div className="space-y-3">
                <h4 className="font-serif text-sm font-bold text-[#1E1916] uppercase tracking-wider flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-[#9E331E]" />
                  <span>Delivery Address</span>
                </h4>
                <div className="space-y-1 text-[#6B6259] leading-relaxed font-sans">
                  <p className="font-semibold text-[#1E1916]">{confirmedOrder.shippingDetails?.fullName}</p>
                  <p>{confirmedOrder.shippingDetails?.address}</p>
                  <p>
                    {confirmedOrder.shippingDetails?.city}, {confirmedOrder.shippingDetails?.state} -{' '}
                    <strong className="text-[#1E1916]">PIN: {confirmedOrder.shippingDetails?.pinCode}</strong>
                  </p>
                  <p className="text-[#6B6259]">Phone: {confirmedOrder.shippingDetails?.phone}</p>
                  <p className="text-[#6B6259]">Email: {confirmedOrder.shippingDetails?.email}</p>
                </div>
              </div>

              <div className="space-y-3 border-t md:border-t-0 md:border-l border-[#E5DEC9] md:pl-6 pt-4 md:pt-0">
                <h4 className="font-serif text-sm font-bold text-[#1E1916] uppercase tracking-wider flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-[#9E331E]" />
                  <span>Order Summary</span>
                </h4>
                <div className="space-y-1.5 text-[#6B6259] font-sans">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-medium text-[#1E1916]">₹{confirmedOrder.subtotal?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pan-India Delivery:</span>
                    <span className={confirmedOrder.shippingFee === 0 ? 'text-[#3D5A3C] font-semibold' : 'text-[#1E1916]'}>
                      {confirmedOrder.shippingFee === 0 ? 'FREE' : `₹${confirmedOrder.shippingFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Status:</span>
                    <span className="text-[#3D5A3C] font-semibold">Paid via Razorpay (Test Mode)</span>
                  </div>
                  <div className="pt-2 border-t border-[#E5DEC9] flex justify-between font-bold text-sm text-[#1E1916]">
                    <span>Total Paid:</span>
                    <span className="text-[#9E331E] font-serif text-lg">₹{confirmedOrder.total?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <button
                onClick={handleModalClose}
                className="px-8 py-2.5 rounded-md bg-[#9E331E] hover:bg-[#842917] text-[#FCFBF8] font-medium text-xs uppercase tracking-wider transition-colors shadow-xs"
              >
                Return to Storefront
              </button>
            </div>
          </div>
        ) : (
          /* Checkout & Shipping Form View */
          <form onSubmit={handlePlaceOrder} className="p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Delivery Form */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#9E331E] pb-2 border-b border-[#E5DEC9]">
                  <MapPin className="w-4 h-4" />
                  <span>1. Delivery Details</span>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#1E1916] mb-1.5">
                    Recipient Full Name <span className="text-[#9E331E]">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#6B6259] absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. Aditi Sharma"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className={`w-full pl-9 pr-3.5 py-2 rounded-md bg-[#F7F3EB] border text-xs text-[#1E1916] placeholder-[#A59D94] focus:outline-none focus:border-[#9E331E] transition-colors ${
                        formErrors.fullName ? 'border-[#9E331E]' : 'border-[#E5DEC9]'
                      }`}
                    />
                  </div>
                  {formErrors.fullName && (
                    <p className="text-[#9E331E] text-xs mt-1">{formErrors.fullName}</p>
                  )}
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-[#1E1916] mb-1.5">
                      Phone Number <span className="text-[#9E331E]">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#6B6259] absolute left-3 top-3" />
                      <input
                        type="tel"
                        placeholder="9876543210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={`w-full pl-9 pr-3.5 py-2 rounded-md bg-[#F7F3EB] border text-xs text-[#1E1916] placeholder-[#A59D94] focus:outline-none focus:border-[#9E331E] transition-colors ${
                          formErrors.phone ? 'border-[#9E331E]' : 'border-[#E5DEC9]'
                        }`}
                      />
                    </div>
                    {formErrors.phone && (
                      <p className="text-[#9E331E] text-xs mt-1">{formErrors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-[#1E1916] mb-1.5">
                      Email Address <span className="text-[#9E331E]">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#6B6259] absolute left-3 top-3" />
                      <input
                        type="email"
                        placeholder="aditi@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full pl-9 pr-3.5 py-2 rounded-md bg-[#F7F3EB] border text-xs text-[#1E1916] placeholder-[#A59D94] focus:outline-none focus:border-[#9E331E] transition-colors ${
                          formErrors.email ? 'border-[#9E331E]' : 'border-[#E5DEC9]'
                        }`}
                      />
                    </div>
                    {formErrors.email && (
                      <p className="text-[#9E331E] text-xs mt-1">{formErrors.email}</p>
                    )}
                  </div>
                </div>

                {/* Delivery Address */}
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#1E1916] mb-1.5">
                    Delivery Address (House / Street / Area) <span className="text-[#9E331E]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 14B, Heritage Lane, Indiranagar"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className={`w-full px-3.5 py-2 rounded-md bg-[#F7F3EB] border text-xs text-[#1E1916] placeholder-[#A59D94] focus:outline-none focus:border-[#9E331E] transition-colors ${
                      formErrors.address ? 'border-[#9E331E]' : 'border-[#E5DEC9]'
                    }`}
                  />
                  {formErrors.address && (
                    <p className="text-[#9E331E] text-xs mt-1">{formErrors.address}</p>
                  )}
                </div>

                {/* City, State, PIN */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-[#1E1916] mb-1.5">
                      City <span className="text-[#9E331E]">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Bengaluru"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className={`w-full px-3 py-2 rounded-md bg-[#F7F3EB] border text-xs text-[#1E1916] placeholder-[#A59D94] focus:outline-none focus:border-[#9E331E] transition-colors ${
                        formErrors.city ? 'border-[#9E331E]' : 'border-[#E5DEC9]'
                      }`}
                    />
                    {formErrors.city && (
                      <p className="text-[#9E331E] text-xs mt-1">{formErrors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-[#1E1916] mb-1.5">
                      State <span className="text-[#9E331E]">*</span>
                    </label>
                    <select
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-2.5 py-2 rounded-md bg-[#F7F3EB] border border-[#E5DEC9] text-xs text-[#1E1916] focus:outline-none focus:border-[#9E331E] transition-colors"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-[#1E1916] mb-1.5">
                      PIN Code <span className="text-[#9E331E]">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength="6"
                      placeholder="560038"
                      value={formData.pinCode}
                      onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                      className={`w-full px-3 py-2 rounded-md bg-[#F7F3EB] border text-xs text-[#1E1916] placeholder-[#A59D94] focus:outline-none focus:border-[#9E331E] transition-colors ${
                        formErrors.pinCode ? 'border-[#9E331E]' : 'border-[#E5DEC9]'
                      }`}
                    />
                    {formErrors.pinCode && (
                      <p className="text-[#9E331E] text-xs mt-1">{formErrors.pinCode}</p>
                    )}
                  </div>
                </div>

                {/* Gift Note */}
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#1E1916] mb-1.5">
                    Personal Greeting Note (Included with hamper)
                  </label>
                  <textarea
                    rows="2"
                    placeholder="Add a handwritten message for the recipient..."
                    value={formData.giftNote}
                    onChange={(e) => setFormData({ ...formData, giftNote: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-md bg-[#F7F3EB] border border-[#E5DEC9] text-xs text-[#1E1916] placeholder-[#A59D94] focus:outline-none focus:border-[#9E331E] transition-colors resize-none"
                  ></textarea>
                </div>

                {/* Payment Notice */}
                <div className="pt-2">
                  <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#9E331E] pb-2 border-b border-[#E5DEC9] mb-3">
                    <CreditCard className="w-4 h-4" />
                    <span>2. Razorpay Secure Payment</span>
                  </div>
                  <div className="p-3.5 rounded-md bg-[#F7F3EB] border border-[#E5DEC9] flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-sm bg-[#9E331E] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      ₹
                    </div>
                    <div className="text-xs">
                      <p className="font-semibold text-[#1E1916]">Razorpay Payment Gateway (Test Mode)</p>
                      <p className="text-[#6B6259]">Supports UPI, NetBanking, Debit/Credit Cards, and Wallets.</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Order Summary */}
              <div className="lg:col-span-5 bg-[#F7F3EB] rounded-md border border-[#E5DEC9] p-6 flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="font-serif text-base font-bold text-[#1E1916] uppercase tracking-wider pb-3 border-b border-[#E5DEC9]">
                    Order Summary ({items.length} {items.length === 1 ? 'Hamper' : 'Hampers'})
                  </h3>

                  {/* Selected Items */}
                  <div className="max-h-52 overflow-y-auto divide-y divide-[#E5DEC9] my-3 pr-1">
                    {items.map(({ product, quantity }) => (
                      <div key={product._id} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-3 truncate">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-10 h-10 rounded-sm object-cover bg-white border border-[#E5DEC9] shrink-0"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=150&q=80';
                            }}
                          />
                          <div className="truncate">
                            <span className="text-[#1E1916] font-medium block truncate">
                              {product.name}
                            </span>
                            <span className="text-[10px] text-[#6B6259]">
                              Qty: {quantity} · ₹{Number(product.price).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                        <span className="font-medium text-[#1E1916] ml-2 shrink-0">
                          ₹{(product.price * quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-2 pt-3 border-t border-[#E5DEC9] text-xs">
                    <div className="flex justify-between text-[#6B6259]">
                      <span>Subtotal</span>
                      <span className="text-[#1E1916] font-medium">
                        ₹{subtotal.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex justify-between text-[#6B6259] items-center">
                      <span>Delivery Fee</span>
                      <span className={isFreeShipping ? 'text-[#3D5A3C] font-semibold' : 'text-[#1E1916]'}>
                        {isFreeShipping ? 'FREE' : `₹${STANDARD_SHIPPING_FEE}`}
                      </span>
                    </div>

                    <div className="p-2 rounded-sm bg-[#FCFBF8] border border-[#E5DEC9] text-[11px] text-[#6B6259]">
                      {isFreeShipping ? (
                        <p className="text-[#3D5A3C]">
                          <strong>Complimentary delivery applied</strong> for order value above ₹{FREE_SHIPPING_THRESHOLD.toLocaleString('en-IN')}.
                        </p>
                      ) : (
                        <p>
                          Standard delivery <strong>₹{STANDARD_SHIPPING_FEE}</strong> · Free on orders above <strong>₹{FREE_SHIPPING_THRESHOLD.toLocaleString('en-IN')}</strong>.
                        </p>
                      )}
                    </div>

                    <div className="flex justify-between text-[#6B6259]">
                      <span>Taxes</span>
                      <span>Included (All GST)</span>
                    </div>

                    <div className="pt-3 border-t border-[#E5DEC9] flex justify-between items-baseline">
                      <span className="text-sm font-serif font-bold text-[#1E1916] uppercase tracking-wider">
                        Total Amount
                      </span>
                      <span className="text-2xl font-serif font-bold text-[#9E331E]">
                        ₹{total.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Place Order Button */}
                <div className="space-y-2 pt-4 border-t border-[#E5DEC9]">
                  <button
                    type="submit"
                    disabled={isSubmitting || items.length === 0}
                    className="w-full py-3 rounded-md bg-[#9E331E] hover:bg-[#842917] text-[#FCFBF8] font-medium text-xs tracking-wider uppercase transition-colors shadow-xs active:scale-98 disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <span>Place Order · ₹{total.toLocaleString('en-IN')}</span>
                    )}
                  </button>
                  <p className="text-[11px] text-center text-[#8E857C]">
                    Carefully packed and dispatched across India
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
