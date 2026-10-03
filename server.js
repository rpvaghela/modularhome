// Production Server Startup File for SiteGround Node.js Hosting / Phusion Passenger
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "0.0.0.0";
// SiteGround Passenger sets process.env.PORT (or passes a named pipe / internal port)
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port, dir: __dirname });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error("Error handling request:", req.url, err);
        res.statusCode = 500;
        res.end("Internal Server Error");
      }
    })
      .once("error", (err) => {
        console.error("Server listener error:", err);
        process.exit(1);
      })
      .listen(port, () => {
        console.log(`> ModularHome Application ready on port ${port} (mode: ${process.env.NODE_ENV || "production"})`);
      });
  })
  .catch((err) => {
    console.error("Fatal error during Next.js app preparation:", err);
    process.exit(1);
  });
