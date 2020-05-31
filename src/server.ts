import { createApp } from "./app";

createApp()
  .then(({ app, pgPool }) => {
    const server = app.listen(process.env.PORT, () => {
      console.log(`Server started at port ${process.env.PORT}`);
    });

    process.on("SIGTERM", () => {
      console.log("Received SIGTERM Signal. Shutting down...");
      pgPool.pool.end();
      server.close(() => {
        console.log("Server closed");
      });
    });
  })
  .catch(err => {
    console.log("ERROR ON STARTUP:", err.message);
  });
