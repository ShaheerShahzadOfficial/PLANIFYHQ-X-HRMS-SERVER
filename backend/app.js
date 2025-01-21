import express from "express";
import cors from "cors";
import morgan from "morgan";
import planRouter from "./route/plan.js";
import userRouter from "./route/users.js";
import departmentRouter from "./route/department.js";
import designationRouter from "./route/designation.js";
import attendanceRouter from "./route/attendence.js";
import emergencyRouter from "./route/emergency.js";
import personalInfoRouter from "./route/personalInfo.js";
import educationRouter from "./route/education.js";
import experienceRouter from "./route/experience.js";
import bankDetailsRouter from "./route/bank-account.js";

const app = express();
app.use(
  express.json({
    limit: "10000mb",
    extended: true,
  })
);
app.use(morgan("common"));
const corsOptions = {
  origin: true,
  credentials: true,
};
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(120deg, #f0f2f5, #e6e9f0);
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          .container {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 600px;
          }
          h1 {
            color: #2c3e50;
            margin-bottom: 1rem;
          }
          p {
            color: #34495e;
            line-height: 1.6;
          }
          .emoji {
            font-size: 2rem;
            margin-bottom: 1rem;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="emoji">🚀</div>
          <h1>Welcome to Planify X HRMS!</h1>
          <p>Your all-in-one HR management solution for modern businesses. We're excited to help you streamline your HR processes and boost productivity.</p>
        </div>
      </body>
    </html>
  `);
});

app.use("/plan", planRouter);
app.use("/user", userRouter);
app.use("/department", departmentRouter);
app.use("/designation", designationRouter);
app.use("/attendance", attendanceRouter);
app.use("/emergency", emergencyRouter);
app.use("/personal-info", personalInfoRouter);
app.use("/education", educationRouter);
app.use("/experience", experienceRouter);
app.use("/bank-account", bankDetailsRouter);
app.use((req, res) => {
  res.status(404).send(`
    <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(120deg, #f0f2f5, #e6e9f0);
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          .error-container {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 600px;
          }
          h1 {
            color: #e74c3c;
            margin-bottom: 1rem;
          }
          p {
            color: #34495e;
            line-height: 1.6;
          }
          .emoji {
            font-size: 2rem;
            margin-bottom: 1rem;
          }
        </style>
      </head>
      <body>
        <div class="error-container">
          <div class="emoji">🔍</div>
          <h1>404 - Page Not Found</h1>
          <p>Oops! The page you're looking for seems to have vanished into thin air.</p>
          <p>Please check the URL and try again. If you believe this is a mistake, contact our support team.</p>
        </div>
      </body>
    </html>
  `);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(`Some thing Broke ${err} `);
});

export default app;
