export const InvoicePaymentStatus = {
  INITIAL: 1,
  PAID: 2,
  PARTIALLY_PAID: 3,
  NOT_PAID_OVERDUE: 4,
} as const

export const InvoicePaymentStatusEnum = {
  [InvoicePaymentStatus.INITIAL]: `enums.invoice.payment_status.${InvoicePaymentStatus.INITIAL}`,
  [InvoicePaymentStatus.PAID]: `enums.invoice.payment_status.${InvoicePaymentStatus.PAID}`,
  [InvoicePaymentStatus.PARTIALLY_PAID]: `enums.invoice.payment_status.${InvoicePaymentStatus.PARTIALLY_PAID}`,
  [InvoicePaymentStatus.NOT_PAID_OVERDUE]: `enums.invoice.payment_status.${InvoicePaymentStatus.NOT_PAID_OVERDUE}`,
} as const;

export type InvoicePaymentStatusType = (typeof InvoicePaymentStatus)[keyof typeof InvoicePaymentStatus];
export type InvoicePaymentStatusEnumType = (typeof InvoicePaymentStatusEnum)[keyof typeof InvoicePaymentStatusEnum];
