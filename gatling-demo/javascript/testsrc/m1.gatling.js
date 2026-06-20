import { simulation, scenario, StringBody, pause, csv} from "@gatling.io/core";
import { http, status, bodyString } from "@gatling.io/http";
import { atOnceUsers, rampUsers, constantUsersPerSec } from "@gatling.io/core";
import { productDetails } from "../resources/productDetails";
const userFeeder = csv("testusers.csv").queue();

const BASE_URL = "https://performace-ecommerce-backend.up.railway.app";

const categories = [
  { id: 1002, name: "Gemstone Name" },
  { id: 1005, name: "Jewelry" },
  { id: 1006, name: "Semi-Mounts" },
  { id: 1007, name: "Findings"},
  { id: 1004, name: "Drops & Beads" }
];

const products = [
  "FJBIG55633","MOBIG27434","FJBIG55585", "SMBIG55418", "FJBIG37914","MOBIG27337","GSBIG9731", "FJBIG42626", "FJBIG29334","FJBIG28564", "FJBIG24210", "BIG0004",
  "FJBIG53192", "DPBIG24536", "MOBIG27338-1", "DPBIG4886", "DPBIG55402","DPBIG5610","MOBIG27369","DPBIG7096", "DPBIG8114", "DPBIG9040",
  "GSBIG130","FJBIG55571","MOBIG51995-2", "GSBIG207","FJBIG55572", "GSBIG197","SMBIG55417", "GSBIG214", "GSBIG330", "GSBIG338", "GSBIG467", "GSBIG500", "GSBIG174",
  "GSBIG178","FJBIG55570","MOBIG54179", "MOBIG27427","DPBIG55401","MOBIG27427-1", "MOBIG27337-2","MOBIG27434-1", "SMBIG53884","SMBIG43849",
  "SMBIG29749","SMBIG30740","GSBIG37197", "FJBIG55562", "SMBIG30807","DPBIG55399", "SMBIG32506", "SMBIG34758", "SMBIG35488", "GSBIG53183"
];

const searchQueries = [
  "FJBIG53192",
  "smbig29743", "ring setting charge", "pearl", "mother of pearl", "smbig29743", "copper", "GSBIG2316","GSBIG2955",
  "apatite", "FJBIG54703", "emarald", "FJBIG54142", "FJBIG54132"
];

const certificates = [
  { id: 1002, description: "Best in Gems Certificate ($15)", value: 15 },
  { id: 1001, description: "Universal Gem Lab ($75)", value: 75 },
  { id: 1003, description: "GIA Certificate ($200)", value: 200 }
];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// const cartFlow = scenario("Cart Stock Users")
//    .exec(
//     http("Homepage Header Footer")
//       .get(`${BASE_URL}/api/homepage/header-footer-content`)
//       .check(status().is(200))
//      )

//   .pause(1)

//    .exec(
//     http("Homepage Sections")
//       .get(`${BASE_URL}/api/homepage/homepage-sections`)
//       .check(status().is(200))
//   )

//     .pause(1)
//     .exec(session => {
//     const category = randomItem(categories);
//     const product = randomItem(products);
//     return session
//       .set("categoryId", category.id)
//       .set("categoryName", category.name)
//       .set("productCode", product);
//   })

//   .exec(
//     http("Category Listing")
//       .get(session =>
//         `${BASE_URL}/api/categoryproducts/categorylist/${session.get("categoryId")}?categoryName=${encodeURIComponent(session.get("categoryName"))}`
//       )
//       .check(status().is(200))
//   )
//   .pause(1)

//   .exec(
//     http("Category Filter Page 1")
//       .post(`${BASE_URL}/api/categoryproducts/filter/1`)
//       .header("Content-Type", "application/json")
//       .body(StringBody(`
// {
//   "categoryId": "#{categoryId}",
//   "categoryName": "#{categoryName}",
//   "gemstones": [],
//   "allGemstones": [],
//   "birthMonth": [],
//   "byPopularity": [],
//   "byRecipient": [],
//   "bySpecialOccasion": [],
//   "color": [],
//   "cut": [],
//   "dimensions": { "dimension": "", "itemWidth": "", "itemLength": "" },
//   "dropsBeads": [],
//   "gemstoneType": [],
//   "metalColor": [],
//   "metalPurity": [],
//   "metalType": [],
//   "otherSubCategory": [],
//   "price": { "min": 0, "max": 150000, "priceRange": "" },
//   "shape": [],
//   "shopBy": [],
//   "sort": 1,
//   "sortBy": "sortPrice",
//   "topGift": []
// }
// `))
//       .check(status().is(200))
//   )

