import mongoose from "mongoose";

const agencySchema = new mongoose.Schema({
  name: { type: String, required: true },
  address1: { type: String, required: true },
  address2: { type: String },
  state: { type: String, required: true },
  city: { type: String, required: true },
  phoneNumber: { type: String, required: true }
});

export const Agency = mongoose.model("Agency", agencySchema);

const clientSchema = new mongoose.Schema({
  agencyId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  totalBill: { type: Number, required: true }
});

export const Client = mongoose.model("Client", clientSchema);
