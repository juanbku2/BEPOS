// src/types/Invoice.ts

export interface InvoiceRequest {
  saleId: number;
  rfc: string;
  razonSocial: string;
  usoCfdi: string;
  codigoPostal: string;
  email?: string;
}

export interface InvoiceResponse {
  invoiceId: string;
  status: string;
  message: string;
  // Add other relevant fields for invoice response
}
