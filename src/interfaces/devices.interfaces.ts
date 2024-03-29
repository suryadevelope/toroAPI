export interface Device {
  macid: string
  mail: string
  approved:object[]
  devicename: string
  devicetype: boolean
  devicestate: boolean
  pumpState: boolean,
  manualMode: boolean
  setPowerState: boolean
  upTime: string
  loc: string[]
  grill: {
    temp: number,
    humid: number
  }
  outdoor: {
    temp: number,
    humid: number
  }
  filter: boolean
  fan: {
    state: boolean,
    speed: {
      rpm: number,
      Hz: number
    },
    volts: string,
    amps: string,
    watts: string
  },
  waterLevel: boolean
  selfcare: {
    date: string,
    day: string,
    time: string
  },
  SystemWatts: string
  set_point_temp: string
  add_humid_val: string
  default_hz: string
  fire_safety_state: boolean
}