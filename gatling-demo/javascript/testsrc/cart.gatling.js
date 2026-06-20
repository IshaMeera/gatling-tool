import { simulation, scenario, constantUsersPerSec, StringBody, rampUsersPerSec } from "@gatling.io/core";
import { http, status } from "@gatling.io/http";

const BASE_URL = "https://website-backend-staging.up.railway.app";

const products = [
  "FJBIG55633","MOBIG27434", "FJBIG37914","MOBIG27337", "FJBIG42626", "FJBIG29334","FJBIG28564", "FJBIG24210", "BIG0004",
  "FJBIG53192", "DPBIG24536", "DPBIG4886", "DPBIG5610","MOBIG27369", "DPBIG7096", "DPBIG8114", "DPBIG9040",
  "GSBIG130","GSBIG207", "GSBIG197", "GSBIG214", "GSBIG330", "GSBIG338", "GSBIG467", "GSBIG500", "GSBIG174",
  "GSBIG178","MOBIG27427","MOBIG27427-1", "MOBIG27337-2","MOBIG27434-1", "SMBIG53884","SMBIG43849",
  "SMBIG29749","SMBIG30740", "SMBIG30807", "SMBIG32506", "SMBIG34758", "SMBIG35488"
];
function getRandomSkus(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

const scn = scenario("Guest Cart Current Stock Random")

  .exec((session) => {
    const randomSkus = getRandomSkus(products, 3);
    return session
    .set("cartSkusJson", JSON.stringify(randomSkus));
  })

  .exec(
    http("Cart Current Stock")
        .post(`${BASE_URL}/api/cart/currentStock`)
        .header("Content-Type", "application/json")
        .body(StringBody("#{cartSkusJson}"))
        .check(status().is(200))
    )

export default simulation((setUp) => {
  setUp(
    scn.injectOpen(
      //constantUsersPerSec(600).during(60)
      rampUsersPerSec(50).to(200).during(120)
    )
  );
});
