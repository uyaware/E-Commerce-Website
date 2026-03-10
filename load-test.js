import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "10s", target: 10 },
    { duration: "20s", target: 20 },
    { duration: "30s", target: 40 },
    { duration: "30s", target: 80 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<900"],
  },
};

export default function () {
  const res = http.get("http://localhost:8000/products?page=1&keyword=iphone+128gb");

  check(res, {
    "status is 200": (r) => r.status === 200,
  });

  sleep(0.1);
}