require("dotenv").config();
const S3 = require("aws-sdk/clients/s3");
const mysql = require("mysql2");

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({ region, accessKeyId, secretAccessKey });

// uploads a file to s3
function uploadFile(file) {
  const date = new Date();
  const dateString = date.toISOString();

  const type = file.match(/data:(.*);base64/)[1];
  const imageBuffer = Buffer.from(
    file.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );
  const uploadParams = {
    Bucket: bucketName,
    Key: `phototest/${dateString.replace("T", "").replace("Z", "")}`,
    Body: imageBuffer,
    ContentEncoding: "base64",
    ContentType: type,
  };

  return s3.upload(uploadParams).promise();
}

// get all files from s3
async function getFile() {
  const response = await s3.listObjectsV2({ Bucket: bucketName }).promise();
  console.log(response);
}

// RDS
class RDS {
  static connection = mysql.createPool({
    host: process.env.RDS_HOST,
    user: process.env.RDS_USER,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  insertData(message, URL) {
    return new Promise((resolve, reject) => {
      const sql = "INSERT INTO message (message, URL) VALUES (?, ?)";
      const values = [message, URL];
      RDS.connection.query(sql, values, (err, result) => {
        if (err) {
          console.log(err);
          reject(false);
        }
        resolve(result.affectedRows);
      });
    });
  }

  getData(cb) {
    //     "SELECT JSON_OBJECT('message', message, 'URL', URL) as res FROM message"
    //     SELECT GROUP_CONCAT(
    //     CONCAT('{"message":"', message, '","URL":"', URL, '"}')
    // ) as json_result FROM message

    const sql = "SELECT message, URL FROM message";
    RDS.connection.query(sql, function (err, results) {
      if (err) {
        console.log(err);
        return;
      }
      cb(results);
    });
  }
}

module.exports = {
  uploadFile: uploadFile,
  insert: RDS,
};
