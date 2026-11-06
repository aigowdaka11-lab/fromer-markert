export type Language = 'kn' | 'en';

export type UserRole = 'farmer' | 'buyer' | 'admin';

export type BuyerType = 'wholesaler' | 'retailer' | 'hotel' | 'consumer';

export type QuantityUnit = 'kg' | 'quintal' | 'tonne';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  district: string;
  taluk: string;
  village: string;
  farmSizeAcres?: number;
  buyerType?: BuyerType;
  businessName?: string;
  isVerified: boolean;
  avatarUrl?: string;
  joinedDate: string;
}

export type CropCategory =
  | 'grains'
  | 'sugarcane'
  | 'horticulture'
  | 'vegetables'
  | 'plantation'
  | 'pulses'
  | 'spices';

export interface CropListing {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  district: string;
  taluk: string;
  village: string;
  marketNearby: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  cropNameEn: string;
  cropNameKn: string;
  category: CropCategory;
  variety: string;
  quantity: number;
  unit: QuantityUnit;
  askingPricePerUnit: number;
  minOrderQuantity: number;
  harvestDate: string;
  availableFrom: string;
  imageUrl: string;
  organicCertified: boolean;
  descriptionEn: string;
  descriptionKn: string;
  status: 'available' | 'reserved' | 'sold_out' | 'unlisted';
  createdAt: string;
  viewsCount: number;
  enquiriesCount: number;
  isFlagged?: boolean;
}

export interface PurchaseEnquiry {
  id: string;
  cropId: string;
  cropNameEn: string;
  cropNameKn: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerType: BuyerType;
  requestedQuantity: number;
  unit: QuantityUnit;
  offeredPricePerUnit: number;
  totalAmount: number;
  message: string;
  deliveryAddress: string;
  deliveryDistrict: string;
  preferredDeliveryDate: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  rejectionReason?: string;
  createdAt: string;
}

export interface MandiMarketPrice {
  id: string;
  commodityEn: string;
  commodityKn: string;
  marketNameEn: string;
  marketNameKn: string;
  districtEn: string;
  districtKn: string;
  arrivalDate: string;
  minPrice: number;    // per quintal (₹)
  maxPrice: number;    // per quintal (₹)
  modalPrice: number;  // per quintal (₹)
  unit: 'quintal';
  sourceName: string;
  isDemoData: boolean;
  lastUpdated: string;
}

export interface DisputeReport {
  id: string;
  reporterId: string;
  reporterName: string;
  reporterRole: UserRole;
  targetType: 'listing' | 'farmer' | 'buyer';
  targetId: string;
  targetTitle: string;
  reason: string;
  details: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  createdAt: string;
  resolutionNotes?: string;
}
