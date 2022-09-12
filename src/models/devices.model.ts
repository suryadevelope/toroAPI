import { model, Schema, Document } from 'mongoose';
import { Device } from '@interfaces/devices.interfaces';

const DevicesSchema: Schema = new Schema({
  macid: {
    type: String,
    required: true
  },
  approved: {
    type: String,
    default: []
  },
  devicename: {
    type: String,
    required: true
  },
  devicetype: {
    type: Boolean,
    required: true
  },
  devicestate: {
    type: Boolean,
    required: true
  },
  pumpState: {
    type: Boolean,
    required: true
  },
  manualMode: {
    type: Boolean,
    required: true
  },
  setPowerState: {
    type: Boolean,
    required: true
  },
  upTime: {
    type: String,
    required: true
  },
  loc: {
    type: Array,
    required: true
  },
  grill: {
    type: Object,
    required: true
  },
  outdoor: {
    type: Object,
    required: true
  },
  filter: {
    type: Boolean,
    required: true
  },
  fan: {
    type: Object,
    required: true
  },
  waterLevel: {
    type: Boolean,
    required: true
  },
  selfcare: {
    type: Object,
    required: true
  },
  SystemWatts: {
    type: String,
    required: true
  },
  set_point_temp: {
    type: String,
    required: true
  },
  add_humid_val: {
    type: String,
    required: true
  },
  default_hz: {
    type: String,
    required: true
  },
  fire_safety_state: {
    type: Boolean,
    required: true
  },
});

const deviceModel = model<Device & Document>('Devices', DevicesSchema);

export default deviceModel;
