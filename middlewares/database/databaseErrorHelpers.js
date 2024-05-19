const CustomError = require("../../helpers/error/CustomError");
const User = require("../../models/User");

const checkUserExists = (async (req, res, next) => {
  const {TC} = req.body;
  const user = await User.findOne({ TC: TC });
  if (!user) {
    return next(new CustomError("Bu kimlik numarasına ait bir kullanıcı bulunmamaktadır.", 500));
  }
  next();
});
const checkTeacherExists = (async (req, res, next) => {
  const {teacherId, id} = req.body
  const teacher = await User.findOne({teacherId: teacherId, _id: id, isTeacher: true})
    if(!teacher) {
      return next(new CustomError("Bu işlemi sadece öğretmenler gerçekleştirebilir.", 400));
    }
  next();
});

module.exports = {
  checkUserExists,
  checkTeacherExists
};
