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
import LeaveRouter from "./route/leave.js";
import oemRouter from "./route/oem.js";
import productRouter from "./route/product.js";
import activityRouter from "./route/activity.js";
import clientRouter from "./route/client.js";
import timeSheetRouter from "./route/timeSheet.js";
import shiftSchedulingRouter from "./route/shift-scheduling.js";
import salaryRouter from "./route/salary.js";
import resourseSalaryRouter from "./route/resourse/salary.js";

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
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          html, body {
            width: 100%;
            height: 100%;
            font-family: 'Inter', sans-serif;
            background: #fafbff;
          }
          .hero {
            width: 100%;
            height: 100vh;
            padding: 6rem 2rem;
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 4rem;
          }
          .hero-content {
            flex: 1;
          }
          .hero-image {
            flex: 1;
            text-align: right;
          }
          .badge {
            background: rgba(79, 70, 229, 0.1);
            color: #4F46E5;
            padding: 0.5rem 1rem;
            border-radius: 2rem;
            font-size: 0.875rem;
            font-weight: 500;
            display: inline-block;
            margin-bottom: 1.5rem;
          }
          h1 {
            font-size: 3.5rem;
            line-height: 1.2;
            margin-bottom: 1.5rem;
            color: #111827;
            font-weight: 800;
          }
          .gradient-text {
            background: linear-gradient(45deg, #4F46E5, #7C3AED);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          p {
            font-size: 1.25rem;
            line-height: 1.7;
            color: #4B5563;
            margin-bottom: 2rem;
          }
          .cta-buttons {
            display: flex;
            gap: 1rem;
          }
          .primary-button {
            background: #4F46E5;
            color: white;
            padding: 1rem 2rem;
            border-radius: 0.5rem;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.2s;
          }
          .primary-button:hover {
            background: #4338CA;
            transform: translateY(-2px);
          }
          .secondary-button {
            background: white;
            color: #4F46E5;
            padding: 1rem 2rem;
            border-radius: 0.5rem;
            font-weight: 600;
            text-decoration: none;
            border: 1px solid #E5E7EB;
            transition: all 0.2s;
          }
          .secondary-button:hover {
            border-color: #4F46E5;
            transform: translateY(-2px);
          }
          @media (max-width: 768px) {
            .hero {
              flex-direction: column;
              padding: 4rem 1.5rem;
              text-align: center;
              height: auto;
              min-height: 100vh;
            }
            h1 {
              font-size: 2.5rem;
            }
            .cta-buttons {
              justify-content: center;
            }
          }
        </style>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;800&display=swap" rel="stylesheet">
      </head>
      <body>
        <div class="hero">
          <div class="hero-content">
            <div class="badge">✨ Next-Gen HR Platform</div>
            <h1>Transform Your <span class="gradient-text">HR Management</span> With PlanifyHQ</h1>
            <p>Streamline your HR processes, boost productivity, and create a better workplace experience. All-in-one platform designed for modern businesses.</p>
            <div class="cta-buttons">
              <a href="https://www.planifyhq.com" class="primary-button">Get Started Free</a>
              <a href="mailto:support@planifyhq.com" class="secondary-button">Book a Demo</a>
            </div>
          </div>
          <div class="hero-image">
            <img src="https://www.planifyhq.com/images/icon.png" 
                 alt="HR Management Platform" 
                 style="max-width: 100%; height: auto;">
          </div>
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
app.use("/leaves", LeaveRouter);
app.use("/oem", oemRouter);
app.use("/product", productRouter);
app.use("/activity", activityRouter);
app.use("/client", clientRouter);
app.use("/timeSheet", timeSheetRouter);
app.use("/shift-scheduling", shiftSchedulingRouter);
app.use("/salary", salaryRouter);
app.use("/resourse/salary", resourseSalaryRouter);
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
