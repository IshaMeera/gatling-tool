import {
  simulation,
  scenario,
  atOnceUsers,
  StringBody
} from "@gatling.io/core";

import { http, status } from "@gatling.io/http";

const BASE_URL =
  "https://childcare-management-system-server-sql-server.up.railway.app";

export default simulation((setUp) => {

  const scn = scenario("Forgot Password Flow")
    .exec(
      http("Forgot Password")
        .post(`${BASE_URL}/api/user/forgot-password`)
        .header("Content-Type", "application/json")
        .body(
          StringBody(`
          {
            "email": "ishmeera27@gmail.com"
          }
          `)
        )
        .check(status().is(201))
    );

  setUp(
    scn.injectOpen(
      atOnceUsers(20)
    )
  );
});