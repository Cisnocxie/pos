'use strict';

function printReceipt(tags) {
    let itemNum = countItemNum(tags);
    let itemDetail = getItemDetail(itemNum, loadAllItems());
    let addItemDiscount = getItemDiscount(itemDetail, loadPromotions());
    let addItemLittlePrice = countItemLittlePrice(addItemDiscount);
    let price = countTotalPrice(addItemLittlePrice);
    let totalPrice = price.totalPrice;
    let savePrice = price.savePrice;
    console.log(makeReceipt(addItemLittlePrice, totalPrice, savePrice));
}

function countItemNum(tags) {
    let itemNum = {};
    let tagsCopy = JSON.parse(JSON.stringify(tags));
    for (let i = 0; i < tagsCopy.length; i++) {
        let num = 1;
        if (tagsCopy[i].indexOf('-') != -1) {
            num = parseFloat(tagsCopy[i].slice(tagsCopy[i].indexOf('-') + 1));
            tagsCopy[i] = tagsCopy[i].slice(0, tagsCopy[i].indexOf('-'));
        }
        if (!itemNum[tagsCopy[i]]) {
            itemNum[tagsCopy[i]] = num;
        } else {
            itemNum[tagsCopy[i]] += num;
        }
    }
    return itemNum;
}

function getItemDetail(itemNum, allItems) {
    let itemDetail = [];
    let allItemDetail = JSON.parse(JSON.stringify(allItems));
    for (let i = 0; i < allItemDetail.length; i++) {
        if (itemNum[allItemDetail[i].barcode]) {
            allItemDetail[i].num = itemNum[allItemDetail[i].barcode];
            itemDetail.push(allItemDetail[i]);
        }
    }
    return itemDetail;
}

function getItemDiscount(itemDetail, promotion) {
    let addItemDiscount = JSON.parse(JSON.stringify(itemDetail));
    for (let i = 0; i < addItemDiscount.length; i++) {
        let promote = false;
        for (let j = 0; j < promotion[0].barcodes.length; j++) {
            if (addItemDiscount[i].barcode === promotion[0].barcodes[j]) {
                if (addItemDiscount[i].num > 2) {
                    addItemDiscount[i].discount = addItemDiscount[i].price;
                    promote = true;
                }
            }
        }
        if (!promote) {
            addItemDiscount[i].discount = 0;
        }
    }
    return addItemDiscount;
}

function countItemLittlePrice(addItemDiscount) {
    let addItemLittlePrice = JSON.parse(JSON.stringify(addItemDiscount));
    for (let i = 0; i < addItemLittlePrice.length; i++) {
        addItemLittlePrice[i].littlePrice = addItemLittlePrice[i].price * addItemLittlePrice[i].num - addItemLittlePrice[i].discount;
    }
    return addItemLittlePrice;
}

function countTotalPrice(itemDetail) {
    let totalPrice = 0;
    let savePrice = 0;
    for (let i = 0; i < itemDetail.length; i++) {
        totalPrice += itemDetail[i].littlePrice;
        savePrice += itemDetail[i].discount;
    }
    return {totalPrice:totalPrice, savePrice:savePrice};
}

function makeReceipt(itemDetail, totalPrice, savePrice) {
    let receipt = '';
    receipt += '***<没钱赚商店>收据***\n';
    for (let i = 0; i < itemDetail.length; i++) {
        receipt += '名称：' + itemDetail[i].name + '，数量：' + itemDetail[i].num + itemDetail[i].unit + '，单价：' + itemDetail[i].price.toFixed(2) + '(元)，小计：' + itemDetail[i].littlePrice.toFixed(2) + '(元)\n';
    }
    receipt += '----------------------\n';
    receipt += '总计：' + totalPrice.toFixed(2) + '(元)\n';
    receipt += '节省：' + savePrice.toFixed(2) + '(元)\n';
    receipt += '**********************';
    return receipt;
}