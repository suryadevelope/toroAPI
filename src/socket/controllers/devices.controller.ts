import userModel from "@/models/users.model";
import deviceModel from "@/models/devices.model";
import checksecurity from "@/securitychecks/check.security";
import { Socket } from "socket.io";
import { Device } from '@/interfaces/devices.interfaces';


class DeviceController {

    private socket: Socket;
    public checks = new checksecurity();
    constructor(socket: Socket) {
        this.socket = socket;
        var { origin } = socket.handshake.headers;
        socket.on('disconnect', this.disconnect);
        socket.on("Register_Device", this.Register_Device);
        socket.on("unRegister_Device", this.unRegister_Device);
        socket.on("Auth_Device_User", this.Auth_user);
        socket.on("unAuth_Device_User", this.unAuth_user);
        socket.on("Get_all_device", this.Get_all_devices);
        socket.on("Get_device", this.Get_device);
        socket.on("Update_device", this.update_device);
        socket.on("listen", this.socketlisten);
    }




    private Register_Device = async (data: { "token": String, "data": Device }, callback: any) => {
        await deviceModel.findOne({ mac: data.data.macid }).then(async (res) => {
            if (res) {
                if (data.data.mail == res.mail) {
                    callback({ "code": 201, "error": `This device has already registered with ${data.data.mail}` })
                } else {
                    await userModel.findOne({ uid: this.socket.data.user.uid }).then((ress) => {
                        if (res.approved.find(element => this.socket.data.user.uid.toString() == element)) {
                            callback({ "code": 201, "error": `${ress.mail} has already registered this device and you have access to it` })
                        } else {
                            callback({ "code": 404, "error": `You have no access to register this device. please contact owner ${res.mail}` })
                        }
                    }).catch((err) => {
                        callback({ "code": 500, "error": err })
                    })

                }

            } else {
                await deviceModel.create(data.data).then(async (res) => {
                    await userModel.findOne({ uid: this.socket.data.user.uid }).then(async (ress) => {
                        ress.devices.push({ [data.data.macid]: "owner" })

                        await userModel.updateOne({ uid: this.socket.data.user.uid }, ress).then(() => {
                            callback({ "code": 200, "message": "Device registered successfully" });
                        }).catch((err) => {
                            callback({ "code": 500, "error": err })

                        })
                    }).catch((err) => {
                        callback({ "code": 500, "error": err })
                    })

                }).catch((err) => {
                    callback({ "code": 500, "error": err })
                })

            }

            if (res) {
                // await userModel.deleteOne({uid: this.socket.data.uid });
                callback(null, 'USER_DELETED');

            } else {
                callback({ "code": 404, "Reason": "No user exists" })
            }

        }).catch((err) => {
            callback({ "code": 500, "error": err });
        })

    }

    private Auth_user = async (data: { "token": String, "data": { mail: String, mac: String, state: String } }, callback: any) => {

        await userModel.findOne({ mail: data.data.mail }).then(async (ress) => {
            if (ress) {
                await deviceModel.findOne({ mac: data.data.mac }).then(async (resdevice) => {
                    if (resdevice) {
                        if (resdevice.mail == ress.mail) {
                            callback({ "code": 401, "message": `${data.data.mail} is already admin` })
                            return

                        }
                        if (resdevice.approved.find((ele) => Object.keys(ele)[0] == ress.uid)) {
                            callback({ "code": 402, "message": `${data.data.mail} already has access to this device` })
                            return
                        }

                        console.log(ress.devices, data.data.mac);

                        if (ress.devices.find((ele) => Object.keys(ele)[0] === data.data.mac)) {
                            callback({ "code": 402, "message": `${resdevice.macid} already has access` })
                            return
                        }

                        resdevice.approved.push({ [ress.uid]: data.data.state });
                        deviceModel.updateOne({ macid: data.data.mac }, resdevice).then(async () => {
                            ress.devices.push({ [resdevice.macid]: "user" })
                            await userModel.findOneAndUpdate({ uid: ress.uid }, ress).then((r) => {
                                callback({ "code": 200, "message": `${data.data.mail} updated to ${data.data.mac}` })

                            }).catch((err) => {
                                callback({ "code": 500, "error": err })

                            })
                        }).catch((err) => {
                            callback({ "code": 500, "error": err })
                        })
                    } else {
                        callback({ "code": 404, "error": `${data.data.mac} not yet registered` })

                    }

                }).catch((err) => {
                    callback({ "code": 500, "error": err })

                })
            } else {
                callback({ "code": 404, "error": `${data.data.mail} not found...` })
            }
        }).catch((err) => {
            callback({ "code": 500, "Reason": err })
        })
    }
    private unAuth_user = async (data: { "token": String, "data": { mail: String, mac: String } }, callback: any) => {

        await userModel.findOne({ mail: data.data.mail }).then(async (ress) => {
            if (ress) {
                await deviceModel.findOne({ mac: data.data.mac }).then(async (resdevice) => {
                    if (resdevice) {
                        if (data.data.mail == resdevice.mail) {
                            callback({ "code": 401, "message": `Cannot UnAuth owner of this device` })
                            return
                        }

                        if (!resdevice.approved.find(ele => Object.keys(ele)[0] === ress.uid)) {
                            callback({ "code": 404, "message": `User not found in the device` })
                            return
                        }
                        resdevice.approved.splice(resdevice.approved.findIndex(ele => Object.keys(ele)[0] == ress.uid), 1);
                        ress.devices.splice(ress.devices.findIndex(ele => Object.keys(ele)[0] == data.data.mac), 1);
                        deviceModel.updateOne({ macid: data.data.mac }, resdevice).then(() => {
                            userModel.updateOne({ mail: data.data.mail }, ress).then(() => {
                                callback({ "code": 200, "message": `${data.data.mail} removed from ${data.data.mac}` })
                            }).catch((err) => {
                                callback({ "code": 500, "error": err })
                            })
                        }).catch((err) => {
                            callback({ "code": 500, "error": err })
                        })
                    } else {
                        callback({ "code": 404, "error": `${data.data.mac} not yet registered` })

                    }

                }).catch((err) => {
                    callback({ "code": 500, "error": err })

                })
            } else {
                callback({ "code": 404, "error": `${data.data.mail} not found...` })
            }
        }).catch((err) => {
            callback({ "code": 500, "Reason": err })
        })
    }

