// import cluster from "cluster";
// import app from "./app";

// /* Is the file being executed in master mode*/
// if (cluster.isMaster) {
//   /* Case server.js to be executed *AGAIN* but in child mode */
//   cluster.fork();
//   cluster.fork();
//   cluster.fork();
// } else {
//   /* I am a child, I am going to act like a server and nothing else */
//   app.get("/", (req, res) => {
//     res.send("Hi There");
//   });
//   app.get("/fast", (req, res) => {
//     res.send("Fast");
//   });

//   const server = app.listen(5000, () => {
//     console.log(`App running on port 5000...`);
//   });
// }
