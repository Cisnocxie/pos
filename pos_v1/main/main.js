'use strict';

function printReceipt(tags) {
    let itemNum = countItemNum(tags);
    let itemDetail = getItemDetail(itemNum, loadAllItems());
    getItemDiscount(itemDetail, loadPromotions());
    countItemLittlePrice(itemDetail);
    let price = countTotalPrice(itemDetail);
    let totalPrice = price.totalPrice;
    let savePrice = price.savePrice;
    console.log(makeReceipt(itemDetail, totalPrice, savePrice));
}

function countItemNum(tags) {
    let itemNum = {};
    for (let i = 0; i < tags.length; i++) {
        let num = 1;
        if (tags[i].indexOf('-') != -1) {
            num = parseFloat(tags[i].slice(tags[i].indexOf('-') + 1));
            tags[i] = tags[i].slice(0, tags[i].indexOf('-'));
        }
        if (!itemNum['\'' + tags[i] + '\'']) {
            itemNum['\'' + tags[i] + '\''] = num;
        } else {
            itemNum['\'' + tags[i] + '\''] += num;
        }
    }
    console.info(itemNum);
    return itemNum;
}

function getItemDetail(itemNum, allItemDetail) {
    let itemDetail = [];
    for (let i = 0; i < allItemDetail.length; i++) {
        if (itemNum['\'' + allItemDetail[i].barcode + '\'']) {
            allItemDetail[i].num = itemNum['\'' + allItemDetail[i].barcode + '\''];
            itemDetail.push(allItemDetail[i]);
        }
    }
    console.info(itemDetail);
    return itemDetail;
}

function getItemDiscount(itemDetail, promotion) {
    for (let i = 0; i < itemDetail.length; i++) {
        let promote = false;
        for (let j = 0; j < promotion[0].barcodes.length; j++) {
            if (itemDetail[i].barcode === promotion[0].barcodes[j]) {
                itemDetail[i].discount = itemDetail[i].price;
                promote = true;
            }
        }
        if (!promote) {
            itemDetail[i].discount = 0;
        }
    }
    console.info(itemDetail);
}

function countItemLittlePrice(itemDetail) {
    for (let i = 0; i < itemDetail.length; i++) {
        itemDetail[i].littlePrice = itemDetail[i].price * itemDetail[i].num - itemDetail[i].discount;
    }
    console.info(itemDetail);
}
function countTotalPrice(itemDetail) {
    let totalPrice = 0;
    let savePrice = 0;
    for (let i = 0; i < itemDetail.length; i++) {
        totalPrice += itemDetail[i].littlePrice;
        savePrice += itemDetail[i].discount;
    }
    console.info({totalPrice:totalPrice, savePrice:savePrice});
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