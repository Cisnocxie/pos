'use strict';

const main = require('../main/main');
const fixtures = require('./fixtures');
const printReceipt = main.printReceipt;
const countItemNum = main.countItemNum;
const getItemDetail = main.getItemDetail;
const getItemDiscount = main.getItemDiscount;
const countItemLittlePrice = main.countItemLittlePrice;
const countTotalPrice = main.countTotalPrice;
const loadAllItems = fixtures.loadAllItems;
const loadPromotions = fixtures.loadPromotions;

const tags = [
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000003-2.5',
  'ITEM000005',
  'ITEM000005-2',
];
let itemNum = countItemNum(tags);
let itemDetail = getItemDetail(itemNum, loadAllItems());
let addItemDiscount = getItemDiscount(itemDetail, loadPromotions());
let addItemLittlePrice = countItemLittlePrice(addItemDiscount);
let price = countTotalPrice(addItemLittlePrice);

describe('pos', () => {

  it('should print text', () => {

    spyOn(console, 'log');

    printReceipt(tags);

    const expectText = `***<没钱赚商店>收据***
名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)
名称：荔枝，数量：2.5斤，单价：15.00(元)，小计：37.50(元)
名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)
----------------------
总计：58.50(元)
节省：7.50(元)
**********************`;

    expect(console.log).toHaveBeenCalledWith(expectText);
  });
});

describe('pos', () => {

  it('countItemNum(tags) text', () => {

    const expectText = `{"ITEM000001":5,"ITEM000003":2.5,"ITEM000005":3}`;

    expect(JSON.stringify(itemNum)).toEqual(expectText);
  });
});

describe('pos', () => {

  it('getItemDetail(itemNum, loadAllItems()) text', () => {

    const expectText = `[{"barcode":"ITEM000001","name":"雪碧","unit":"瓶","price":3,"num":5},{"barcode":"ITEM000003","name":"荔枝","unit":"斤","price":15,"num":2.5},{"barcode":"ITEM000005","name":"方便面","unit":"袋","price":4.5,"num":3}]`;

    expect(JSON.stringify(itemDetail)).toEqual(expectText);
  });
});

describe('pos', () => {

  it('getItemDiscount(itemDetail, loadPromotions()) text', () => {

    const expectText = `[{"barcode":"ITEM000001","name":"雪碧","unit":"瓶","price":3,"num":5,"discount":3},{"barcode":"ITEM000003","name":"荔枝","unit":"斤","price":15,"num":2.5,"discount":0},{"barcode":"ITEM000005","name":"方便面","unit":"袋","price":4.5,"num":3,"discount":4.5}]`;

    expect(JSON.stringify(addItemDiscount)).toEqual(expectText);
  });
});

describe('pos', () => {

  it('countItemLittlePrice(addItemDiscount) text', () => {

    const expectText = `[{"barcode":"ITEM000001","name":"雪碧","unit":"瓶","price":3,"num":5,"discount":3,"littlePrice":12},{"barcode":"ITEM000003","name":"荔枝","unit":"斤","price":15,"num":2.5,"discount":0,"littlePrice":37.5},{"barcode":"ITEM000005","name":"方便面","unit":"袋","price":4.5,"num":3,"discount":4.5,"littlePrice":9}]`;

    expect(JSON.stringify(addItemLittlePrice)).toEqual(expectText);
  });
});

describe('pos', () => {

  it('countTotalPrice(addItemLittlePrice) text', () => {

    const expectText = `{"totalPrice":58.5,"savePrice":7.5}`;

    expect(JSON.stringify(price)).toEqual(expectText);
  });
});