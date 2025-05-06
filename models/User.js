import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  line1: String,
  line2: String,
  line3: String,
  postcode: String,
  country: String,
  telephone: String,
  email: String,
});

const qualificationSchema = new mongoose.Schema({
  degree: String,
  institution: String,
  graduationYear: String,
});

const employmentHistorySchema = new mongoose.Schema({
  employer: String,
  titleDescription: String,
  dateFrom: Date,
  dateTo: Date,
});

const disabilitiesSchema = new mongoose.Schema({
  disabilities: {
    hearing: Boolean,
    vision: Boolean,
    mobility: Boolean,
    learning: Boolean,
    mentalHealth: Boolean,
  },
  otherDisabilityDetails: String,
  supportDetails: String,
  certifyDate: Date,
});

const programSchema = new mongoose.Schema({
  program: String,
  modeOfStudy: String,
  entryDate: Date,
  selectedCore: String,
  selectedElective: String,
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: String,
  role: {
    type: String,
    enum: ['admin', 'teacher', 'student'],
    default: 'student',
  },
  userData: {
    photo: {  },
    applicationNo: String,
    title: String,
    surname: String,
    forename1: String,
    forename2: String,
    forename3: String,
    dob: Date,
    matriculationNo: String,
  },
  userProgram: programSchema,
  userHomeAddress: {
    permanentAddress: addressSchema,
  },
  userContactAddress: {
    permanentAddress: addressSchema,
  },
  userQualification: {
    qualifications: [qualificationSchema],
  },
  userEmploymentHistory: {
    employmentHistory: [employmentHistorySchema],
  },
  userDisabilities: disabilitiesSchema,
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
