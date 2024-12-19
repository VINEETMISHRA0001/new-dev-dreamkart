// const axios = require('axios');
// let data = JSON.stringify({
//   Request: {
//     Consignee: {
//       AvailableDays: '',
//       AvailableTiming: '',
//       ConsigneeAddress1: 'C 20 Goner Road',
//       ConsigneeAddress2: 'Patasha Factory ',
//       ConsigneeAddress3: 'Jaipur',
//       ConsigneeAddressType: '',
//       ConsigneeAddressinfo: '',
//       ConsigneeAttention: 'ANIL',
//       ConsigneeEmailID: 'aniljangidads@gmail.com',
//       ConsigneeFullAddress: '',
//       ConsigneeGSTNumber: '',
//       ConsigneeLatitude: '',
//       ConsigneeLongitude: '',
//       ConsigneeMaskedContactNumber: '',
//       ConsigneeMobile: '8386893777',
//       ConsigneeName: 'ANIL JANGID',
//       ConsigneePincode: '302003',
//       ConsigneeTelephone: '',
//     },
//     Returnadds: {
//       ManifestNumber: '',
//       ReturnAddress1: 'Plot no 1234 Bamnauli',
//       ReturnAddress2: 'Test RTO Addr2',
//       ReturnAddress3: 'Test RTO Addr3',
//       ReturnAddressinfo: '',
//       ReturnContact: 'ABCD',
//       ReturnEmailID: 'testemail@bluedart.com',
//       ReturnLatitude: '',
//       ReturnLongitude: '',
//       ReturnMaskedContactNumber: '',
//       ReturnMobile: '9995554337',
//       ReturnPincode: '100077',
//       ReturnTelephone: '',
//     },
//     Services: {
//       AWBNo: '',
//       ActualWeight: '0.50',
//       CollectableAmount: 0,
//       Commodity: {
//         CommodityDetail1: '5011100014',
//         CommodityDetail2: '5011100014',
//         CommodityDetail3: '5011100014',
//       },
//       CreditReferenceNo: '90005423738380758',
//       CreditReferenceNo2: '',
//       CreditReferenceNo3: '',
//       CurrencyCode: '',
//       DeclaredValue: 35672,
//       DeliveryTimeSlot: '',
//       Dimensions: [
//         {
//           Breadth: 10,
//           Count: 1,
//           Height: 10,
//           Length: 10,
//         },
//       ],
//       FavouringName: '',
//       ForwardAWBNo: '',
//       ForwardLogisticCompName: '',
//       InsurancePaidBy: '',
//       InvoiceNo: '',
//       IsChequeDD: '',
//       IsDedicatedDeliveryNetwork: false,
//       IsForcePickup: false,
//       IsPartialPickup: false,
//       IsReversePickup: false,
//       ItemCount: 1,
//       OTPBasedDelivery: '0',
//       OTPCode: '',
//       Officecutofftime: '',
//       PDFOutputNotRequired: true,
//       PackType: '',
//       ParcelShopCode: '',
//       PayableAt: '',
//       PickupDate: '/Date(1733564268000)/',
//       PickupMode: '',
//       PickupTime: '0800',
//       PickupType: '',
//       PieceCount: '1',
//       PreferredPickupTimeSlot: '',
//       ProductCode: 'A',
//       ProductFeature: '',
//       ProductType: 1,
//       RegisterPickup: true,
//       SpecialInstruction: '',
//       SubProductCode: 'P',
//       TotalCashPaytoCustomer: 0,
//       itemdtl: [
//         {
//           CGSTAmount: 0,
//           HSCode: '',
//           IGSTAmount: 0,
//           IGSTRate: 0,
//           Instruction: '',
//           InvoiceDate: '/Date(1733564268000)/',
//           InvoiceNumber: '121212',
//           ItemID: 'Test Item ID1',
//           ItemName: 'Test Item1',
//           ItemValue: 35672,
//           Itemquantity: 1,
//           PlaceofSupply: 'Gurgaon',
//           ProductDesc1: 'Test Item1',
//           ProductDesc2: 'Test Item1',
//           ReturnReason: '',
//           SGSTAmount: 0,
//           SKUNumber: '',
//           SellerGSTNNumber: 'Z2222222',
//           SellerName: 'GODHA ENTP',
//           TaxableAmount: 0,
//           TotalValue: 35672,
//           cessAmount: '0.0',
//           countryOfOrigin: 'IN',
//           docType: 'INV',
//           subSupplyType: 1,
//           supplyType: '0',
//         },
//       ],
//       noOfDCGiven: 0,
//     },
//     Shipper: {
//       CustomerAddress1: 'Model Town',
//       CustomerAddress2: 'Jagatpura',
//       CustomerAddress3: 'Jaipur',
//       CustomerAddressinfo: '',
//       CustomerCode: '940111',
//       CustomerEmailID: '',
//       CustomerGSTNumber: '',
//       CustomerLatitude: '',
//       CustomerLongitude: '',
//       CustomerMaskedContactNumber: '',
//       CustomerMobile: '7777777777',
//       CustomerName: 'Pravin Prakash Sangle',
//       CustomerPincode: '122002',
//       CustomerTelephone: '7777777777',
//       IsToPayCustomer: false,
//       OriginArea: 'GGN',
//       Sender: 'ANIL',
//       VendorCode: '125465',
//     },
//   },
//   Profile: {
//     LoginID: 'GG940111',
//     LicenceKey: 'kh7mnhqkmgegoksipxr0urmqesesseup',
//     Api_type: 'S',
//   },
// });

