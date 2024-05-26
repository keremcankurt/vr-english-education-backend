const CustomError = require("../helpers/error/CustomError");
const User = require("../models/User");
const {
  validateUserInput,
  comparePassword,
} = require("../helpers/input/inputHelpers");
const { v4: uuidv4 } = require('uuid');
const sendEmail = require("../helpers/libraries/sendEmail");

const register = async (req, res, next) => {
  try {
    const {
      TC,
      fullName,
      email,
      password,
      teacherId,
      isTeacher
    } = req.body;
    let randomId;
    let emailTemplate = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Engslish Education Uygulamamıza Hoş Geldiniz</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
            .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
            .header { background-color: #4CAF50; padding: 10px; text-align: center; border-radius: 8px 8px 0 0; }
            .header img { max-width: 100px; margin-bottom: 10px; border-radius: 50%; }
            .header h1 { color: #ffffff; margin: 0; font-size: 24px; }
            .content { padding: 20px; text-align: left; line-height: 1.6; }
            .content h2 { color: #333333; }
            .content p { color: #555555; }
            .footer { text-align: center; padding: 10px; font-size: 12px; color: #aaaaaa; margin-top: 20px; border-top: 1px solid #dddddd; }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <img src="https://englisheducation-vr.netlify.app/logo.png" alt="Education-VR Logo">
                <h1>Engslish Education Uygulamamıza Hoş Geldiniz!</h1>
            </div>
            <div class="content">
                <h2>Sevgili ${fullName},</h2>
                <p>İngilizce Eğitim-VR programımıza kaydolduğunuz için teşekkür ederiz. Sizi aramızda görmekten büyük mutluluk duyuyoruz!</p>
                <p>Programımız, İngilizce öğrenme ve pratiği yapmanızı sağlayacak sanal bir ortam sunar.</p>
                <p>Başlamak için yapmanız gereken adımlar şunlardır:</p>
                <ul>
                    <li><strong>Adım 1:</strong> Hesabınıza kullanıcı bilgilerinizle giriş yapın.</li>
                    <li><strong>Adım 2:</strong> VR ortamlarımızı keşfedin ve ilk dersinize başlayın.</li>
                </ul>
                <p>Herhangi bir sorunuz veya yardıma ihtiyacınız olursa, <a href="mailto:englisheducationVR@gmail.com">englisheducationVR@gmail.com</a> adresinden destek ekibimize ulaşabilirsiniz.</p>
                <p>İyi öğrenmeler!</p>
                <p>Saygılarımızla,</p>
                <p>English Education Ekibi</p>
            </div>
            <div class="footer">
                <p>© 2024 English Education. Tüm hakları saklıdır.</p>
            </div>
        </div>
    </body>
    </html>
  `;
    if(isTeacher){
      randomId = uuidv4();
      emailTemplate = `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Engslish Education Uygulamamıza Hoş Geldiniz</title>
          <style>
              body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
              .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
              .header { background-color: #4CAF50; padding: 10px; text-align: center; border-radius: 8px 8px 0 0; }
              .header img { max-width: 100px; margin-bottom: 10px; border-radius: 50%; }
              .header h1 { color: #ffffff; margin: 0; font-size: 24px; }
              .content { padding: 20px; text-align: left; line-height: 1.6; }
              .content h2 { color: #333333; }
              .content p { color: #555555; }
              .footer { text-align: center; padding: 10px; font-size: 12px; color: #aaaaaa; margin-top: 20px; border-top: 1px solid #dddddd; }
          </style>
      </head>
      <body>
          <div class="email-container">
              <div class="header">
                  <img src="https://englisheducation-vr.netlify.app/logo.png" alt="Education-VR Logo">
                  <h1>Engslish Education Uygulamamıza Hoş Geldiniz!</h1>
              </div>
              <div class="content">
                  <h2>Sevgili Öğretmenimiz,</h2>
                  <p>Education-VR programımıza katıldığınız için teşekkür ederiz. Sizi aramızda görmekten büyük mutluluk duyuyoruz!</p>
                  <p>Sizinle birlikte, öğrencilerinizin İngilizce öğreniminde en iyi deneyimi yaşamalarını sağlamak istiyoruz.</p>
                  <p>Öğrencilerinizin sisteme kayıt olabilmesi için onlara aşağıdaki öğretmen kimliğini (teacherId) vermeniz gerekmektedir:</p>
                  <p><strong>Öğretmen Kimliği (teacherId): ${randomId}</strong></p>
                  <p>Öğrencileriniz, bu kimliği kullanarak sisteme kayıt olabilir ve derslerine başlayabilirler.</p>
                  <p>Herhangi bir sorunuz veya yardıma ihtiyacınız olursa, <a href="mailto:englisheducationVR@gmail.com">englisheducationVR@gmail.com</a> adresinden destek ekibimize ulaşabilirsiniz.</p>
                  <p>İyi çalışmalar dileriz!</p>
                  <p>Saygılarımızla,</p>
                  <p>English Education Ekibi</p>
              </div>
              <div class="footer">
                  <p>© 2024 English Education. Tüm hakları saklıdır.</p>
              </div>
          </div>
      </body>
      </html>
  `;
    }else {
      const existingTeacher = await User.findOne({
        teacherId: teacherId,
        isTeacher: true
      });
      if (!existingTeacher) {
        return res.status(400).json({
          message: "Belirtilen öğretmen ID değerine ait bir öğretmen bulunamadı."
        });
      }
    }
    const user = await User.create({
      TC,
      fullName,
      email,
      password,
      teacherId: isTeacher ? randomId : teacherId,
      isTeacher
    })
    
    await sendEmail({
      from: process.env.SMTP_ADMIN,
      to: email,
      subject: "Welcome to Engllish Education",
      html: emailTemplate,
    });
    return res.status(200).json({
      message: "Kayıt Başarılı! Uygulamaya Hoşgeldiniz. Lütfen Giriş Yapınız.",
    });
  } catch (error) {
    next(error);
  }
  };

  const login = async (req, res, next) => {
    const { TC, password, isGame } = req.body;
  
    if (!validateUserInput(TC, password)) {
      return next(new CustomError("Lütfen geçerli alanları doldurun.", 400));
    }
  
    const user = await User.findOne({ TC }).select("+password");
  
    if (!user) {
      return next(new CustomError("Girilen TC kimlik numarasına ait kullanıcı bulunamadı.", 400));
    }
  
    if (!comparePassword(password, user.password)) {
      return next(new CustomError("Girilen bilgileri kontrol ediniz.", 400));
    }
  
    if (isGame) {
      user.lastLoginDate = Date.now();
      await user.save();
    }
  
    // Game alanını çıkar
    const { game, ...userWithoutGame } = user.toObject();
  
    // Exam alanını gruplayıp en yüksek puanları seç
    const examScores = {};
    user.exam.forEach(exam => {
      if (!examScores[exam.content] || examScores[exam.content] < exam.point) {
        examScores[exam.content] = exam.point;
      }
    });
  
    // Sadece en yüksek puanları içeren examScores objesini oluştur
    const highestExamScores = Object.keys(examScores).map(content => ({
      content,
      point: examScores[content]
    }));
  
    return res.status(200).json({ ...userWithoutGame, exam: highestExamScores });
  };
  
  



module.exports = {
  register,
  login,
};