//   .exec(
//     http("SubCategory Filter")
//       .post(session =>
//         `${BASE_URL}/api/attribute/subCategoryFilter/${session.get("categoryId")}/${encodeURIComponent(session.get("categoryName"))}`
//       )
//       .header("Content-Type", "application/json")
//       .body(StringBody(`
// {
//   "price": { "min": 0, "max": 150000 },
//   "dimension": { "itemWidth": "", "itemLength": "" }
// }
// `))
//       .check(status().is(200))
//   )

//   .exec(
//     http("Attribute Filter")
//       .post(session =>
//         `${BASE_URL}/api/attribute/filter/${session.get("categoryId")}`
//       )
//       .header("Content-Type", "application/json")
//       .body(StringBody(`
// {
//   "gemstoneId": [],
//   "subCategoryId": [],
//   "shopBy": [
//     { "name": "Vault Gem", "fieldName": "vaultGem" },
//     { "name": "Color Change Stone", "fieldName": "colorChangeStone" },
//     { "name": "Star Stone", "fieldName": "gStarStone" },
//     { "name": "Cats Eye", "fieldName": "gCatsEye" }
//   ],
//   "price": { "min": 0, "max": 150000 },
//   "dimension": { "itemWidth": "", "itemLength": "" },
//   "colorId": [],
//   "cutId": [],
//   "gemstoneType": [],
//   "metalColorId": [],
//   "metalId": [],
//   "metalPurity": [],
//   "monthId": [],
//   "packaging": [],
//   "popularityPairs": [],
//   "shapeId": [],
//   "beadsSubCategoryId": 0
// }
// `))
//     .check(status().is(200))
//   )
//   .pause(1)
//     .exec(
//     http("Product Detail")
//       .get(session =>
//         `${BASE_URL}/api/categoryproducts/code/${session.get("productCode")}`
//       )
//       .check(status().is(200))
//   )
//   .pause(1)

//   .exec(session => {

//     const randomSkus = [...products]
//       .sort(() => 0.5 - Math.random())
//       .slice(0, 3);

//     return session.set("cartSkusJson", JSON.stringify(randomSkus));
//   })
//   .pause(1)
// .exec(session => {
//   const viewedProduct = session.get("productCode");
//   const randomProduct = randomItem(products);
//   return session.set(
//     "cartSkusJson",
//     JSON.stringify([viewedProduct, randomProduct])
//   );
// })
// .pause(1)

//   .exec(
//     http("Cart Current Stock")
//       .post(`${BASE_URL}/api/cart/currentStock`)
//       .header("Content-Type", "application/json")
//       .body(StringBody("#{cartSkusJson}"))
//       .check(status().is(200))
//   )

// const categoryFlow = scenario("Category Filter Users")
//    .exec(
//     http("Homepage Header Footer")
//       .get(`${BASE_URL}/api/homepage/header-footer-content`)
//       .check(status().is(200))
//      )

//   .pause(1)

//    .exec(
//     http("Homepage Sections")
//       .get(`${BASE_URL}/api/homepage/homepage-sections`)
//       .check(status().is(200))
//     )

//     .pause(1)
//     .exec(session => {
//     const category = randomItem(categories);
//     const product = randomItem(products);
//     return session
//       .set("categoryId", category.id)
//       .set("categoryName", category.name)
//       .set("productCode", product);
//   })

//   .exec(
//     http("Category Listing")
//       .get(session =>
//         `${BASE_URL}/api/categoryproducts/categorylist/${session.get("categoryId")}?categoryName=${encodeURIComponent(session.get("categoryName"))}`
//       )
//       .check(status().is(200))
//   )
//   .pause(1)

//   .exec(
//     http("Category Filter Page 1")
//       .post(`${BASE_URL}/api/categoryproducts/filter/1`)
//       .header("Content-Type", "application/json")
//       .body(StringBody(`
// {
//   "categoryId": "#{categoryId}",
//   "categoryName": "#{categoryName}",
//   "gemstones": [],
//   "allGemstones": [],
//   "birthMonth": [],
//   "byPopularity": [],
//   "byRecipient": [],
//   "bySpecialOccasion": [],
//   "color": [],
//   "cut": [],
//   "dimensions": { "dimension": "", "itemWidth": "", "itemLength": "" },
//   "dropsBeads": [],
//   "gemstoneType": [],
//   "metalColor": [],
//   "metalPurity": [],
//   "metalType": [],
//   "otherSubCategory": [],
//   "price": { "min": 0, "max": 150000, "priceRange": "" },
//   "shape": [],
//   "shopBy": [],
//   "sort": 1,
//   "sortBy": "sortPrice",
//   "topGift": []
// }
// `))
//       .check(status().is(200))
//   )

