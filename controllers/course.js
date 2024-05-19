const CustomError = require("../helpers/error/CustomError");
const User = require("../models/User");


const course = async (req, res, next) => {
    try {
      const { content } = req.params;
      const { TC } = req.body;
  
      const user = await User.findOne({ TC });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const teacherId = user.teacherId;
  
      // Completed Course İçinde content alanı olan Öğrencileri Getir
      const studentsWithContent = await User.find({
        teacherId,
        completedCourse: { $elemMatch: { $eq: content } }
      }).select('fullName');
  
      // En Yüksek Puanlı Öğrencileri Getir
      const studentsWithHighestPoints = await User.aggregate([
        { $match: { teacherId } },
        { $unwind: "$exam" },
        { $match: { "exam.content": content } },
        { 
          $group: {
            _id: "$_id",
            fullName: { $first: "$fullName" },
            maxExam: { $max: { point: "$exam.point", date: "$exam.date" } }
          }
        },
        { 
          $project: {
            _id: 1,
            fullName: 1,
            maxPoint: "$maxExam.point",
            date: "$maxExam.date"
          }
        },
        { $sort: { maxPoint: -1 } }
      ]);

      // Öğrencilerin sınav sonuçlarını getir
      let gamesWithContent = await User.aggregate([
        { $match: { teacherId } },
        { $unwind: "$game" },
        { $match: { "game.content": content } },
        {
          $group: {
            _id: "$game.content",
            pointType: { $first: "$game.pointType" },
            gameResult: {
              $push: {
                userId: "$_id",
                fullName: "$fullName",
                point: "$game.point",
                date: "$game.date"
              }
            }
          }
        }
      ]);

      gamesWithContent = gamesWithContent.map(game => {
        game.gameResult.sort((a, b) => {
          if (game.pointType === "Time") {
            return a.point - b.point;
          } else {
            return b.point - a.point;
          }
        });
        return game;
      });
  
      return res.status(200).json({ studentsWithContent, studentsWithHighestPoints, gamesWithContent });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  };

  
  



module.exports = {
    course,
};
