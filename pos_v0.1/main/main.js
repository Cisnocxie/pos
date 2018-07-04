'use strict';

function printReceipt(inputs) {
  let itemNumPrice = countItemNumPrice(inputs);
  let totalPrice = countTotalPrice(itemNumPrice);
  print(itemNumPrice, totalPrice);
}

function countItemNumPrice(inputs) {
  let itemNumPrice = [];
  for (let i = 0; i < inputs.length; i++) {
    let exist = false;
    for (let j = 0; j < itemNumPrice.length; j++) {
      if (inputs[i].barcode === itemNumPrice[j].barcode) {
        itemNumPrice[j].num++;
        itemNumPrice[j].littleprice += inputs[i].price;
        exist = true;
        break;
      }
    }
    if (!exist) {
      itemNumPrice.push(inputs[i]);
      itemNumPrice[itemNumPrice.length - 1].num = 1;
      itemNumPrice[itemNumPrice.length - 1].littleprice = inputs[i].price;
    }
  }
  return itemNumPrice;
}

function countTotalPrice(itemNumPrice) {
  let totalPrice = 0;
  for (let i = 0; i < itemNumPrice.length; i++) {
    totalPrice += itemNumPrice[i].littleprice;
  }
  return totalPrice;
}

function print(itemNumPrice, totalPrice) {
  let receipt = '***<没钱赚商店>收据***\n';
  for (let i = 0; i < itemNumPrice.length; i++) {
    receipt += '名称：' + itemNumPrice[i].name + '，数量：' + itemNumPrice[i].num + itemNumPrice[i].unit + '，单价：' + itemNumPrice[i].price + '.00(元)，小计：' + itemNumPrice[i].littleprice + '.00(元)\n';
  }
  receipt += '----------------------\n';
  receipt += '总计：' + totalPrice + '.00(元)\n';
  receipt += '**********************';
  console.log(receipt);
}