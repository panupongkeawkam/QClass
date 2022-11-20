const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "", // ชื่อ user เช่น root
  password: "", // รหัสผ่าน
  database: "q-class-mobile-application", // ชื่อ database ที่ตั้งไว้เริ่มต้น (ตาม schema)
  waitForConnections: true,
});

module.exports = pool;
