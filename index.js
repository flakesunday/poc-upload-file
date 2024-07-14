var express = require("express"); //import express ด้วยการใช้ require
var app = express(); //set express ไว้เป็นตัวแปร app
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const port = 3001; //set ตัวแปร port เท่ากับ 3001

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./my-folders"); // folder ที่เราต้องการเก็บไฟล์
  },
  filename: function (req, file, callback) {
    // callback(null, file.originalname); //ให้ใช้ชื่อไฟล์ original เป็นชื่อหลังอัพโหลด
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    return callback(
      null,
      "photo_" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage });
// const upload = multer({ dest: "./my-folders" });

app.use("/uploads", express.static(path.join(__dirname, "my-folders")));
("my-folders/photo_1720087308916-302877416.jpg");
//ใช้ post เพื่อรองรับการ upload
app.post("/deleteFile", (req, res) => {
  const filePath = path.join(
    __dirname,
    "my-folders",
    "photo_1720087308926-519976650.png"
  );
  fs.unlink(filePath, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Failed to delete file", error: err.message });
    }

    // ลบข้อมูลจากฐานข้อมูล
    // product
    //   .destroy()
    //   .then(() => {
    //     res
    //       .status(200)
    //       .json({ message: "Product and image deleted successfully" });
    //   })
    //   .catch((err) => {
    //     res
    //       .status(500)
    //       .json({ message: "Failed to delete product", error: err.message });
    //   });
  });
  res.end();
});
app.post("/uploads", upload.array("photo", 5), (req, res) => {
  //   const filePath = `http://localhost:${port}/uploads/${req.file.filename}`;
  //   res.send({ imageUrl: filePath });
  console.log(req.files);
  res.json({
    result: req.files,
  });
});
// ใช้ listen เพื่อระบุว่า website จะทำงานที่ port อะไร เราใช้ให้เรียกตัวแปร port
app.listen(port, () => {
  console.log(`Server running at <http://localhost>:${port}/`);
});
