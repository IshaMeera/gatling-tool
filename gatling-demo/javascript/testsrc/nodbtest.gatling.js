import { simulation, scenario } from "@gatling.io/core";
import { http, status } from "@gatling.io/http";
import { rampUsers } from "@gatling.io/core";

const BASE_URL = "https://website-backend-staging.up.railway.app";

const httpProtocol = http
  .baseUrl(BASE_URL)
  .acceptHeader("application/json")
  .userAgentHeader("Gatling")
  .shareConnections();

const scn = scenario("No DB Endpoint Test")
  .exec(
    http("Gemstone Certification List")
      .get("/api/gemstonecertification/list")
      .check(status().is(200))
  );

export default simulation((setUp) => {
  setUp(
    scn.injectOpen(
      rampUsers(1000).during(60)
    )
  ).protocols(httpProtocol);
});
