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

  const scn = scenario("Reset Password Full Flow")

    // Forgot Password
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
    )

    // Pause so OTP exists
    .pause(2)

    // Verify Reset OTP
    .exec(
      http("Verify Reset OTP")
        .post(`${BASE_URL}/api/user/verify-reset-otp`)
        .header("Content-Type", "application/json")
        .body(
          StringBody(`
          {
            "otp": "68054",
            "email": "ishmeera27@gmail.com"
          }
          `)
        )
        .check(status().is(201))
    )

    // Reset Password
    .exec(
      http("Reset Password")
        .post(`${BASE_URL}/api/user/reset-password`)
        .header("Content-Type", "application/json")
        .body(
          StringBody(`
          {
            "user": {
              "email": "ishmeera27@gmail.com",
              "password": "abc@123"
            }
          }
          `)
        )
        .check(status().is(201))
    )

    // Login
    .exec(
      http("Login")
        .post(`${BASE_URL}/api/user/login`)
        .header("Content-Type", "application/json")
        .body(
          StringBody(`
          {
            "user": {
              "email": "ishmeera27@gmail.com",
              "password": "abc@123"
            }
          }
          `)
        )
        .check(status().is(201))
    );

  setUp(
    scn.injectOpen(
      atOnceUsers(1)
    )
  );
});