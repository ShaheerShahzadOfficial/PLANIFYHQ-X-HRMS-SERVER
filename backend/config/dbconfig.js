import mongoose from "mongoose";

const DBConnection = () => {
  mongoose
    .connect(process.env.DBURL, { minPoolSize: 10 })
    .then((result) => {
      console.log(`DATABASE CONNECTED WITH THE HOST ${result.connection.host}`);
    })
    .catch((error) => {
      console.error(error);
    });
};

export default DBConnection;