import React, { useState } from 'react';
import { CropListing, Language, UserProfile } from '../types';
import { translations } from '../locales/translations';
import {
  X,
  MapPin,
  CheckCircle2,
  Phone,
  MessageCircle,
  Calendar,
  ShieldCheck,
  Truck,
  IndianRupee,
  Navigation,
  Send,
  Scale,
} from 'lucide-react';
import { orderService } from '../services/orderService';

interface CropDetailModalProps {
  crop: CropListing | null;
  language: Language;
  currentUser: UserProfile | null;
  onClose: () => void;
  onOpenAuth: () => void;
  onEnquirySuccess: () => void;
}

export const CropDetailModal: React.FC<CropDetailModalProps> = ({
  crop,
  language,
  currentUser,
  onClose,
  onOpenAuth,
  onEnquirySuccess,
}) => {
  if (!crop) return null;

  const t = translations[language];
  const cropName = language === 'kn' ? crop.cropNameKn : crop.cropNameEn;
  const unitLabel =
    crop.unit === 'tonne' ? t.unitTonne : crop.unit === 'quintal' ? t.unitQuintal : t.unitKg;

  // Form states
  const [quantity, setQuantity] = useState<number>(crop.minOrderQuantity || 1);
  const [offeredRate, setOfferedRate] = useState<number>(crop.askingPricePerUnit);
  const [deliveryAddress, setDeliveryAddress] = useState<string>(
    currentUser?.village ? `${currentUser.village}, ${currentUser.district}` : ''
  );
  const [preferredDate, setPreferredDate] = useState<string>(
    new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
  );
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const totalAmount = quantity * offeredRate;

  const handleSendEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    try {
      setIsSubmitting(true);
      await orderService.createEnquiry({
        cropId: crop.id,
        cropNameEn: crop.cropNameEn,
        cropNameKn: crop.cropNameKn,
        farmerId: crop.farmerId,
        farmerName: crop.farmerName,
        farmerPhone: crop.farmerPhone,
        buyerId: currentUser.id,
        buyerName: currentUser.name,
        buyerPhone: currentUser.phone,
        buyerType: currentUser.buyerType || 'consumer',
        requestedQuantity: quantity,
        unit: crop.unit,
        offeredPricePerUnit: offeredRate,
        totalAmount,
        message: message.trim() || 'Direct purchase order requested via Farmer Direct Market platform.',
        deliveryAddress: deliveryAddress.trim() || `${currentUser.district}, Karnataka`,
        deliveryDistrict: currentUser.district || crop.district,
        preferredDeliveryDate: preferredDate,
      });

      setSubmittedSuccess(true);
      setTimeout(() => {
        onEnquirySuccess();
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Failed to submit enquiry', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${crop.coordinates.lat},${crop.coordinates.lng}`;
  const cleanPhone = crop.farmerPhone.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone}?text=${encodeURIComponent(
    `ನಮಸ್ಕಾರ / Hello ${crop.farmerName}, I am interested in your listing "${crop.cropNameEn}" on Farmer Direct Market.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative bg-white w-full max-w-4xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-stone-200 my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase text-emerald-800 tracking-wider">
              {crop.variety}
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="text-xs text-stone-500">
              {crop.village}, {crop.district}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-500 hover:text-stone-800 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[80vh] overflow-y-auto">
          {/* Left Column: Media & Specifications */}
          <div className="lg:col-span-7 p-6 border-b lg:border-b-0 lg:border-r border-stone-200 flex flex-col gap-5">
            {/* Visual Photo */}
            <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
              <img
                src={crop.imageUrl}
                alt={cropName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {crop.organicCertified && (
                <div className="absolute top-3 left-3 bg-emerald-900/90 text-emerald-100 px-3 py-1 rounded-md text-xs font-medium backdrop-blur-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  {t.organicCertified}
                </div>
              )}
            </div>

            {/* Title & Core Details */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mb-2">
                {cropName}
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                {language === 'kn' ? crop.descriptionKn : crop.descriptionEn}
              </p>
            </div>

            {/* Key Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs">
              <div>
                <span className="text-stone-400 block mb-0.5">{t.askingPrice}</span>
                <span className="font-mono tabular-nums text-sm font-bold text-emerald-900">
                  ₹{crop.askingPricePerUnit.toLocaleString()} / {unitLabel}
                </span>
              </div>
              <div>
                <span className="text-stone-400 block mb-0.5">{t.availableStock}</span>
                <span className="font-mono tabular-nums text-sm font-semibold text-stone-800">
                  {crop.quantity.toLocaleString()} {unitLabel}
                </span>
              </div>
              <div>
                <span className="text-stone-400 block mb-0.5">{t.minOrder}</span>
                <span className="font-mono tabular-nums text-sm font-semibold text-stone-800">
                  {crop.minOrderQuantity} {unitLabel}
                </span>
              </div>
              <div>
                <span className="text-stone-400 block mb-0.5">{t.harvestDate}</span>
                <span className="font-semibold text-stone-800">{crop.harvestDate}</span>
              </div>
              <div>
                <span className="text-stone-400 block mb-0.5">{t.availableFrom}</span>
                <span className="font-semibold text-stone-800">{crop.availableFrom}</span>
              </div>
              <div>
                <span className="text-stone-400 block mb-0.5">{t.nearMarket}</span>
                <span className="font-semibold text-stone-800 truncate block">
                  {crop.marketNearby}
                </span>
              </div>
            </div>

            {/* Farmer Card & Direct Contact */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold mb-0.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>{language === 'kn' ? 'ದೃಢೀಕೃತ ರೈತರು' : 'Verified Farmer'}</span>
                </div>
                <div className="text-sm font-bold text-stone-900">{crop.farmerName}</div>
                <div className="text-xs text-stone-500 font-mono tabular-nums">{crop.farmerPhone}</div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href={`tel:${crop.farmerPhone}`}
                  className="flex-1 sm:flex-none px-3 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{t.directCall}</span>
                </a>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Farm Map Directions Link */}
            <div className="flex items-center justify-between text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-200">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>
                  {crop.village}, {crop.taluk}, {crop.district} ({crop.coordinates.lat.toFixed(3)}, {crop.coordinates.lng.toFixed(3)})
                </span>
              </span>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-800 font-semibold hover:underline flex items-center gap-1"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>{language === 'kn' ? 'ನಕ್ಷೆಯಲ್ಲಿ ನೋಡಿ' : 'Open in Maps'}</span>
              </a>
            </div>
          </div>

          {/* Right Column: Direct Purchase & Order Request Form */}
          <div className="lg:col-span-5 p-6 flex flex-col justify-between bg-stone-50/50">
            {submittedSuccess ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-stone-900">
                  {language === 'kn' ? 'ಖರೀದಿ ಕೋರಿಕೆ ರವಾನೆಯಾಗಿದೆ!' : 'Request Sent Successfully!'}
                </h3>
                <p className="text-xs text-stone-600">
                  {language === 'kn'
                    ? 'ರೈತರಿಗೆ ನಿಮ್ಮ ವಿವರಗಳನ್ನು ಕಳುಹಿಸಲಾಗಿದೆ. ಶೀಘ್ರವೇ ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತಾರೆ.'
                    : 'Your purchase order has been directly submitted to the farmer.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendEnquiry} className="flex flex-col gap-4">
                <div>
                  <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                    <Scale className="w-4 h-4 text-emerald-700" />
                    <span>{t.sendPurchaseEnquiry}</span>
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {language === 'kn'
                      ? 'ದಲ್ಲಾಳಿಗಳಿಲ್ಲದೆ ರೈತರಿಗೆ ನೇರ ಬೆಲೆ ಪ್ರಸ್ತಾಪಿಸಿ'
                      : 'Direct procurement without intermediary commission'}
                  </p>
                </div>

                {/* Requested Quantity */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {t.requestedQuantity} ({unitLabel})
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={crop.minOrderQuantity || 1}
                      max={crop.quantity}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                      className="w-full px-3 py-2 bg-white rounded-lg border border-stone-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 text-sm font-mono tabular-nums"
                      required
                    />
                    <span className="text-xs font-semibold text-stone-500 shrink-0">
                      {unitLabel}
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-400 mt-1 block">
                    {t.minOrder}: {crop.minOrderQuantity} {unitLabel} | {t.availableStock}: {crop.quantity} {unitLabel}
                  </span>
                </div>

                {/* Offered Rate per Unit */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {t.offeredRate} (₹ / {unitLabel})
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={offeredRate}
                    onChange={(e) => setOfferedRate(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-stone-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 text-sm font-mono tabular-nums"
                    required
                  />
                  <span className="text-[11px] text-stone-400 mt-1 block">
                    {language === 'kn' ? 'ರೈತರ ಕೇಳಿದ ದರ:' : 'Farmer asking rate:'} ₹{crop.askingPricePerUnit}
                  </span>
                </div>

                {/* Calculated Total Amount */}
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="flex items-center justify-between text-xs text-stone-600 mb-1">
                    <span>{language === 'kn' ? 'ಒಟ್ಟು ಅಂದಾಜು ಮೊತ್ತ' : 'Estimated Value'}</span>
                    <span className="font-mono tabular-nums">{quantity} × ₹{offeredRate}</span>
                  </div>
                  <div className="text-xl font-bold font-mono tabular-nums text-emerald-900">
                    ₹{totalAmount.toLocaleString()}
                  </div>
                </div>

                {/* Delivery Address */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {language === 'kn' ? 'ಸಾಗಾಣಿಕೆ / ವಿತರಣಾ ವಿಳಾಸ' : 'Delivery / Pickup Location'}
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder={language === 'kn' ? 'ಉದಾ: ಮೈಸೂರು ಮಾರುಕಟ್ಟೆ, ಅಥವಾ ಹೊಲದಿಂದಲೇ ಪಿಕಪ್' : 'e.g., Farm gate pickup or Bangalore Central Kitchen'}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-stone-300 focus:border-emerald-700 text-xs"
                    required
                  />
                </div>

                {/* Preferred Date */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {language === 'kn' ? 'ಅಪೇಕ್ಷಿತ ದಿನಾಂಕ' : 'Preferred Date'}
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-stone-300 focus:border-emerald-700 text-xs font-mono"
                    required
                  />
                </div>

                {/* Optional Message */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {language === 'kn' ? 'ರೈತರಿಗೆ ಸಂದೇಶ (ಐಚ್ಛಿಕ)' : 'Note for Farmer (Optional)'}
                  </label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={language === 'kn' ? 'ಸಾರಿಗೆ ವ್ಯವಸ್ಥೆ, ಗುಣಮಟ್ಟ ಪರಿಶೀಲನೆ ಇತ್ಯಾದಿ...' : 'Vehicle details, moisture limits, packaging instructions...'}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-stone-300 focus:border-emerald-700 text-xs"
                  />
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:scale-[0.99] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition-all duration-150 disabled:opacity-50 mt-2"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? (language === 'kn' ? 'ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ...' : 'Submitting Request...')
                      : (language === 'kn' ? 'ಖರೀದಿ ಕೋರಿಕೆ ಸಲ್ಲಿಸಿ' : 'Submit Purchase Order')}
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