    private unRegister_Device = async (data: { "token": String, "data": { mac: String } }, callback: any) => {
        await deviceModel.findOne({ macid: data.data.mac }).then(async (res) => {
            if (res) {
                await userModel.findOne({ uid: this.socket.data.user.uid }).then(async (resss) => {
                    if (res.mail != resss.mail && !res.approved.find(element => this.socket.data.user.uid.toString() == element)) {
                        callback({ "code": 201, "error": `You have no access to unregister this device` })
                    } else {
                        await deviceModel.deleteOne({ macid: data.data.mac }).then(async (ress) => {
                            resss.devices.splice(Object.keys(resss.devices).indexOf(data.data.mac.toString()), 1)
                            await userModel.updateOne({ uid: this.socket.data.user.uid }, resss).then((res) => {
                                callback({ "code": 200, "error": `You have unregistered this device` })
                            }).catch((err) => {
                                callback({ "code": 500, "error": err })

                            })
                        }).catch((err) => {
                            callback({ "code": 500, "error": err })

                        })
                    }
                }).catch((err) => {
                    callback({ "code": 500, "error": err })
                })


            } else {
                callback({ "code": 404, "message": "Device does not exists" });
            }


        }).catch((err) => {
            callback({ "code": 500, "error": err });
        })

    }

    private Get_all_devices = async (data: { "token": String }, callback: any) => {
        await userModel.findOne({ uid: this.socket.data.user.uid }).then(async (res) => {
            if (res) {
                var finaljson = {
                    "owned": {},
                    "other": {}
                }
                var sendData = res.devices.map(async (e, i) => {
                    console.log(e, i);
                    await deviceModel.findOne({ macid: Object.keys(e)[0] }).then((ress) => {

                        if (e[Object.keys(e)[0]] == "owner") {
                            finaljson.owned[Object.keys(e)[0]] = ress
                        } else {
                            finaljson.other[Object.keys(e)[0]] = ress
                        }
                        if (i == res.devices.length - 1) {
                            callback({ "code": 200, "data": finaljson })

                        }
                    }).catch((err) => {
                        callback({ "code": 500, "error": err })
                    })


                })


            } else {
                callback({ "code": 404, "error": "Account does not exists" })


            }



        }).catch((err) => {
            callback({ "code": 500, "error": err });
        })

    }

    private Get_device = async (data: { "token": String, data: { mac: String } }, callback: any) => {
        await deviceModel.findOne({ macid: data.data.mac }).then(async (res) => {
            if (res) {
                callback({ "code": 200, "data": res })
            } else {
                callback({ "code": 101, "error": "Device not registered" })
            }
        }).catch((err) => {
            callback({ "code": 500, "error": err });
        })

    }

    private update_device = async (data: { "token": String, data: Device }, callback: any) => {
        await userModel.findOne({ uid: this.socket.data.user.uid }).then(async (res) => {
            if (res) {
                await deviceModel.findOne({ macid: data.data.macid }).then(async (ress) => {
                    if (ress) {
                        await deviceModel.updateOne({ macid: data.data.macid }, data.data).then(() => {
                            callback({ "code": 200, "message": "updated device info" })
                        }).catch((err) => {
                            callback({ "code": 500, "error": err })

                        })
                    } else {
                        callback({ "code": 500, "error": "Device not yet registered" })

                    }

                }).catch((err) => {
                    callback({ "code": 500, "error": err })
                })


            } else {
                callback({ "code": 404, "error": "Account does not exists" })


            }

            if (res) {
                // await userModel.deleteOne({uid: this.socket.data.uid });
                callback(null, 'USER_DELETED');

            } else {
                callback({ "code": 404, "Reason": "No user exists" })
            }

        }).catch((err) => {
            callback({ "code": 500, "error": err });
        })

    }

    private socketlisten = async (data: { token: String, data: { mac: String, } }) => {
        deviceModel.watch([
            {
                '$match': {
                    'operationType': 'insert',
                    'fullDocument.address.country': 'Australia',
                    'fullDocument.address.market': 'Sydney'
                }
            }
        ]).on('change',(data)=>{
            console.log(data);
            
        })

        const changeStream = deviceModel.watch([], { fullDocument: 'updateLookup' });
      
changeStream.on('change', obj => {
  console.log(obj);
});


        // deviceModel.watch([{ $match: { } }]).on('change', data => {
        //     console.log('Insert action triggered');
        //     console.log(new Date(), data);
        //     deviceModel.find({}, (err, data) => {
        //         if (err) throw err;
        //         if (data) {
        //             // RESEND ALL USERS
        //             console.log(data);

        //             // this.socket.emit("Get_device", data);
        //         }
        //     });

        // });


    }
    private disconnect = (reason: string) => {
        console.info(`Socket disconnected: ${this.socket.id}, reason: ` + reason);
    };



}

export default DeviceController;