import { simulation, scenario } from "@gatling.io/core";
import { http, status } from "@gatling.io/http";
import { rampUsers } from "@gatling.io/core";

const BASE_URL = "https://website-backend-staging.up.railway.app";

export default simulation((setUp) => {

  const scn = scenario("Catalog Flow")

    //category listing
    .exec(
      http("Category Listing")
        .get(`${BASE_URL}/api/categoryproducts/categorylist/1002?categoryName=Gemstone%20Name`)
        .check(status().is(200))
    )

    .pause(2)

    //product detail
    .exec(
      http("Product Detail")
        .get(`${BASE_URL}/api/categoryproducts/productDetail?categoryId=1006&prodCode=GSBIG55647&loadCondition=suitablePairWith&subCategoryName=&shapeId=1002&stoneSize=8.93+X+6.34+X+4.32&gemstoneId=&subCategoryId=&jewelryColor=`)
        .check(status().is(200))
    )

    .pause(2)

    //search suggestion
    .exec(
      http("Search Suggestion")
        .get(`${BASE_URL}/api/search/suggestion?query=smbig29743`)
        .check(status().is(200))
    );

  setUp(
    scn.injectOpen(
      rampUsers(50).during(30)   // 10 users gradually over 30 seconds
    )
  );

});
