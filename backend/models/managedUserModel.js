import mongoose from "mongoose";

const managedUserSchema = new mongoose.Schema(
  {
    first_name: {type: String,required: true,},
    last_name: {type: String,required: true},
    email: {type: String,required: true, unique: true},
    gender: {type: String,required: true},
    job_title: {type: String,required: true},
    isDeleted: {type: Boolean, default: false }
  },
  { timestamps: true }
);

const ManagedUser = mongoose.model("ManagedUser", managedUserSchema);
export default ManagedUser;