const socket = io("http://localhost:3000", {
  auth: {
    token: "xcvhbjterwaxzsdxcfvbuysgbjedgchs",
  },
});
socket.on("connect", () => {
  console.log("connected");
  socket.emit("create_user", { name: "surya",uid:"xcvhbjterwaxzsdxcfvbuysgbjedgchs",affliate:"123456789",devices:[],mobile:"9701905119",mail:"suryaprakashlokula@gmail.com",}, (payload) => {
//   socket.emit("delete_user", {uid:"xcvhbjterwaxzsdxcfvbuysgbjedgchs"}, (payload) => {
    console.log(payload);
  });
});
socket.on("disconnect", (reason) => {
  console.log("disconnected", reason);
});
socket.on("connect_error", (err) => {
  console.log(err.message);
});
