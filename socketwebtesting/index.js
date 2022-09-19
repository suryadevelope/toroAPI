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
//  socket.emit("update_user", {token:tkn,data:{ name: "surya"}}, (payload) => {
  // socket.emit("create_user", { name: "suryalokula",uid:"xcvhbjterwaxzsdxcfvbuysgbjedgchs",affliate:"123456789",devices:[],mobile:"9701905119",mail:"suryaprakashlokula@gmail.com",}, (payload) => {
    socket.on("onchange", (payload) => {
    // socket.emit("delete_user", (payload) => {
      console.log("onchange",payload);
    });
},2000)
socket.on("disconnect", (reason) => {
  console.log("disconnected", reason);
});
socket.on("connect_error", (err) => {
  console.log(err.message);
});


var buttons = ["Register_Device","unRegister_Device","Auth_Device_User","unAuth_Device_User","Get_all_device","Get_device","Update_device","listen"]

var data = {
  "Register_Device":{
    "macid": "80:00:00:00:00:01",
    "mail":"suryaprakashlokulaa@gmail.com",
    "approved": [],
    "devicename": "test1",
    "devicetype": "NA-5",
    "devicestate": true,
    "pumpState": false,
    "manualMode": false,
    "setPowerState": true,
    "upTime": "13-09-2022",
    "loc": [17.9987,78.878675],
    "grill": {
      "temp": 12,
      "humid": 24
    },
    "outdoor": {
      temp: 13,
      humid: 55
    },
    filter: true,
    fan: {
      state: true,
      speed: {
        rpm: 1400,
        Hz: 32
      },
      volts: 230,
      amps: 0.5,
      watts: 150
    },
    waterLevel: false,
    selfcare: {
      date: "14-09-2022",
      day: "monday",
      time: "01:00 pm"
    },
    SystemWatts: "300",
    set_point_temp: "45",
    add_humid_val: "56",
    default_hz: "50",
    fire_safety_state: false
  },
  "unRegister_Device":{
    "mac": "80:00:00:00:00:01"
  },
  "Auth_Device_User":{
    "mac": "80:00:00:00:00:01",
    "mail":"suryaprakashlokula@gmail.com",
    "state":"admin"
  },
  "unAuth_Device_User":{
    "mac": "80:00:00:00:00:01",
    "mail":"suryaprakashlokula@gmail.com"
  },
  "Get_all_device":"null",
  "Get_device":{
    "mac": "80:00:00:00:00:01",
  }
  ,"Update_device":{
    "macid": "80:00:00:00:00:01",
    "approved": [],
    "devicename": "test52",
    "devicetype": "NA-5",
  },
  "listen":{
    "mac": "80:00:00:00:00:01",
    keys:["macid,uid"]
  }
}

for (let index = 0; index < buttons.length; index++) {
  const element = buttons[index];
  var btn = document.createElement("button")
  btn.innerHTML = element.replace("_"," ")
  btn.addEventListener("click",()=>{
    if(element){
      socket.emit(element, {token:tkn,data:data[element]}, (payload) => {
      
        console.log(element,payload);
      });
    }else{
      socket.emit(element, {token:tkn}, (payload) => {
      
        console.log(element,payload);
      });
    }
   
  })
  

  document.body.append(btn);

  
}
