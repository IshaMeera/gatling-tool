import { simulation, scenario } from "@gatling.io/core";
import { http, status } from "@gatling.io/http";
import { atOnceUsers, rampUsers, constantUsersPerSec } from "@gatling.io/core";

const BASE_URL = "https://website-backend-staging.up.railway.app";

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

const scn = scenario("Concurrent User Flow - 1000 Users")
 //const scn = scenario("Sustained Load Flow")

  .exec((session) => {
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
  )

  .exec((session) => {
    return session.set("searchQuery", randomItem(searchQueries));
  })

.exec(
  http("Search Suggestion")
    .get(session =>
      `${BASE_URL}/api/search/suggestion?query=${encodeURIComponent(session.get("searchQuery"))}`
    )
    .check(status().is(200))
)

export default simulation((setUp) => {

//  setUp(
//     scn.injectOpen(
//       rampUsers(100).during(60), // 100 users gradually over 60 seconds
//       atOnceUsers(300), // 300 users at once
//       constantUsersPerSec(20).during(120) // 20 users per second for 120 seconds
//     )
//   );

setUp(
  scn.injectOpen(
    //atOnceUsers(400)
   rampUsers(1000).during(60)
   //constantUsersPerSec(60).during(120)
    // rampUsersPerSec(100).to(1000).during(120)
  )
);
});