// User interfaces
export interface User {
  user_id: number;
  email: string;
  name: string;
  phone?: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  role: "client" | "admin";
  created_at: Date;
  updated_at: Date;
}

// Shipment interfaces
export interface Shipment {
  shipment_id: number;
  tracking_number: string;
  user_id: number;

  // Sender info
  sender_name: string;
  sender_address: string;
  sender_city: string;
  sender_zip: string;
  sender_country: string;
  sender_phone: string;

  // Recipient info
  recipient_name: string;
  recipient_address: string;
  recipient_city: string;
  recipient_zip: string;
  recipient_country: string;
  recipient_phone: string;

  // Shipment details
  weight: number;
  dimensions?: string;
  package_type: string;
  service_type: string;
  special_instructions?: string;
  estimated_delivery_date?: Date;

  // Payment and status
  shipping_cost: number;
  status: ShipmentStatus;
  created_at: Date;
  updated_at: Date;
}

export interface CreateShipmentDTO {
  // User doesn't need to provide sender info, it will be populated from user profile
  // Only recipient info and shipment details
  recipient_name: string;
  recipient_address: string;
  recipient_city: string;
  recipient_zip: string;
  recipient_country: string;
  recipient_phone: string;

  weight: number;
  dimensions?: string;
  package_type: string;
  service_type: string;
  special_instructions?: string;
}

export interface UpdateShipmentStatusDTO {
  shipment_id: number;
  status: ShipmentStatus;
  location?: string;
  notes?: string;
}

export interface TrackingInfo {
  shipment_id: number;
  tracking_number: string;
  status: ShipmentStatus;
  sender_name: string;
  recipient_name: string;
  estimated_delivery_date?: Date;
  history: TrackingHistory[];
}

export interface TrackingHistory {
  history_id: number;
  shipment_id: number;
  status: ShipmentStatus;
  location?: string;
  notes?: string;
  created_at: Date;
}

export interface AuthResponse {
  token: string;
  user: {
    user_id: number;
    email: string;
    name: string;
    role: string;
  };
}

// src/types/index.ts
export interface TokenPayload {
  user_id: number;
  email: string;
  role: string;
}

export interface UserRegistration {
  name: string;
  email: string;
  password: string;
  address: string;
  phone?: string;
}

export interface UserLogin {
  email: string;
  password: string;
}
// Enums
export type ShipmentStatus =
  | "Pending"
  | "In Transit"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled"
  | "Returned";

// API response interface
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UserProfile {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface ShipmentDTO {
  id?: number; // Optional for new records (auto-generated)
  tracking_number: string;

  // Sender information
  user_id: number;
  sender_name: string;
  sender_email: string;
  sender_phone?: string;
  sender_address: string;
  sender_city: string;
  sender_state: string;
  sender_zip: string;
  sender_country: string;

  // Recipient details
  recipient_name: string;
  recipient_email: string;
  recipient_phone?: string;
  recipient_address: string;
  recipient_city: string;
  recipient_state: string;
  recipient_zip: string;
  recipient_country: string;

  // Shipment details
  package_type: string;
  weight: number;
  length?: number;
  width?: number;
  height?: number;
  description?: string;
  declared_value?: number;
  delivery_notes?: string;

  // Shipping options
  shipping_method: string;
  insurance: boolean;
  signature_required: boolean;

  // System fields
  estimated_delivery_date: Date;
  shipping_cost: number;
  special_instructions?: string;
  status: "pending" | "in_transit" | "delivered" | "cancelled";
  created_at?: Date;
  updated_at?: Date;
}
