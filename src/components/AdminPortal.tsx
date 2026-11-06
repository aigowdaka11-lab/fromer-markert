import React, { useState, useEffect } from 'react';
import { CropListing, DisputeReport, Language, UserProfile } from '../types';
import { translations } from '../locales/translations';
import { authService } from '../services/authService';
import { cropService } from '../services/cropService';
import { initialDisputes } from '../services/mockData';
import {
  ShieldCheck,
  Users,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Trash2,
  Flag,
  MapPin,
  Sprout,
  TrendingUp,
} from 'lucide-react';

interface AdminPortalProps {
  language: Language;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ language }) => {
  const t = translations[language];

  const [activeTab, setActiveTab] = useState<'listings' | 'users' | 'complaints' | 'stats'>('listings');
  const [crops, setCrops] = useState<CropListing[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [disputes, setDisputes] = useState<DisputeReport[]>(initialDisputes);

  const loadAdminData = async () => {
    const [c, u] = await Promise.all([
      cropService.getListings(),
      Promise.resolve(authService.getAllUsers()),
    ]);
    setCrops(c);
    setUsers(u);
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleVerifyFarmer = (userId: string) => {
    authService.verifyUser(userId);
    loadAdminData();
  };

  const handleRemoveListing = async (cropId: string) => {
    if (confirm(language === 'kn' ? 'ಈ ಪಟ್ಟಿಯನ್ನು ಅಳಿಸಲು ಖಚಿತಪಡಿಸಿ?' : 'Confirm removing this listing?')) {
      await cropService.deleteListing(cropId);
      loadAdminData();
    }
  };

  const handleFlagListing = async (cropId: string, currentFlag?: boolean) => {
    await cropService.flagListing(cropId, !currentFlag);
    loadAdminData();
  };

  const handleResolveDispute = (disputeId: string) => {
    setDisputes((prev) =>
      prev.map((d) => (d.id === disputeId ? { ...d, status: 'resolved' as const } : d))
    );
  };

  const farmersCount = users.filter((u) => u.role === 'farmer').length;
  const buyersCount = users.filter((u) => u.role === 'buyer').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Admin Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>{language === 'kn' ? 'ಮಾರುಕಟ್ಟೆ ಆಡಳಿತಾಧಿಕಾರಿ ವ್ಯವಸ್ಥೆ' : 'Marketplace Admin Console'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
          {t.adminTitle}
        </h1>
        <p className="text-sm text-stone-600 mt-1 max-w-3xl">
          {t.adminSubtitle}
        </p>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 font-medium">{language === 'kn' ? 'ನೋಂದಾಯಿತ ರೈತರು' : 'Farmers'}</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-900 mt-1">
            {farmersCount}
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 font-medium">{language === 'kn' ? 'ಸಗಟು & ಚಿಲ್ಲರೆ ಖರೀದಿದಾರರು' : 'Buyers'}</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-stone-900 mt-1">
            {buyersCount}
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 font-medium">{language === 'kn' ? 'ಸಕ್ರಿಯ ಬೆಳೆ ದಾಸ್ತಾನುಗಳು' : 'Live Crop Lots'}</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-stone-900 mt-1">
            {crops.length}
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 font-medium">{language === 'kn' ? 'ದಾಖಲಾದ ದೂರುಗಳು' : 'Complaints'}</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-amber-600 mt-1">
            {disputes.filter((d) => d.status !== 'resolved').length}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-stone-100 rounded-2xl max-w-xl overflow-x-auto">
        <button
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors ${
            activeTab === 'listings' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
          }`}
        >
          {t.tabListings} ({crops.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors ${
            activeTab === 'users' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
          }`}
        >
          {t.tabUsers} ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('complaints')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors ${
            activeTab === 'complaints' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
          }`}
        >
          {t.tabComplaints} ({disputes.length})
        </button>
      </div>

      {/* Tab: Crop Listings Moderation */}
      {activeTab === 'listings' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase">
                  <th className="py-3 px-4">ಬೆಳೆ / Crop</th>
                  <th className="py-3 px-4">ರೈತರು / Farmer</th>
                  <th className="py-3 px-4">ಸ್ಥಳ / Location</th>
                  <th className="py-3 px-4 text-right">ಪ್ರಮಾಣ / Qty</th>
                  <th className="py-3 px-4 text-right">ಬೆಲೆ / Price</th>
                  <th className="py-3 px-4 text-right">ಕ್ರಮಗಳು / Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {crops.map((crop) => (
                  <tr key={crop.id} className="hover:bg-stone-50/70">
                    <td className="py-3 px-4">
                      <div className="font-bold text-stone-900">
                        {language === 'kn' ? crop.cropNameKn : crop.cropNameEn}
                      </div>
                      <div className="text-[11px] text-stone-400">{crop.variety}</div>
                      {crop.isFlagged && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded font-semibold mt-1">
                          <AlertTriangle className="w-3 h-3" />
                          ಅನುಮಾನಾಸ್ಪದ (Flagged)
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-stone-800">{crop.farmerName}</div>
                      <div className="text-[11px] text-stone-400 font-mono">{crop.farmerPhone}</div>
                    </td>

                    <td className="py-3 px-4 text-stone-600">
                      {crop.village}, {crop.district}
                    </td>

                    <td className="py-3 px-4 text-right font-mono tabular-nums">
                      {crop.quantity} {crop.unit}
                    </td>

                    <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-emerald-900">
                      ₹{crop.askingPricePerUnit.toLocaleString()}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleFlagListing(crop.id, crop.isFlagged)}
                          className={`p-1.5 rounded-lg border text-xs transition-colors ${
                            crop.isFlagged
                              ? 'bg-rose-100 text-rose-800 border-rose-300'
                              : 'bg-stone-50 text-stone-600 border-stone-200 hover:text-amber-700'
                          }`}
                          title="Flag / Unflag Suspicious"
                        >
                          <Flag className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleRemoveListing(crop.id)}
                          className="p-1.5 rounded-lg bg-stone-50 text-stone-400 hover:text-rose-600 border border-stone-200 hover:border-rose-300 transition-colors"
                          title={t.removeListing}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Tab: Users Management */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase">
                  <th className="py-3 px-4">ಹೆಸರು / Name</th>
                  <th className="py-3 px-4">ಪಾತ್ರ / Role</th>
                  <th className="py-3 px-4">ಸಂಪರ್ಕ / Contact</th>
                  <th className="py-3 px-4">ಸ್ಥಳ / District</th>
                  <th className="py-3 px-4">ಸ್ಥಿತಿ / Status</th>
                  <th className="py-3 px-4 text-right">ದೃಢೀಕರಣ / Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-stone-50/70">
                    <td className="py-3 px-4 font-bold text-stone-900">{user.name}</td>
                    <td className="py-3 px-4">
                      <span className="capitalize px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-medium">
                        {user.role} {user.buyerType ? `(${user.buyerType})` : ''}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-stone-600">{user.phone}</td>
                    <td className="py-3 px-4 text-stone-600">{user.district}</td>
                    <td className="py-3 px-4">
                      {user.isVerified ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> ದೃಢೀಕೃತ
                        </span>
                      ) : (
                        <span className="text-amber-700 font-medium">ಅಪರಿಶೀಲಿತ (Pending)</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {!user.isVerified && (
                        <button
                          onClick={() => handleVerifyFarmer(user.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-800 text-white font-semibold text-[11px] hover:bg-emerald-900"
                        >
                          {t.verifyFarmer}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Complaints & Disputes */}
      {activeTab === 'complaints' && (
        <div className="space-y-4">
          {disputes.map((disp) => (
            <div
              key={disp.id}
              className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-stone-900">{disp.targetTitle}</span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                    disp.status === 'resolved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {disp.status.toUpperCase()}
                  </span>
                </div>

                <div className="text-xs text-stone-600">
                  <span className="font-semibold text-stone-800">ದೂರುದಾರರು:</span> {disp.reporterName} ({disp.reporterRole})
                </div>

                <p className="text-xs text-stone-700 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                  {disp.details}
                </p>

                {disp.resolutionNotes && (
                  <div className="text-[11px] text-emerald-800 font-medium">
                    ಪರಿಹಾರ ಟಿಪ್ಪಣಿ: {disp.resolutionNotes}
                  </div>
                )}
              </div>

              {disp.status !== 'resolved' && (
                <button
                  onClick={() => handleResolveDispute(disp.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold whitespace-nowrap"
                >
                  {language === 'kn' ? 'ಪರಿಹರಿಸಲಾಗಿದೆ ಎಂದು ಗುರುತಿಸಿ' : 'Mark Resolved'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
