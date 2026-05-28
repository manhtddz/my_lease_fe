export const InvoicePaymentStatus = {
  INITIAL: 1,
  PAID: 2,
  PARTIALLY_PAID: 3,
  NOT_PAID_OVERDUE: 4,
} as const

export type InvoicePaymentStatusType = typeof InvoicePaymentStatus[keyof typeof InvoicePaymentStatus]
