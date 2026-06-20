import { simulation, scenario, StringBody } from "@gatling.io/core";
import { http, status } from "@gatling.io/http";
import { atOnceUsers, rampUsers, constantUsersPerSec } from "@gatling.io/core";

const BASE_URL = "https://ecommerce-backend-performance.up.railway.app";

const categories = [
  { id: 1002, name: "Gemstone Name" },
  { id: 1005, name: "Jewelry" },
  { id: 1006, name: "Semi-Mounts" },
  { id: 1007, name: "Findings"},
  { id: 1004, name: "Drops & Beads" }
];

const products = [
  "FJBIG55633","MOBIG27434", "FJBIG37914","MOBIG27337", "FJBIG42626", "FJBIG29334","FJBIG28564", "FJBIG24210", "BIG0004",
  "FJBIG53192", "DPBIG24536", "DPBIG4886", "DPBIG5610","MOBIG27369", "DPBIG7096", "DPBIG8114", "DPBIG9040",
  "GSBIG130","GSBIG207", "GSBIG197", "GSBIG214", "GSBIG330", "GSBIG338", "GSBIG467", "GSBIG500", "GSBIG174",
  "GSBIG178","MOBIG27427","MOBIG27427-1", "MOBIG27337-2","MOBIG27434-1", "SMBIG53884","SMBIG43849",
  "SMBIG29749","SMBIG30740", "SMBIG30807", "SMBIG32506", "SMBIG34758", "SMBIG35488"
];

const searchQueries = [
  "FJBIG53192",
  "smbig29743", "ring setting charge", "pearl", "mother of pearl", "smbig29743", "copper", "GSBIG2316","GSBIG2955",
  "apatite", "FJBIG54703", "emarald", "FJBIG54142", "FJBIG54132"
];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// const cartFlow = scenario("Cart Stock Users")

//   .exec(session => {

//     const randomSkus = [...products]
//       .sort(() => 0.5 - Math.random())
//       .slice(0, 3);

//     return session.set("cartSkusJson", JSON.stringify(randomSkus));
//   })

//   .exec(
//     http("Cart Current Stock")
//       .post(`${BASE_URL}/api/cart/currentStock`)
//       .header("Content-Type", "application/json")
//       .body(StringBody("#{cartSkusJson}"))
//       .check(status().is(200))
//   )

// const categoryFlow = scenario("Category Filter Users")

//   .exec(session => {
//     const category = randomItem(categories);
//     return session
//       .set("categoryId", category.id)
//       .set("categoryName", category.name);
//   })

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
//   );

 // homepage -> listing -> pdp

const browseFlow = scenario("Browse Users")
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
    const category = randomItem(categories);
    const product = randomItem(products);
    return session
      .set("categoryId", category.id)
      .set("categoryName", category.name)
      .set("productCode", product);
  })

  .exec(
    http("Category Listing")
      .get(session =>
        `${BASE_URL}/api/categoryproducts/categorylist/${session.get("categoryId")}?categoryName=${encodeURIComponent(session.get("categoryName"))}`
      )
      .check(status().is(200))
  )
  
  .exec(
    http("Product Detail")
      .get(session =>
        `${BASE_URL}/api/categoryproducts/code/${session.get("productCode")}`
      )
      .check(status().is(200))
  );

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

export default simulation((setUp) => {
  setUp(

    // cartFlow.injectOpen(
    //   rampUsers(100).during(60)
    // ),

    // categoryFlow.injectOpen(
    //   rampUsers(300).during(60)
    // ),

    browseFlow.injectOpen(
      rampUsers(50).during(60)
    ),

    // searchFlow.injectOpen(
    //   rampUsers(200).during(60)
    // )

  );
});
