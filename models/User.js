const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  fullName: {
    type: String,
    required: [true, "Lütfen isminizi girin."],
  },
  TC: {
    type: Number,
    validate: {
      validator: function(v) {
        return v.toString().length === 11;
      },
      message: "Kimlik numarası 11 karakter olmalıdır."
    },
    unique: true,
    required: [true, "Lütfen Kimlik numarası girin."],

  },
  email: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "Lütfen şifre girin."],
    minlength: [6, "Please provide a password at least 6 characters"],
    select: false,
  },
  teacherId: {
    type: String,
    required: [true, "Öğretmeninizden aldığınız numarayı girin."],
  },
  isTeacher:{
    type: Boolean,
    default: false
  },
  lastLoginDate: {
    type: Date,
  },
  completedCourse: [{
    type: String,
  }],
  exam: [{
    content: {
      type: String,
    },
    point: {
      type: Number
    },
    date: {
      type: Date,
      default:Date.now()
    }
  }],
  game: [{
    content: {
      type: String,
    },
    point: {
      type: Number
    },
    pointType: {
      type: String,
      enum: ["Time", "Point"]
    },
    date: {
      type: Date,
      default:Date.now()
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const saltRounds = 10;
  const myPlaintextPassword = this.password;
  bcrypt.genSalt(saltRounds, (err, salt) => {
    bcrypt.hash(myPlaintextPassword, salt, (err, hash) => {
      if (err) next(err);
      this.password = hash;
      next();
    });
  });
});
UserSchema.index({ name: 'text' });
module.exports = mongoose.model("User", UserSchema);
