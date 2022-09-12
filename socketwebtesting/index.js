const socket = io("http://localhost:3000", {
  auth: {
    token: "b419484608dfedb55f3ece3b752164dad00bfaa8",
  },
});

var tkn = "U2FsdGVkX1/asvn+JvxTnl+pjcNp1eKNO7DEUdFCgsp4EO8Z41EzemvdZMLmtD+O7LkxiQ+ArMLaqFilJCWytQ3zGdJhPJU+4Xo2ZXg02/c="
socket.on("connect", () => {
  console.log("connected");
  
});


setTimeout(()=>{
 socket.emit("update_user", {token:tkn,data:{ name: "surya"}}, (payload) => {
  // socket.emit("create_user", { name: "surya",uid:"xcvhbjterwaxzsdxcfvbuysgbjedgchs",affliate:"123456789",devices:[],mobile:"9701905119",mail:"suryaprakashlokula@gmail.com",}, (payload) => {
    // socket.emit("delete_user", (payload) => {
      console.log(payload);
    });
},2000)
socket.on("disconnect", (reason) => {
  console.log("disconnected", reason);
});
socket.on("connect_error", (err) => {
  console.log(err.message);
});
