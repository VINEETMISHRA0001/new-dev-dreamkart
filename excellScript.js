const xlsx = require('xlsx');
const fs = require('fs');

// Sample product schema headers
const headers = [
  'SKU_ID',
  'Product Name',
  'Short Description',
  'Long Description',
  'Style ID',
  'MRP',
  'Price',
  'Discount',
  'GST',
  'HSN Code',
  'Inventory',
  'Combo Of',
  'Stitch Type',
  'Fabric',
  'Length',
  'Neck',
  'Occasion',
  'Ornamentation',
  'Pattern',
  'Sleeve Length',
  'Sleeve Styling',
  'Hemline',
  'Yoke Design',
  'Transparency',
  'Fit Type',
  'Weight',
  'Bust Size',
  'Shoulder Size',
  'Waist Size',
  'Hip Size',
  'Washing Care',
  'Closure Type',
  'Lining Material',
  'Embellishments',
  'Country of Origin',
  'Manufacturer Details',
  'Packer Details',
  'Importer Details',
  'Care Instructions',
  'Images',
  'Videos',
  'Variations (JSON)',
  'SEO Title',
  'SEO Description',
  'SEO Keywords',
  'Slug',
];

// Sample product data
//
const sampleData = [
  [
    'SKU12345',
    'Cotton Kurti',
    'A stylish cotton kurti for casual wear.',
    'Long sleeve, round neck kurti made of 100% cotton material.',
    'CK001',
    599,
    499,
    10,
    18,
    'HSN12345',
    100,
    'Kurti, Dupatta',
    'Ready to wear',
    'Cotton',
    'Knee-length',
    'Round Neck',
    'Casual',
    'Embroidery',
    'Printed',
    'Full',
    'Regular',
    'Straight',
    'Embroidered',
    'Opaque',
    'Regular Fit',
    300,
    36,
    40,
    30,
    'Machine Wash',
    'Zipper',
    'Cotton Lining',
    ['Sequins', 'Lace'],
    'India',
    'Manufactured by XYZ Pvt Ltd.',
    'Packed by ABC Ltd.',
    'Imported by DEF Ltd.',
    'Do not bleach',
    'image1.jpg, image2.jpg',
    'video1.mp4',
    // prettier-ignore
    '[{\"color\":\"Red\",\"colorImages\":[\"red1.jpg\",\"red2.jpg\"],\"sizes\":[{\"size\":\"M\",\"inventory\":50},{\"size\":\"L\",\"inventory\":30}]}]', // Correctly escaped JSON
    'Stylish Cotton Kurti',
    'Stylish cotton kurti for women with beautiful embroidery.',
    'kurti, cotton, casual, embroidery',
    'cotton-kurti-red',
  ],
  [
    'SKU12346',
    'Silk Saree',
    'A premium silk saree for festive occasions.',
    'Elegant silk saree with intricate patterns and a rich feel.',
    'SS001',
    1999,
    1499,
    20,
    12,
    'HSN12346',
    50,
    'Saree, Blouse',
    'Semi-stitched',
    'Silk',
    'Ankle-length',
    'V-neck',
    'Festive',
    'Mirror Work',
    'Striped',
    'Three-quarter',
    'Bell Sleeves',
    'Flared',
    'Printed',
    'Semi-Sheer',
    'Slim Fit',
    500,
    40,
    38,
    32,
    'Hand Wash Only',
    'Button',
    'Silk Lining',
    ['Sequins'],
    'India',
    'Manufactured by ABC Silk Co.',
    'Packed by PQR Ltd.',
    'Imported by XYZ Ltd.',
    'Iron on low heat',
    'image3.jpg, image4.jpg',
    'video2.mp4',
    // prettier-ignore
    '[{\"color\":\"Blue\",\"colorImages\":[\"blue1.jpg\",\"blue2.jpg\"],\"sizes\":[{\"size\":\"M\",\"inventory\":10},{\"size\":\"L\",\"inventory\":15}]}]', // Correctly escaped JSON
    'Premium Silk Saree',
    'Elegant silk saree perfect for festive events.',
    'saree, silk, festive, mirrorwork',
    'silk-saree-blue',
  ],
];

// Create an empty row for template data
const templateData = [...sampleData];

// Create a new workbook
const wb = xlsx.utils.book_new();

// Create a worksheet with the headers and sample data
const ws = xlsx.utils.aoa_to_sheet([headers, ...templateData]);

// Append the worksheet to the workbook
xlsx.utils.book_append_sheet(wb, ws, 'Products Template');

// Write the file to the disk
const filePath = './product_template_with_data.xlsx';
xlsx.writeFile(wb, filePath);

console.log(`Excel template with sample data created at: ${filePath}`);
