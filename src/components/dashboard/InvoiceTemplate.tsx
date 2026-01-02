import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { Invoice } from '@/lib/mockInvoices';

// Register fonts if needed, otherwise use default
// Font.register({ family: 'Inter', src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.ttf' });

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFBF0', // Light cream/ivory background
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#7D8B6F', // Sage green
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7D8B6F', // Sage green
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#333', // Darker text for visibility
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  column: {
    flexDirection: 'column',
    width: '45%',
  },
  label: {
    fontSize: 10,
    color: '#333', // Darker text
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  text: {
    fontSize: 12,
    marginBottom: 2,
    color: '#000',
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    padding: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    padding: 8,
  },
  tableCell: {
    fontSize: 10,
    color: '#000',
  },
  descriptionCell: {
    width: '50%',
  },
  numericCell: {
    width: '16.66%',
    textAlign: 'right',
  },
  totals: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginTop: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '40%',
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 12,
    color: '#333',
  },
  totalValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#666',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    padding: 8,
    alignSelf: 'flex-start',
    marginTop: 10,
    borderRadius: 4,
    color: '#FFFFFF',
  },
  statusPaid: {
    backgroundColor: '#10B981', // Emerald 500
  },
  statusPending: {
    backgroundColor: '#F59E0B', // Amber 500
  },
  statusOverdue: {
    backgroundColor: '#EF4444', // Red 500
  },
});

interface InvoiceTemplateProps {
  invoice: Invoice;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-ET', { style: 'currency', currency: 'ETB' }).format(amount);
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'Paid': return styles.statusPaid;
    case 'Pending': return styles.statusPending;
    case 'Overdue': return styles.statusOverdue;
    default: return {};
  }
};

const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({ invoice }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>INVOICE</Text>
          <Text style={styles.subtitle}>Building Management System</Text>
          <Text style={styles.subtitle}>{invoice.invoiceNumber}</Text>
        </View>

        {/* Dates & Status */}
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Date Issued:</Text>
            <Text style={styles.text}>{invoice.date}</Text>
            <Text style={[styles.label, { marginTop: 10 }]}>Due Date:</Text>
            <Text style={styles.text}>{invoice.dueDate}</Text>
          </View>
          <View style={[styles.column, { alignItems: 'flex-end' }]}>
             <Text style={[styles.status, getStatusStyle(invoice.status)]}>{invoice.status}</Text>
          </View>
        </View>

        {/* Bill To / From */}
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Bill From:</Text>
            <Text style={[styles.text, { fontWeight: 'bold' }]}>{invoice.billFrom.name}</Text>
            <Text style={styles.text}>{invoice.billFrom.address}</Text>
            <Text style={styles.text}>{invoice.billFrom.email}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Bill To:</Text>
            <Text style={[styles.text, { fontWeight: 'bold' }]}>{invoice.billTo.name}</Text>
            <Text style={styles.text}>{invoice.billTo.address}</Text>
            <Text style={styles.text}>{invoice.billTo.email}</Text>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.descriptionCell, { fontWeight: 'bold' }]}>Description</Text>
            <Text style={[styles.tableCell, styles.numericCell, { fontWeight: 'bold' }]}>Quantity</Text>
            <Text style={[styles.tableCell, styles.numericCell, { fontWeight: 'bold' }]}>Unit Price</Text>
            <Text style={[styles.tableCell, styles.numericCell, { fontWeight: 'bold' }]}>Total</Text>
          </View>
          {invoice.items.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.descriptionCell]}>{item.description}</Text>
              <Text style={[styles.tableCell, styles.numericCell]}>{item.quantity}</Text>
              <Text style={[styles.tableCell, styles.numericCell]}>{formatCurrency(item.unitPrice)}</Text>
              <Text style={[styles.tableCell, styles.numericCell]}>{formatCurrency(item.total)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>{formatCurrency(invoice.subtotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax (15% VAT):</Text>
            <Text style={styles.totalValue}>{formatCurrency(invoice.tax)}</Text>
          </View>
          <View style={[styles.totalRow, { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 5 }]}>
            <Text style={[styles.totalLabel, { color: '#000', fontWeight: 'bold' }]}>Total:</Text>
            <Text style={[styles.totalValue, { fontSize: 14 }]}>{formatCurrency(invoice.total)}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Thank you for your business. Please make checks payable to Building Management System.</Text>
          <Text>For questions concerning this invoice, please contact billing@bms.et</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoiceTemplate;
