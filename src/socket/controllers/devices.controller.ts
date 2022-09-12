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
                await userModel.findOne({ uid: this.socket.data.user.uid }).then((ress) => {
                    if (res.approved.find(element => this.socket.data.user.uid.toString() == element)) {
                        callback({ "code": 201, "error": `${ress.mail} has already registered this device and you have access to it` })
                    } else {
                        callback({ "code": 404, "error": `You have no access to register this device. please contact ${ress.mail}` })
                    }
                }).catch((err) => {
                    callback({ "code": 500, "error": err })
                })


            } else {
                await deviceModel.create(data.data).then((res) => {
                    callback({ "code": 200, "message": "Device registered successfully" });
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

    private Auth_user = async (data: { "token": String, "data": { mail: String, mac: String } }, callback: any) => {

        await userModel.findOne({ mail: data.data.mail }).then(async (ress) => {
            if (ress) {
                await deviceModel.findOne({ mac: data.data.mac }).then(async (resdevice) => {
                    if (resdevice) {
                        resdevice.approved.push(ress.uid);
                        deviceModel.updateOne({ macid: data.data.mac }, resdevice).then(() => {
                            callback({ "code": 200, "message": `${data.data.mail} updated to ${data.data.mac}` })
                        }).catch((err) => {
                            callback({ "code": 500, "error": err })
                        })
                    } else {
                        callback({ "code": 404, "error": `${data.data.mac} not yet registered` })

                    }

                }).catch((err) => {
                    callback({ "code": 500, "error": err })

                })
                callback({ "code": 200, "error": `${ress.mail} has already registered this device and you have access to it` })
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
                        resdevice.approved.splice(resdevice.approved.findIndex(ele => ele == ress.uid), 1);
                        deviceModel.updateOne({ macid: data.data.mac }, resdevice).then(() => {
                            callback({ "code": 200, "message": `${data.data.mail} removed from ${data.data.mac}` })
                        }).catch((err) => {
                            callback({ "code": 500, "error": err })
                        })
                    } else {
                        callback({ "code": 404, "error": `${data.data.mac} not yet registered` })

                    }

                }).catch((err) => {
                    callback({ "code": 500, "error": err })

                })
                callback({ "code": 200, "error": `${ress.mail} has already registered this device and you have access to it` })
            } else {
                callback({ "code": 404, "error": `${data.data.mail} not found...` })
            }
        }).catch((err) => {
            callback({ "code": 500, "Reason": err })
        })
    }

    private unRegister_Device = async (data: { "token": String, "data": { mac: String } }, callback: any) => {
        await deviceModel.findOne({ mac: data.data.mac }).then(async (res) => {
            if (res) {
                await userModel.findOne({ uid: this.socket.data.user.uid }).then(async (resss) => {
                    if (!res.approved.find(element => this.socket.data.user.uid.toString() == element)) {
                        callback({ "code": 201, "error": `You have no access to unregister this device` })
                    } else {
                        await deviceModel.deleteOne({ macid: data.data.mac }).then(async (ress) => {
                            resss.devices.splice(resss.devices.indexOf(data.data.mac.toString()), 1)
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
                await deviceModel.create(data.data).then((res) => {
                    callback({ "code": 200, "message": "Device registered successfully" });
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

    private Get_all_devices = async (data: { "token": String }, callback: any) => {
        await userModel.findOne({ uid: this.socket.data.user.uid }).then(async (res) => {
            if (res) {
                var devices = res.devices
                var sendData = devices.map(async (e) => {
                    await deviceModel.findOne({ macid: e }).then((ress) => {
                        return { [e]: ress }
                    }).catch((err) => {
                        callback({ "code": 500, "error": err })
                    })

                })
                callback({ "code": 200, "data": sendData })

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

    private Get_device = async (data: { "token": String ,mac:String}, callback: any) => {
        await deviceModel.findOne({ macid: data.mac }).then(async (res) => {
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
                await deviceModel.findOne({ macid: data.data.macid }).then((ress) => {
                    if (ress) {
                        deviceModel.updateOne({ macid: data.data.macid }, data.data).then(() => {
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

    private socketlisten = async (data: {token:String,data:{mac:String,}}) => {
        deviceModel.watch([{ $match: {operationType: {$in: ['insert']}}}]).
            on('change', data => {
                console.log('Insert action triggered');
                console.log(new Date(), data);
                this.socket.emit("Get_device", data); 
            
            });
    
      }
    private disconnect = (reason: string) => {
        console.info(`Socket disconnected: ${this.socket.id}, reason: ` + reason);
    };



}

export default DeviceController;