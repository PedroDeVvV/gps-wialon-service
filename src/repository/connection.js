import mysql2 from "mysql2/promise.js";

async function connect() {
  const connection = await mysql2.createConnection({
    host: process.env.HOST_DB,
    password: process.env.PASSWORD_DB,
    port: process.env.PORT,
    database: process.env.DATABASE,
    user: process.env.USER
  });
  return connection;
}

export default { connect };
