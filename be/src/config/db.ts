import mysql from "mysql2/promise";

export default async function getConnection() {
  return await mysql.createConnection({
    port: 3306,
    host: "localhost",
    user: "root",
    password: "0506",
    database: "nodejs",
  });
}