// let config = {
//   method: 'post',
//   maxBodyLength: Infinity,
//   url: 'https://apigateway-sandbox.bluedart.com/in/transportation/waybill/v1/GenerateWayBill',
//   headers: {
//     'content-type': 'application/json',
//     JWTToken:
//       'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdWJqZWN0LXN1YmplY3QiLCJhdWQiOlsiYXVkaWVuY2UxIiwiYXVkaWVuY2UyIl0sIkNsaWVudFNlY3JldCI6ImF3S3Z3empZbmh2VUdBWVQiLCJpc3MiOiJ1cm46XC9cL2FwaWdlZS1lZGdlLUpXVC1wb2xpY3ktdGVzdCIsIkNsaWVudElEIjoiaU1DWjFrckFHNFZBTGxPcVBzd0EwUEJUZ3lNR3N6NmsiLCJleHAiOjE3MzM4NDE4NjMsImlhdCI6MTczMzc1NTQ2MywianRpIjoiZjk0NGZiN2ItNGViNS00M2Q1LTllMTgtOTdiZGQ3Njg0ZjA4In0.cuhaR58DKQtFOng2GTGU28REgtDLCjMaJAuLpAX5P0E',
//   },
//   data: data,
// };

// axios
//   .request(config)
//   .then((response) => {
//     console.log(JSON.stringify(response.data));
//   })
//   .catch((error) => {
//     console.log(error);
//   });

const PDFDocument = require('pdfkit');
const axios = require('axios');
const fs = require('fs');

// Function to generate PDF waybill
export async function generateWaybill(orderData) {
  try {
    // Step 1: Call Blue Dart API
    const config = {
      method: 'post',
      url: 'https://apigateway-sandbox.bluedart.com/in/transportation/waybill/v1/GenerateWayBill',
      headers: {
        'content-type': 'application/json',
        JWTToken:
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdWJqZWN0LXN1YmplY3QiLCJhdWQiOlsiYXVkaWVuY2UxIiwiYXVkaWVuY2UyIl0sIkNsaWVudFNlY3JldCI6ImF3S3Z3empZbmh2VUdBWVQiLCJpc3MiOiJ1cm46XC9cL2FwaWdlZS1lZGdlLUpXVC1wb2xpY3ktdGVzdCIsIkNsaWVudElEIjoiaU1DWjFrckFHNFZBTGxPcVBzd0EwUEJUZ3lNR3N6NmsiLCJleHAiOjE3MzM4NDE4NjMsImlhdCI6MTczMzc1NTQ2MywianRpIjoiZjk0NGZiN2ItNGViNS00M2Q1LTllMTgtOTdiZGQ3Njg0ZjA4In0.cuhaR58DKQtFOng2GTGU28REgtDLCjMaJAuLpAX5P0E',
      },
      data: orderData,
    };

    const response = await axios.request(config);
    const waybillData = response.data.GenerateWayBillResult;

    // Step 2: Create PDF Waybill
    const doc = new PDFDocument();
    const filePath = `waybill-${waybillData.AWBNo}.pdf`;
    doc.pipe(fs.createWriteStream(filePath));

    // Add header
    doc.fontSize(20).text('Waybill', { align: 'center' });

    // Add shipment details
    doc.fontSize(12).moveDown().text(`AWB No: ${waybillData.AWBNo}`);
    doc.text(`Consignee Name: ${orderData.Request.Consignee.ConsigneeName}`);
    doc.text(
      `Consignee Address: ${orderData.Request.Consignee.ConsigneeAddress1}, ${orderData.Request.Consignee.ConsigneeAddress3}`
    );
    doc.text(`Shipper Name: ${orderData.Request.Shipper.CustomerName}`);
    doc.text(
      `Shipper Address: ${orderData.Request.Shipper.CustomerAddress1}, ${orderData.Request.Shipper.CustomerAddress3}`
    );
    doc.text(`Item Count: ${orderData.Request.Services.ItemCount}`);
    doc.text(`Item Value: ${orderData.Request.Services.DeclaredValue}`);
    doc.text(
      `Pickup Date: ${new Date(
        orderData.Request.Services.PickupDate
      ).toLocaleDateString()}`
    );

    // Generate Barcode for AWBNo
    const bwipjs = require('bwip-js');
    const barcodeBuffer = await bwipjs.toBuffer({
      bcid: 'code128',
      text: waybillData.AWBNo,
      scale: 3,
      height: 10,
      includetext: true,
      textxalign: 'center',
    });
    doc.image(barcodeBuffer, {
      fit: [300, 150],
      align: 'center',
      valign: 'center',
    });

    // Finalize PDF
    doc.end();
    console.log(`Waybill generated: ${filePath}`);
    return filePath;
  } catch (error) {
    console.error('Error generating waybill:', error);
    throw error;
  }
}

// Example dynamic order data
const orderData = {
  Request: {
    Consignee: {
      ConsigneeAddress1: 'C 20 Goner Road',
      ConsigneeAddress3: 'Jaipur',
      ConsigneeName: 'ANIL JANGID',
      ConsigneePincode: '302003',
    },
    Services: {
      ItemCount: 1,
      DeclaredValue: 35672,
      PickupDate: '/Date(1733564268000)/',
    },
    Shipper: {
      CustomerName: 'Pravin Prakash Sangle',
      CustomerAddress1: 'Model Town',
      CustomerAddress3: 'Jaipur',
    },
  },
  Profile: {
    LoginID: 'GG940111',
    LicenceKey: 'kh7mnhqkmgegoksipxr0urmqesesseup',
    Api_type: 'S',
  },
};

// Call the function
