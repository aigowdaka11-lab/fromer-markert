import React, { useState, useEffect } from 'react';
import { CropListing, Language, PurchaseEnquiry, UserProfile } from '../types';
import { translations } from '../locales/translations';
import { cropService } from '../services/cropService';
import { orderService } from '../services/orderService';
import {
  Sprout,
  PlusCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  IndianRupee,
  Layers,
  Phone,
  Trash2,
  Edit3,
  MapPin,
  Calendar,
  AlertCircle,
} from 'lucide-react';

interface FarmerDashboardProps {
  language: Language;
  currentUser: UserProfile;
  onOpenAddCrop: () => void;
  onSelectCrop: (crop: CropListing) => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  language,
  currentUser,
  onOpenAddCrop,
  onSelectCrop,
}) => {
  const t = translations[language];

  const [myListings, setMyListings] = useState<CropListing[]>([]);
  const [enquiries, setEnquiries] = useState<PurchaseEnquiry[]>([]);
  const [activeTab, setActiveTab] = useState<'listings' | 'enquiries' | 'sales'>('listings');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [crops, orders] = await Promise.all([
        cropService.getListingsByFarmer(currentUser.id),
        orderService.getEnquiriesForFarmer(currentUser.id),
      ]);
      setMyListings(crops);
      setEnquiries(orders);
    } catch (err) {
      console.error('Failed to load farmer dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser.id]);

  const handleAcceptOrder = async (orderId: string) => {
    await orderService.updateStatus(orderId, 'accepted');
    loadData();
  };

  const handleRejectOrder = async (orderId: string) => {
    await orderService.updateStatus(orderId, 'rejected', 'Stock already committed or rate not viable');
    loadData();
  };

  const handleCompleteOrder = async (orderId: string) => {
    await orderService.updateStatus(orderId, 'completed');
    loadData();
  };

  const handleDeleteListing = async (cropId: string) => {
    if (confirm(language === 'kn' ? 'ಈ ಬೆಳೆಯನ್ನು ಪಟ್ಟಿಯಿಂದ ತೆಗೆದುಹಾಕಲು ಖಚಿತಪಡಿಸಿ?' : 'Confirm removing this crop listing?')) {
      await cropService.deleteListing(cropId);
      loadData();
    }
  };

  // Metrics
  const totalVolumeRevenue = enquiries
    .filter((e) => e.status === 'accepted' || e.status === 'completed')
    .reduce((sum, e) => sum + e.totalAmount, 0);

  const pendingCount = enquiries.filter((e) => e.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-800 text-white flex items-center justify-center text-2xl font-bold shadow-md">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-stone-900">{currentUser.name}</h1>
              {currentUser.isVerified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {language === 'kn' ? 'ದೃಢೀಕೃತ ರೈತರು' : 'Verified Farmer'}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                {currentUser.village}, {currentUser.taluk}, {currentUser.district}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">{currentUser.phone}</span>
              {currentUser.farmSizeAcres && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{currentUser.farmSizeAcres} {language === 'kn' ? 'ಎಕರೆ ಕೃಷಿ ಭೂಮಿ' : 'acres farmland'}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Primary CTA: Add Crop */}
        <button
          onClick={onOpenAddCrop}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:scale-[0.99] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.addNewListing}</span>
        </button>
      </div>

      {/* KPI Metric Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 font-medium mb-1">{t.totalRevenue}</div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-emerald-900">
            ₹{totalVolumeRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-700 mt-1">
            {language === 'kn' ? 'ದಲ್ಲಾಳಿ ಕಮಿಷನ್ ರಹಿತ ನೇರ ಆದಾಯ' : '100% direct sale value'}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 font-medium mb-1">{t.totalListings}</div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-stone-900">
            {myListings.length}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            {language === 'kn' ? 'ಸಕ್ರಿಯ ಮಾರಾಟ ದಾಸ್ತಾನುಗಳು' : 'Available active crop lots'}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 font-medium mb-1">{t.pendingEnquiries}</div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-amber-600">
            {pendingCount}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            {language === 'kn' ? 'ನಿಮ್ಮ ಒಪ್ಪಿಗೆಗೆ ಕಾಯುತ್ತಿರುವ ವಿನಂತಿಗಳು' : 'Buyer requests awaiting action'}
          </div>
        </div>
      </div>

      {/* Segmented Tab Controls */}
      <div className="flex items-center gap-2 p-1.5 bg-stone-100 rounded-2xl max-w-md">
        <button
          onClick={() => setActiveTab('listings')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap ${
            activeTab === 'listings'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          {t.myActiveListings} ({myListings.length})
        </button>
        <button
          onClick={() => setActiveTab('enquiries')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap ${
            activeTab === 'enquiries'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          {t.incomingRequests} ({enquiries.length})
        </button>
      </div>

      {/* Tab 1: My Crop Listings */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myListings.map((crop) => (
              <div
                key={crop.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs flex flex-col justify-between"
              >
                <div className="relative aspect-16/10 bg-stone-100">
                  <img
                    src={crop.imageUrl}
                    alt={crop.cropNameEn}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-stone-900/80 text-white px-2 py-0.5 rounded text-[11px] font-mono tabular-nums">
                    {crop.quantity} {crop.unit}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-semibold text-emerald-800 uppercase block">
                      {crop.variety}
                    </span>
                    <h3 className="text-base font-bold text-stone-900 mt-0.5">
                      {language === 'kn' ? crop.cropNameKn : crop.cropNameEn}
                    </h3>
                    <div className="font-mono tabular-nums text-base font-bold text-emerald-900 mt-2">
                      ₹{crop.askingPricePerUnit.toLocaleString()} / {crop.unit}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onSelectCrop(crop)}
                      className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors"
                    >
                      {t.viewDetails}
                    </button>

                    <button
                      onClick={() => handleDeleteListing(crop.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title={t.deleteListing}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {myListings.length === 0 && (
            <div className="bg-white p-12 text-center rounded-3xl border border-stone-200 space-y-3">
              <Sprout className="w-12 h-12 text-emerald-700 mx-auto stroke-[1.5]" />
              <h3 className="text-base font-bold text-stone-900">
                {language === 'kn' ? 'ನೀವಿನ್ನೂ ಯಾವುದೇ ಬೆಳೆ ಪಟ್ಟಿ ಮಾಡಿಲ್ಲ' : 'No active listings yet'}
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                {language === 'kn'
                  ? 'ನಿಮ್ಮ ತಾಜಾ ಬೆಳೆ, ತಳಿ, ಪ್ರಮಾಣ ಮತ್ತು ಕೇಳುವ ಬೆಲೆಯನ್ನು ನಮೂದಿಸಿ ನೇರ ವ್ಯಾಪಾರ ಪ್ರಾರಂಭಿಸಿ.'
                  : 'Start selling directly to hotels, wholesalers, and retail buyers with zero commission.'}
              </p>
              <button
                onClick={onOpenAddCrop}
                className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold"
              >
                {t.addNewListing}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Incoming Buyer Purchase Requests */}
      {activeTab === 'enquiries' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs divide-y divide-stone-100">
            {enquiries.map((enq) => {
              const isPending = enq.status === 'pending';
              const isAccepted = enq.status === 'accepted';
              const isCompleted = enq.status === 'completed';
              const isRejected = enq.status === 'rejected';

              return (
                <div key={enq.id} className="p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-stone-900">{enq.buyerName}</span>
                      <span className="text-[11px] text-stone-500 capitalize font-medium">({enq.buyerType})</span>
                      <span aria-hidden="true" className="text-stone-300">·</span>
                      <span className="text-xs text-stone-500 font-mono">{enq.buyerPhone}</span>
                      <span aria-hidden="true" className="text-stone-300">·</span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                        isPending
                          ? 'bg-amber-100 text-amber-800'
                          : isAccepted
                          ? 'bg-emerald-100 text-emerald-800'
                          : isCompleted
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {enq.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="text-sm font-semibold text-stone-800">
                      {language === 'kn' ? enq.cropNameKn : enq.cropNameEn}:{' '}
                      <span className="font-mono tabular-nums text-emerald-900 font-bold">
                        {enq.requestedQuantity} {enq.unit} @ ₹{enq.offeredPricePerUnit} / {enq.unit}
                      </span>
                      <span className="text-xs font-normal text-stone-500 ml-2">
                        (ಒಟ್ಟು ಮೊತ್ತ: ₹{enq.totalAmount.toLocaleString()})
                      </span>
                    </div>

                    {enq.message && (
                      <p className="text-xs text-stone-600 bg-stone-50 p-2 rounded-lg border border-stone-200">
                        "{enq.message}"
                      </p>
                    )}

                    <div className="text-[11px] text-stone-400 flex flex-wrap items-center gap-3">
                      <span>ವಿತರಣಾ ಸ್ಥಳ: {enq.deliveryAddress}</span>
                      <span>ದಿನಾಂಕ: {enq.preferredDeliveryDate}</span>
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                    {isPending && (
                      <>
                        <button
                          onClick={() => handleAcceptOrder(enq.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{t.acceptOrder}</span>
                        </button>
                        <button
                          onClick={() => handleRejectOrder(enq.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>{t.rejectOrder}</span>
                        </button>
                      </>
                    )}

                    {isAccepted && (
                      <button
                        onClick={() => handleCompleteOrder(enq.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>{t.markCompleted}</span>
                      </button>
                    )}

                    <a
                      href={`tel:${enq.buyerPhone}`}
                      className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                      title={t.directCall}
                    >
                      <Phone className="w-4 h-4 text-emerald-700" />
                    </a>
                  </div>
                </div>
              );
            })}

            {enquiries.length === 0 && (
              <div className="p-8 text-center text-xs text-stone-500">
                {language === 'kn'
                  ? 'ಯಾವುದೇ ಹೊಸ ಖರೀದಿ ವಿನಂತಿಗಳು ಬಂದಿಲ್ಲ.'
                  : 'No buyer enquiries received yet.'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
