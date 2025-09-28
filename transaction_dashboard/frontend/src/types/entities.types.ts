// frontend/src/types/entities.types.ts
// Types para entidades de negocio del proyecto

// Transaction entity
export interface Transaction {
  id: string
  timestamp: string
  hour: number
  customerId?: string
  productId: string
  quantity: number
  unitPrice: number
  totalAmount: number
  paymentMethod: PaymentMethod
  isReturned?: boolean
  returnReason?: string
  batchId?: string
  locationId?: string
  createdAt: string
  updatedAt: string
}

// Customer entity
export interface Customer {
  id: string
  customerType: CustomerType
  isVip: boolean
  totalTransactions: number
  totalSpent: number
  firstPurchase?: string
  lastPurchase?: string
  averageTicket: number
  preferredPaymentMethod?: PaymentMethod
  riskScore?: number
  createdAt: string
  updatedAt: string
}

// Product entity
export interface Product {
  id: string
  name: string
  category: string
  subCategory?: string
  price: number
  cost?: number
  margin?: number
  isActive: boolean
  stockLevel?: number
  minStockLevel?: number
  maxStockLevel?: number
  supplier?: string
  sku?: string
  barcode?: string
  createdAt: string
  updatedAt: string
}

// Inventory log entity
export interface InventoryLog {
  id: string
  productId: string
  changeType: InventoryChangeType
  quantity: number
  previousLevel: number
  newLevel: number
  reason?: string
  batchId?: string
  expirationDate?: string
  costPerUnit?: number
  userId?: string
  createdAt: string
}

// Enums
export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  CASH = 'CASH',
  VOUCHER = 'VOUCHER'
}

export enum CustomerType {
  VIP = 'VIP',
  REGULAR = 'REGULAR',
  ANONYMOUS = 'ANONYMOUS'
}

export enum InventoryChangeType {
  PURCHASE = 'PURCHASE',
  SALE = 'SALE',
  ADJUSTMENT = 'ADJUSTMENT',
  EXPIRED = 'EXPIRED',
  DAMAGED = 'DAMAGED',
  RESTOCK = 'RESTOCK'
}

// Additional business types

// Batch/Lote for expiration control (Caso 2)
export interface ProductBatch {
  id: string
  productId: string
  expirationDate: string
  quantity: number
  costPerUnit: number
  status: BatchStatus
  daysUntilExpiration: number
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Low'
  actionRequired?: string
  createdAt: string
}

export enum BatchStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CRITICAL = 'CRITICAL', // 1-3 días
  URGENT = 'URGENT'      // 4-7 días
}

// Price analysis (Caso 3)
export interface PriceAnalysis {
  productId: string
  currentPrice: number
  averagePrice: number
  priceCategory: 'Premium' | 'Medium' | 'Economic' | 'Luxury'
  competitorPrice?: number
  recommendedPrice?: number
  discountApplied: number
  potentialRevenue: number
}

// Inventory status (Caso 5)
export interface InventoryStatus {
  productId: string
  currentStock: number
  minStock: number
  maxStock: number
  daysUntilStockout: number
  reorderQuantity: number
  status: 'Critical' | 'Low' | 'Normal' | 'Excess'
  priority: 'Immediate' | 'High' | 'Medium' | 'Low'
}

// Return analysis (Caso 7)
export interface ReturnPattern {
  customerId?: string
  productId: string
  returnCount: number
  returnRate: number
  timeBetweenPurchaseReturn: number // en minutos
  suspiciousPattern: boolean
  riskScore: number
  flagReason?: string
}

// Location/Store entity (si aplica)
export interface Location {
  id: string
  name: string
  address: string
  city: string
  region: string
  isActive: boolean
  managerName?: string
  openingHours?: string
  timezone?: string
}

// User entity (para futuro auth)
export interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  permissions: Permission[]
  lastLogin?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  ANALYST = 'ANALYST',
  VIEWER = 'VIEWER'
}

export enum Permission {
  READ_DASHBOARD = 'READ_DASHBOARD',
  READ_TRANSACTIONS = 'READ_TRANSACTIONS',
  READ_CUSTOMERS = 'READ_CUSTOMERS',
  READ_INVENTORY = 'READ_INVENTORY',
  EXPORT_DATA = 'EXPORT_DATA',
  MANAGE_USERS = 'MANAGE_USERS'
}