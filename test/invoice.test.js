'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const invoice = require('../lib/invoice');
const pricing = require('../lib/pricing');

function line(name, price, qty, hsn, gstRate) {
  return { name, price, qty, hsn, gstRate };
}

function assertCurrentFigures(order, expectedInvoice, expectedPricing) {
  const invoiceFigures = invoice.computeInvoiceFigures(order);
  const pricingFigures = pricing.computeTotals(order.items, order.coupon);

  assert.deepEqual(invoiceFigures, expectedInvoice);
  assert.equal(pricingFigures.subtotal, expectedPricing.subtotal);
  assert.equal(pricingFigures.discount, expectedPricing.discount);
  assert.equal(pricingFigures.tax, expectedPricing.tax);
  assert.equal(pricingFigures.total, expectedPricing.total);
}

test('INVOICE MATCHES CHECKOUT: order #1004 HSN slab and capped SAVE10 discount', function () {
  assertCurrentFigures({
    id: 1004,
    coupon: 'SAVE10',
    items: [line('Cold-Pressed Groundnut Oil 5L', 1120, 2, '1508')]
  }, {
    subtotal: 2240,
    discount: 150,
    tax: 104.5,
    cgst: 52.25,
    sgst: 52.25,
    total: 2194.5,
    rows: [
      { name: 'Cold-Pressed Groundnut Oil 5L', sku: '-', hsn: '1508', qty: 2, price: 1120, gstPercent: 5, line: 2240, lineTax: 104.5 }
    ]
  }, { subtotal: 2240, discount: 150, tax: 104.5, total: 2194.5 });
});

test('CURRENT BEHAVIOUR: order #1001 invoice figures for 5% and 12% lines without a coupon', function () {
  assertCurrentFigures({
    id: 1001,
    coupon: '',
    items: [line('Rice', 200, 1, '1006', 5), line('Ghee', 300, 1, '0405', 12)]
  }, {
    subtotal: 500,
    discount: 0,
    tax: 46,
    cgst: 23,
    sgst: 23,
    total: 546,
    rows: [
      { name: 'Rice', sku: '-', hsn: '1006', qty: 1, price: 200, gstPercent: 5, line: 200, lineTax: 10 },
      { name: 'Ghee', sku: '-', hsn: '0405', qty: 1, price: 300, gstPercent: 12, line: 300, lineTax: 36 }
    ]
  }, { subtotal: 500, discount: 0, tax: 46, total: 546 });
});

test('CURRENT BEHAVIOUR: order #1002 SAVE10 is applied before tax', function () {
  assertCurrentFigures({
    id: 1002,
    coupon: 'SAVE10',
    items: [line('Rice', 640, 1, '1006', 5), line('Sunflower oil', 190, 2, '1512', 5)]
  }, {
    subtotal: 1020,
    discount: 102,
    tax: 45.9,
    cgst: 22.95,
    sgst: 22.95,
    total: 963.9,
    rows: [
      { name: 'Rice', sku: '-', hsn: '1006', qty: 1, price: 640, gstPercent: 5, line: 640, lineTax: 28.8 },
      { name: 'Sunflower oil', sku: '-', hsn: '1512', qty: 2, price: 190, gstPercent: 5, line: 380, lineTax: 17.1 }
    ]
  }, { subtotal: 1020, discount: 102, tax: 45.9, total: 963.9 });
});

test('CURRENT BEHAVIOUR: order #1004 invoice applies the SAVE10 ₹150 cap', function () {
  assertCurrentFigures({
    id: 1004,
    coupon: 'SAVE10',
    items: [line('Rice', 1400, 1, '1006', 5), line('Ghee', 840, 1, '0405', 12)]
  }, {
    subtotal: 2240,
    discount: 150,
    tax: 159.36,
    cgst: 79.68,
    sgst: 79.68,
    total: 2249.36,
    rows: [
      { name: 'Rice', sku: '-', hsn: '1006', qty: 1, price: 1400, gstPercent: 5, line: 1400, lineTax: 65.31 },
      { name: 'Ghee', sku: '-', hsn: '0405', qty: 1, price: 840, gstPercent: 12, line: 840, lineTax: 94.05 }
    ]
  }, { subtotal: 2240, discount: 150, tax: 159.36, total: 2249.36 });
});

test('CURRENT BEHAVIOUR: order #1008 with 18% lines and no coupon', function () {
  assertCurrentFigures({
    id: 1008,
    coupon: '',
    items: [line('Tea', 200, 1, '0902', 18), line('Coffee', 300, 1, '0901', 18)]
  }, {
    subtotal: 500,
    discount: 0,
    tax: 90,
    cgst: 45,
    sgst: 45,
    total: 590,
    rows: [
      { name: 'Tea', sku: '-', hsn: '0902', qty: 1, price: 200, gstPercent: 18, line: 200, lineTax: 36 },
      { name: 'Coffee', sku: '-', hsn: '0901', qty: 1, price: 300, gstPercent: 18, line: 300, lineTax: 54 }
    ]
  }, { subtotal: 500, discount: 0, tax: 90, total: 590 });
});