//   .exec(
//     http("SubCategory Filter")
//       .post(session =>
//         `${BASE_URL}/api/attribute/subCategoryFilter/${session.get("categoryId")}/${encodeURIComponent(session.get("categoryName"))}`
//       )
//       .header("Content-Type", "application/json")
//       .body(StringBody(`
// {
//   "price": { "min": 0, "max": 150000 },
//   "dimension": { "itemWidth": "", "itemLength": "" }
// }
// `))
//       .check(status().is(200))
//   )

//   .exec(
//     http("Attribute Filter")
//       .post(session =>
//         `${BASE_URL}/api/attribute/filter/${session.get("categoryId")}`
//       )
//       .header("Content-Type", "application/json")
//       .body(StringBody(`
// {
//   "gemstoneId": [],
//   "subCategoryId": [],
//   "shopBy": [
//     { "name": "Vault Gem", "fieldName": "vaultGem" },
//     { "name": "Color Change Stone", "fieldName": "colorChangeStone" },
//     { "name": "Star Stone", "fieldName": "gStarStone" },
//     { "name": "Cats Eye", "fieldName": "gCatsEye" }
//   ],
//   "price": { "min": 0, "max": 150000 },
//   "dimension": { "itemWidth": "", "itemLength": "" },
//   "colorId": [],
//   "cutId": [],
//   "gemstoneType": [],
//   "metalColorId": [],
//   "metalId": [],
//   "metalPurity": [],
//   "monthId": [],
//   "packaging": [],
//   "popularityPairs": [],
//   "shapeId": [],
//   "beadsSubCategoryId": 0
// }
// `))
//       .check(status().is(200))
//   )
//   .pause(1)
//     .exec(
//     http("Product Detail")
//       .get(session =>
//         `${BASE_URL}/api/categoryproducts/code/${session.get("productCode")}`
//       )
//       .check(status().is(200))
//   );

 // homepage -> listing -> pdp

// const browseFlow = scenario("Browse Users")
//    .exec(
//     http("Homepage Header Footer")
//       .get(`${BASE_URL}/api/homepage/header-footer-content`)
//       .check(status().is(200))
//      )

//   .pause(1)

//    .exec(
//     http("Homepage Sections")
//       .get(`${BASE_URL}/api/homepage/homepage-sections`)
//       .check(status().is(200))
//   )

//     .pause(1)

//   .exec(session => {
//     const category = randomItem(categories);
//     const product = randomItem(products);
//     return session
//       .set("categoryId", category.id)
//       .set("categoryName", category.name)
//       .set("productCode", product);
//   })

//   .exec(
//     http("Category Listing")
//       .get(session =>
//         `${BASE_URL}/api/categoryproducts/categorylist/${session.get("categoryId")}?categoryName=${encodeURIComponent(session.get("categoryName"))}`
//       )
//       .check(status().is(200))
//   )
  
//   .exec(
//     http("Product Detail")
//       .get(session =>
//         `${BASE_URL}/api/categoryproducts/code/${session.get("productCode")}`
//       )
//       .check(status().is(200))
//   );

  //type -> search -> pdp
// const searchFlow = scenario("Search Users")
//     .exec(
//         http("Homepage Header Footer")
//         .get(`${BASE_URL}/api/homepage/header-footer-content`)
//         .check(status().is(200))
//         )

//     .pause(1)

//     .exec(
//         http("Homepage Sections")
//         .get(`${BASE_URL}/api/homepage/homepage-sections`)
//         .check(status().is(200))
//     )

//     .pause(1)
//   .exec(session =>
//     session.set("searchQuery", randomItem(searchQueries))
//   )
//   .exec(
//     http("Search Suggestion")
//       .get(session =>
//         `${BASE_URL}/api/search/suggestion?query=${encodeURIComponent(session.get("searchQuery"))}`
//       )
//       .check(status().is(200))
//   )
//   .pause(1)

//   .exec(
//     http("Advanced Search")
//       .post(session =>
//         `${BASE_URL}/api/search/advanced-search/0/?query=${encodeURIComponent(session.get("searchQuery"))}`
//       )
//       .header("Content-Type", "application/json")
//       .body(StringBody(`
// {
//   "categories": [],
//   "sortBy": "",
//   "sort": -1
// }
// `))
//       .check(status().is(200))
//   )
//     .pause(1)

//     .exec(session =>
//         session.set("productCode", randomItem(products))
//     )

//     .exec(
//         http("Search Result Product Detail")
//         .get(session =>
//             `${BASE_URL}/api/categoryproducts/code/${session.get("productCode")}`
//         )
//         .check(status().is(200))
//     );

