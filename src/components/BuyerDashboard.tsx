import React, { useState, useEffect } from 'react';
import { Language, PurchaseEnquiry, UserProfile } from '../types';
import { translations } from '../locales/translations';
import { orderService } from '../services/orderService';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  Phone,
  MessageCircle,
  MapPin,
  Calendar,
  Building2,
} from 'lucide-react';

interface BuyerDashboardProps {
  language: Language;
  currentUser: UserProfile;
  onBrowseCrops: () => void;
}

export const BuyerDashboard: React.FC<BuyerDashboardProps> = ({
  language,
  currentUser,
  onBrowseCrops,
}) => {
  const t = translations[language];
  const [orders, setOrders] = useState<PurchaseEnquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const list = await orderService.getEnquiriesForBuyer(currentUser.id);
      setOrders(list);
    } catch (e) {
      console.error('Failed to load buyer orders', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [currentUser.id]);

  const totalSpent = orders
    .filter((o) => o.status === 'accepted' || o.status === 'completed')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Buyer Profile Header */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-stone-900 text-white flex items-center justify-center text-2xl font-bold shadow-md">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-stone-900">{currentUser.name}</h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 text-stone-800 text-xs font-semibold capitalize">
                {currentUser.buyerType || 'Buyer'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                {currentUser.village}, {currentUser.district}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">{currentUser.phone}</span>
              {currentUser.businessName && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{currentUser.businessName}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={onBrowseCrops}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:scale-[0.99] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{language === 'kn' ? 'ಹೆಚ್ಚು ಬೆಳೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ' : 'Browse Fresh Crops'}</span>
        </button>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 font-medium mb-1">
            {language === 'kn' ? 'ಒಟ್ಟು ನೇರ ಖರೀದಿ ಮೌಲ್ಯ' : 'Total Direct Procurement'}
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-emerald-900">
            ₹{totalSpent.toLocaleString()}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            {language === 'kn' ? 'ರೈತರಿಂದ ನೇರ ಖರೀದಿ ವಹಿವಾಟು' : 'Commission-free direct farm trade'}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 font-medium mb-1">
            {language === 'kn' ? 'ಸಲ್ಲಿಸಿದ ಖರೀದಿ ಕೋರಿಕೆಗಳು' : 'Purchase Orders Placed'}
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-stone-900">
            {orders.length}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            {language === 'kn' ? 'ಒಟ್ಟು ಆರ್ಡರ್ ದಾಖಲೆಗಳು' : 'Active and past procurement'}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 font-medium mb-1">
            {language === 'kn' ? 'ಖಚಿತಗೊಂಡ ಸಾಗಣೆಗಳು' : 'Accepted Orders'}
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-emerald-700">
            {orders.filter((o) => o.status === 'accepted' || o.status === 'completed').length}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            {language === 'kn' ? 'ರೈತರಿಂದ ಒಪ್ಪಿಗೆ ಪಡೆದ ಆರ್ಡರ್‌ಗಳು' : 'Confirmed by local farmers'}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <h2 className="text-sm font-bold text-stone-900">{t.myOrders}</h2>
          <span className="text-xs text-stone-500 font-mono tabular-nums">{orders.length} records</span>
        </div>

        <div className="divide-y divide-stone-100">
          {orders.map((order) => {
            const cleanPhone = order.farmerPhone.replace(/[^0-9]/g, '');
            const waUrl = `https://wa.me/${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone}?text=${encodeURIComponent(
              `ನಮಸ್ಕಾರ ${order.farmerName}, Regarding our direct order for "${order.cropNameEn}".`
            )}`;

            return (
              <div key={order.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-stone-900">
                      {language === 'kn' ? order.cropNameKn : order.cropNameEn}
                    </span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                      order.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : order.status === 'accepted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.status === 'completed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {order.status === 'pending'
                        ? t.statusPending
                        : order.status === 'accepted'
                        ? t.statusAccepted
                        : order.status === 'completed'
                        ? t.statusCompleted
                        : t.statusRejected}
                    </span>
                  </div>

                  <div className="text-xs text-stone-700">
                    <span className="text-stone-400">{language === 'kn' ? 'ರೈತರು:' : 'Farmer:'}</span>{' '}
                    <span className="font-semibold text-stone-900">{order.farmerName}</span>
                    <span className="text-stone-400 ml-2">({order.farmerPhone})</span>
                  </div>

                  <div className="text-xs text-stone-600 font-mono tabular-nums">
                    {order.requestedQuantity} {order.unit} @ ₹{order.offeredPricePerUnit} / {order.unit} ={' '}
                    <span className="font-bold text-emerald-900">₹{order.totalAmount.toLocaleString()}</span>
                  </div>

                  <div className="text-[11px] text-stone-400">
                    ವಿತರಣೆ ವಿಳಾಸ: {order.deliveryAddress} · ದಿನಾಂಕ: {order.preferredDeliveryDate}
                  </div>
                </div>

                {/* Direct Farmer Contact */}
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`tel:${order.farmerPhone}`}
                    className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{t.directCall}</span>
                  </a>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            );
          })}

          {orders.length === 0 && (
            <div className="p-12 text-center text-xs text-stone-500 space-y-3">
              <ShoppingBag className="w-10 h-10 text-stone-400 mx-auto" />
              <p>
                {language === 'kn'
                  ? 'ನೀವಿನ್ನೂ ಯಾವುದೇ ನೇರ ಖರೀದಿ ಕೋರಿಕೆ ಸಲ್ಲಿಸಿಲ್ಲ.'
                  : 'You have not placed any direct crop enquiries yet.'}
              </p>
              <button
                onClick={onBrowseCrops}
                className="px-4 py-2 rounded-xl bg-emerald-800 text-white font-semibold"
              >
                {language === 'kn' ? 'ಬೆಳೆಗಳನ್ನು ಹುಡುಕಿ' : 'Browse Crop Market'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
