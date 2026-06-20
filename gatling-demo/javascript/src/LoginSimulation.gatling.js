import {
  simulation,
  scenario,
  atOnceUsers,
  StringBody,
  rampUsers
} from "@gatling.io/core";

import { http, status } from "@gatling.io/http";

const BASE_URL =
  "https://childcare-management-system-server-sql-server.up.railway.app";

export default simulation((setUp) => {
  const scn = scenario("Login Flow")
    .exec(
      http("User Login")
        .post(`${BASE_URL}/api/user/login`)
        .header("Content-Type", "application/json")
        .body(
          StringBody(`
          {
            "user": {
              "email": "test@gmail.com",
              "password": "Test@123"
            }
          }
          `)
        )
        .check(status().in(200,201,400,401))
    );

  setUp(
    scn.injectOpen(
      //atOnceUsers(100)
      rampUsers(100).during(60)
    )
  );
});