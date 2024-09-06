import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Order, OrderItem } from './types';

const styles = StyleSheet.create({
  page: { 
    padding: 10, 
    width: '80mm',
    height: '200mm',
    flexDirection: 'column',
  },
  title: { 
    fontSize: 8,
    marginBottom: 10, 
    textAlign: 'center',
  },
  field: { 
    marginBottom: 5, 
  },
  label: { 
    fontWeight: 'bold', 
    fontSize: 6,
  },
  value: {
    fontSize: 6,
  },
  total: {
    marginTop: 10,
    fontSize: 8,
    fontWeight: 'bold',
  }
});

interface PDFDocumentProps {
  order: Order;
}

const PDFDocument: React.FC<PDFDocumentProps> = ({ order }) => (
  <Document>
    <Page size={{ width: 80, height: 200 }} style={styles.page}>
      <Text style={styles.title}>Factura</Text>
      <Text style={styles.field}>Mesa: {order.tableId}</Text>
      {order.items.map((item: OrderItem, index: number) => (
        <View key={index} style={styles.field}>
          <Text style={styles.label}>{item.name}</Text>
          <Text style={styles.value}>
            {item.quantity} x ${item.price} = ${item.quantity * item.price}
          </Text>
          {item.observations && (
            <Text style={styles.value}>Obs: {item.observations}</Text>
          )}
        </View>
      ))}
      <Text style={styles.total}>
        Total: ${order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)}
      </Text>
    </Page>
  </Document>
);

export default PDFDocument;