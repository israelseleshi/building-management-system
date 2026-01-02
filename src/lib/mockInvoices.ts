export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Invoice {
  id: string
  invoiceNumber: string
  date: string
  dueDate: string
  status: "Paid" | "Pending" | "Overdue"
  billTo: {
    name: string
    address: string
    email: string
  }
  billFrom: {
    name: string
    address: string
    email: string
  }
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
}

export const mockInvoices: Invoice[] = [
  {
    id: "inv_001",
    invoiceNumber: "INV-2024-001",
    date: "2024-01-01",
    dueDate: "2024-01-05",
    status: "Paid",
    billTo: {
      name: "Selam Beauty Shop",
      address: "Bole Atlas, Addis Ababa, Ethiopia",
      email: "info@selambeauty.et",
    },
    billFrom: {
      name: "Building Management System",
      address: "Bole Road, Addis Ababa, Ethiopia",
      email: "billing@bms.et",
    },
    items: [
      {
        id: "item_1",
        description: "Monthly Rent - January 2024",
        quantity: 1,
        unitPrice: 50000,
        total: 50000,
      },
      {
        id: "item_2",
        description: "Utility Fee - Water",
        quantity: 1,
        unitPrice: 1500,
        total: 1500,
      },
      {
        id: "item_3",
        description: "Utility Fee - Waste Management",
        quantity: 1,
        unitPrice: 500,
        total: 500,
      },
    ],
    subtotal: 52000,
    tax: 7800, // 15% VAT
    total: 59800,
  },
  {
    id: "inv_002",
    invoiceNumber: "INV-2024-002",
    date: "2024-02-01",
    dueDate: "2024-02-05",
    status: "Paid",
    billTo: {
      name: "Nano Computing ICT",
      address: "Piassa, Churchill Avenue, Addis Ababa, Ethiopia",
      email: "contact@nanocomputing.et",
    },
    billFrom: {
      name: "Building Management System",
      address: "Bole Road, Addis Ababa, Ethiopia",
      email: "billing@bms.et",
    },
    items: [
      {
        id: "item_1",
        description: "Monthly Rent - February 2024",
        quantity: 1,
        unitPrice: 45000,
        total: 45000,
      },
      {
        id: "item_2",
        description: "Internet Service Charge",
        quantity: 1,
        unitPrice: 3000,
        total: 3000,
      },
    ],
    subtotal: 48000,
    tax: 7200,
    total: 55200,
  },
  {
    id: "inv_003",
    invoiceNumber: "INV-2024-003",
    date: "2024-03-01",
    dueDate: "2024-03-05",
    status: "Paid",
    billTo: {
      name: "Habesha Restaurant",
      address: "Kazanchis, Addis Ababa, Ethiopia",
      email: "manager@habesharestaurant.et",
    },
    billFrom: {
      name: "Building Management System",
      address: "Bole Road, Addis Ababa, Ethiopia",
      email: "billing@bms.et",
    },
    items: [
      {
        id: "item_1",
        description: "Commercial Space Rent - March 2024",
        quantity: 1,
        unitPrice: 75000,
        total: 75000,
      },
    ],
    subtotal: 75000,
    tax: 11250,
    total: 86250,
  },
  {
    id: "inv_004",
    invoiceNumber: "INV-2024-004",
    date: "2024-04-01",
    dueDate: "2024-04-05",
    status: "Pending",
    billTo: {
      name: "Ethio Telecom Shop",
      address: "Mexico Square, Addis Ababa, Ethiopia",
      email: "mexico.shop@ethiotelecom.et",
    },
    billFrom: {
      name: "Building Management System",
      address: "Bole Road, Addis Ababa, Ethiopia",
      email: "billing@bms.et",
    },
    items: [
      {
        id: "item_1",
        description: "Retail Space Rent - April 2024",
        quantity: 1,
        unitPrice: 60000,
        total: 60000,
      },
    ],
    subtotal: 60000,
    tax: 9000,
    total: 69000,
  },
  {
    id: "inv_005",
    invoiceNumber: "INV-2024-005",
    date: "2024-05-01",
    dueDate: "2024-05-05",
    status: "Overdue",
    billTo: {
      name: "Zemen Bank ATM",
      address: "Bole, Addis Ababa, Ethiopia",
      email: "atm.ops@zemenbank.com",
    },
    billFrom: {
      name: "Building Management System",
      address: "Bole Road, Addis Ababa, Ethiopia",
      email: "billing@bms.et",
    },
    items: [
      {
        id: "item_1",
        description: "ATM Space Lease - May 2024",
        quantity: 1,
        unitPrice: 15000,
        total: 15000,
      },
    ],
    subtotal: 15000,
    tax: 2250,
    total: 17250,
  },
]