const registeredFlow = scenario("Registered Cart Flow")
  .feed(userFeeder)
  // .exec(session => {
  //   const userId = session.get("userId");
  //   if (!userId) {
  //     throw new Error("userId is missing from CSV feeder");
  //   }
  //   console.log("DEBUG userId =", userId);
  //   return session;
  // })

   .exec(
    http("Homepage Header Footer")
      .get(`${BASE_URL}/api/homepage/header-footer-content`)
      .check(status().is(200))
     )

  .pause(1)

   .exec(
    http("Homepage Sections")
      .get(`${BASE_URL}/api/homepage/homepage-sections`)
      .check(status().is(200))
  )

    .pause(1)
    .exec(session => {
    const category =
      categories[Math.floor(Math.random() * categories.length)];

    return session
      .set("categoryId", category.id)
      .set("categoryName", category.name);
  })

  .exec(session => {
  const categoryId = session.get("categoryId");

  const productsInCategory = productDetails.filter(
    p => p.categoryId === categoryId
  );
  const product =
    productsInCategory.length > 0
      ? productsInCategory[Math.floor(Math.random() * productsInCategory.length)]
      : productDetails[Math.floor(Math.random() * productDetails.length)];

  return session
    .set("product", product)
    .set("productCode", product.code);
})
  .exec(
    http("Category Listing")
      .get(session =>
        `${BASE_URL}/api/categoryproducts/categorylist/${session.get("categoryId")}?categoryName=${encodeURIComponent(session.get("categoryName"))}`
      )
      .check(status().is(200))
  )
  .pause(1)

  .exec(
    http("Category Filter Page 1")
      .post(`${BASE_URL}/api/categoryproducts/filter/1`)
      .header("Content-Type", "application/json")
      .body(StringBody(`
  {
    "categoryId": "#{categoryId}",
    "categoryName": "#{categoryName}",
    "gemstones": [],
    "allGemstones": [],
    "birthMonth": [],
    "byPopularity": [],
    "byRecipient": [],
    "bySpecialOccasion": [],
    "color": [],
    "cut": [],
    "dimensions": { "dimension": "", "itemWidth": "", "itemLength": "" },
    "dropsBeads": [],
    "gemstoneType": [],
    "metalColor": [],
    "metalPurity": [],
    "metalType": [],
    "otherSubCategory": [],
    "price": { "min": 0, "max": 150000, "priceRange": "" },
    "shape": [],
    "shopBy": [],
    "sort": 1,
    "sortBy": "sortPrice",
    "topGift": []
  }
  `))
        .check(status().in(200, 404, 401))
    )

  .exec(
    http("SubCategory Filter")
      .post(session =>
        `${BASE_URL}/api/attribute/subCategoryFilter/${session.get("categoryId")}/${encodeURIComponent(session.get("categoryName"))}`
      )
      .header("Content-Type", "application/json")
      .body(StringBody(`
    {
      "price": { "min": 0, "max": 150000 },
      "dimension": { "itemWidth": "", "itemLength": "" }
    }
    `))
      .check(status().is(200))
  )

  .exec(
    http("Attribute Filter")
      .post(session =>
        `${BASE_URL}/api/attribute/filter/${session.get("categoryId")}`
      )
      .header("Content-Type", "application/json")
      .body(StringBody(`
    {
      "gemstoneId": [],
      "subCategoryId": [],
      "shopBy": [
        { "name": "Vault Gem", "fieldName": "vaultGem" },
        { "name": "Color Change Stone", "fieldName": "colorChangeStone" },
        { "name": "Star Stone", "fieldName": "gStarStone" },
        { "name": "Cats Eye", "fieldName": "gCatsEye" }
      ],
      "price": { "min": 0, "max": 150000 },
      "dimension": { "itemWidth": "", "itemLength": "" },
      "colorId": [],
      "cutId": [],
      "gemstoneType": [],
      "metalColorId": [],
      "metalId": [],
      "metalPurity": [],
      "monthId": [],
      "packaging": [],
      "popularityPairs": [],
      "shapeId": [],
      "beadsSubCategoryId": 0
    }
    `))
        .check(status().is(200))
      )
      .pause(1)
        .exec(
        http("Product Detail")
          .get(session =>
            `${BASE_URL}/api/categoryproducts/code/${session.get("productCode")}`
          )
          .check(status().is(200))
      )
      .pause(1)

  .exec(session => {
    if (!session.get("product")) {
    return session;
  }
  const product = session.get("product");

  const formattedProduct = {
    code: product.code,
    name: product.name,
    categoryId: product.categoryId,
    subCategoryId: product.subCategoryId,
    gemstoneId: product.gemstoneId,
    prodStock: product.prodStock,
    status: product.status,
    qty: 1,
    ringSizeId: 0,
    ringSizeAmt: 0,
    ringSizeName: null,
    custom: false,
    settingCharge: 0,
    actualPrice: product.actualPrice,
    price: product.price,
    offer: product.offer,
    img: product.img,
    checkBoxes: []
  };

  return session.set("addBody", JSON.stringify(formattedProduct));
})

  //add to cart
  .exec(
    http("Add To Cart")
      .post(`${BASE_URL}/api/cart/addToCart/#{userId}`)
      .header("Content-Type", "application/json")
      .body(StringBody("#{addBody}"))
      .check(status().in(200, 201, 401))
  )
  // //get prod stock
  //  .exec(
  //     http("Get Product Stock")
  //       .get(`${BASE_URL}/api/cart/prodStock/#{productCode}`)
  //       .check(
  //       status().in(200, 404),
  //       bodyString().optional().saveAs("stockResponse")
  //     )
  //   )
  // //check current stock qty n update stock qty
  // .exec(session => {
  //   if (!session.contains("stockResponse")) {
  //     console.error("stockResponse missing, defaulting stock = 1");
  //     return session.set("currentStock", 1);
  //   }

  //   const body = session.get("stockResponse");

  //   let stock = 1;

  //   try {
  //     const parsed = JSON.parse(body);
  //     if (parsed && typeof parsed.prodStock === "number") {
  //       stock = parsed.prodStock;
  //     }
  //   } catch (e) {
  //     console.error("Failed to parse stockResponse:", body);
  //   }

  //   return session.set("currentStock", stock);
  // })
  // .exec(session => {
  //   const stock = parseInt(session.get("currentStock"), 10) || 1;
  //   const desiredQty = 3;
  //   const finalQty = Math.min(desiredQty, stock);
  //   return session.set("finalQty", finalQty);
  // })
  // .exec(
  //   http("Update Cart Quantity")
  //     .put(
  //       `${BASE_URL}/api/cart/updatedQty/#{userId}/#{productCode}/#{finalQty}`
  //     )
  //     .check(status().is(200))
  // )
  //cart list
  .exec(
    http("Cart List 1")
      .get(`${BASE_URL}/api/cart/cartList/#{userId}`)
      .check(status().in(200, 404, 401))
  )

  // .exec(
  // http("Get Certificates")
  //   .get(`${BASE_URL}/api/cart/certificate`)
  //   .check(
  //     status().is(200),
  //     bodyString().saveAs("certificateResponse")
  //   )
  // )
  // .exec(session => {
  //   const body = session.get("certificateResponse");

  //   if (!body) {
  //     return session.set("certificates", []);
  //   }

  //   try {
  //     const certificates = JSON.parse(body);

  //     if (Array.isArray(certificates)) {
  //       return session.set("certificates", certificates);
  //     }
  //   } catch (e) {}

  //   return session.set("certificates", []);
  // })

  // .exec(session => {
  //   const certificates = session.get("certificates");

  //   if (!Array.isArray(certificates) || certificates.length === 0) {
  //     return session; // skip checkbox update
  //   }

  //   const randomIndex = Math.floor(Math.random() * certificates.length);

  //   const checkboxPayload = certificates.map((cert, index) => ({
  //     id: cert.id,
  //     description: cert.description,
  //     checked: index === randomIndex,
  //     value: cert.value
  //   }));

  //   return session.set("checkboxBody", JSON.stringify(checkboxPayload));
  // })
  // .exec(
  //   http("Update Checkbox")
  //     .post(`${BASE_URL}/api/cart/updateCheckBox/#{userId}/#{productCode}`)
  //     .header("Content-Type", "application/json")
  //     .body(StringBody("#{checkboxBody}"))
  //     .check(status().is(200))
  // )

  .exec(
    http("Remove From Cart")
      .get(`${BASE_URL}/api/cart/removeFromCart/#{userId}/#{productCode}`)
      .check(status().in(200, 404, 401))
  );

export default simulation((setUp) => {
  setUp(

    // cartFlow.injectOpen(
    //   rampUsers(1000).during(60)
    // ),

    // categoryFlow.injectOpen(
    //   rampUsers(1000).during(60)
    // ),

    // browseFlow.injectOpen(
    //   rampUsers(1000).during(60)
    // ),

    // searchFlow.injectOpen(
    //   rampUsers(400).during(60)
    // ),

    registeredFlow.injectOpen(
        rampUsers(100).during(60)
        //atOnceUsers(1)
    )
  );
});