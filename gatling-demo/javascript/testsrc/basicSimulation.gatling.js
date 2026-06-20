import { simulation, scenario } from "@gatling.io/core";
import { http } from "@gatling.io/http";
import { rampUsers } from "@gatling.io/core";
import { status } from "@gatling.io/http";

const BASE_URL = "https://dev--ecommerce-frontend-big.netlify.app/";

export default simulation((setUp) => {

  const scn = scenario("Open Homepage")
    .exec(
      http("Load Homepage")
        .get(`${BASE_URL}/`)
        .check(status().is(200))
    )
    // .pause(2)
    // .exec(
    //   http("Reload Homepage")
    //     .get(`${BASE_URL}/`)
    //     .header("Cache-Control", "no-cache")
    //     .check(status().is(200))
    // )

  setUp(
    scn.injectOpen(
      rampUsers(10).during(20)   // 10 users gradually over 20 seconds
    )
  );

});
