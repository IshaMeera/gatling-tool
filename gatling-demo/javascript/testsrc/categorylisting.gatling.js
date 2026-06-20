import { simulation, scenario, constantUsersPerSec, StringBody } from "@gatling.io/core";
import { http, status } from "@gatling.io/http";

const BASE_URL = "https://website-backend-staging.up.railway.app";

const categories = [
  { id: 1002, name: "Gemstone Name" },
  { id: 1004, name: "Drops & Beads" },
  { id: 1005, name: "Jewelry" },
  { id: 1006, name: "Semi-Mounts" },
  { id: 1007, name: "Findings" }
];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const scn = scenario("Category Full Filter Flow")

  .exec((session) => {
    const category = randomItem(categories);
    return session
      .set("categoryId", category.id)
      .set("categoryName", category.name);
  })

  .exec(
  http("Category Filter Page 1")
    .post(`${BASE_URL}/api/categoryproducts/filter/1`)
    .header("Content-Type", "application/json")
    .body(
      StringBody(`
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
`)
    )
    .check(status().is(200))
)

  .exec(
  http("SubCategory Filter")
    .post(session =>
      `${BASE_URL}/api/attribute/subCategoryFilter/${session.get("categoryId")}/${encodeURIComponent(session.get("categoryName"))}`
    )
    .header("Content-Type", "application/json")
    .body(
      StringBody(`
{
  "price": { "min": 0, "max": 150000 },
  "dimension": { "itemWidth": "", "itemLength": "" }
}
`)
    )
    .check(status().is(200))
)


  .exec(
  http("Attribute Filter")
    .post(session =>
      `${BASE_URL}/api/attribute/filter/${session.get("categoryId")}`
    )
    .header("Content-Type", "application/json")
    .body(
      StringBody(`
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
`)
    )
    .check(status().is(200))
)

export default simulation((setUp) => {
  setUp(
    scn.injectOpen(
      constantUsersPerSec(20).during(60)
    )
  );
});
