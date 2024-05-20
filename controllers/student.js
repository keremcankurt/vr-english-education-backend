const CustomError = require("../helpers/error/CustomError");
const User = require("../models/User");
const sendEmail = require("../helpers/libraries/sendEmail");

const addCourse = async (req, res, next) => {
  try {
    const { TC, content } = req.body
    const student = await User.findOne({TC: TC});

    if (!student) {
      return res.status(404).json({ error: 'Öğrenci bulunamadı' });
    }
    if (student.completedCourse.includes(content)) {
      return res.status(200).json({ message: 'Bu ders zaten tamamlanmış' });
    }
    student.completedCourse.push(content);
    await student.save();

    const date = new Date(Date.now());

    const timeZoneOffset = 3 * 60 * 60 * 1000; 
    const newDate = new Date(date.getTime() + timeZoneOffset);
    const formattedDate = newDate.toLocaleString('tr-TR', { hour12: false });
    let emailTemplate = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Completed Course</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
            .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
            .header { background-color: #4CAF50; padding: 10px; text-align: center; border-radius: 8px 8px 0 0; }
            .header img { max-width: 100px; margin-bottom: 10px;border-radius: 50%; }
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
                <h1>Completed Course!</h1>
            </div>
            <div class="content">
                <h2>Sevgili ${student.fullName},</h2>
                <p>Tebrikler! Dersi "${content}" başarıyla tamamladınız. Oyunlar ile konuyu pekiştirdikten sonra sınava girmeyi unutma. Tamamlama zamanı: ${formattedDate}</p>
                
                <p>Herhangi bir sorunuz veya yardıma ihtiyacınız olursa, <a href="mailto:cankeremkurt@gmail.com">cankeremkurt@gmail.com</a> adresinden destek ekibimize ulaşabilirsiniz.</p>
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
    await sendEmail({
      from: process.env.SMTP_ADMIN,
      to: student.email,
      subject: "Completed Course",
      html: emailTemplate,
    });
    
    const teacher = await User.findOne({teacherId: student.teacherId, isTeacher: true})
    emailTemplate = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Completed Course: ${student.fullName}</title>
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
                <h1>Completed Course!</h1>
            </div>
            <div class="content">
                <h2>Sevgili Öğretmenimiz,</h2>
                <p>Öğrenciniz ${student.fullName} Dersi "${content}" başarıyla tamamladı. Tamamlama zamanı: ${formattedDate}</p>
                
                <p>Herhangi bir sorunuz veya yardıma ihtiyacınız olursa, <a href="mailto:cankeremkurt@gmail.com">cankeremkurt@gmail.com</a> adresinden destek ekibimize ulaşabilirsiniz.</p>
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
  await sendEmail({
    from: process.env.SMTP_ADMIN,
    to: teacher.email,
    subject: `Completed Course: ${student.fullName}`,
    html: emailTemplate,
  });
    return res.status(200).json({ message: 'Ders başarıyla eklendi' });
  } catch (error) {
    console.log(error.message)
    next(error)
  }
};

const addGame = async (req, res, next) => {
  try {
    const { TC, content, point, pointType } = req.body
    const student = await User.findOne({TC: TC});

    if (!student) {
      return res.status(404).json({ error: 'Öğrenci bulunamadı' });
    }
    student.game.push({content, point, pointType});
    await student.save();
    const date = new Date(Date.now());
    const timeZoneOffset = 3 * 60 * 60 * 1000; 
    const newDate = new Date(date.getTime() + timeZoneOffset);
    const formattedDate = newDate.toLocaleString('tr-TR', { hour12: false });
    let emailTemplate = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Completed Game</title>
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
                <h1>Completed Game!</h1>
            </div>
            <div class="content">
                <h2>Sevgili ${student.fullName},</h2>
                <p>Tebrikler! Oyunu "${content}" başarıyla tamamladınız.<br/>${pointType == "Time" ? "Süre: "+Math.floor(point / 60).toString().padStart(2, '0')+":"+(point%60).toString().padStart(2, '0'): "Puan: "+point}<br/> Tamamlama zamanı: ${formattedDate}</p>
                
                <p>Herhangi bir sorunuz veya yardıma ihtiyacınız olursa, <a href="mailto:cankeremkurt@gmail.com">cankeremkurt@gmail.com</a> adresinden destek ekibimize ulaşabilirsiniz.</p>
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
    await sendEmail({
      from: process.env.SMTP_ADMIN,
      to: student.email,
      subject: "Completed Game",
      html: emailTemplate,
    });
    
    const teacher = await User.findOne({teacherId: student.teacherId, isTeacher: true})
    emailTemplate = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Completed Game: ${student.fullName}</title>
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
                <h1>Completed Course!</h1>
            </div>
            <div class="content">
                <h2>Sevgili Öğretmenimiz,</h2>
                <p>Öğrenciniz ${student.fullName} Oyunu "${content}" başarıyla tamamladı.<br/>${pointType == "Time" ? "Süre: "+Math.floor(point / 60).toString().padStart(2, '0')+":"+(point%60).toString().padStart(2, '0'): "Puan: "+point}<br/> Tamamlama zamanı: ${formattedDate}</p>
                
                <p>Herhangi bir sorunuz veya yardıma ihtiyacınız olursa, <a href="mailto:cankeremkurt@gmail.com">cankeremkurt@gmail.com</a> adresinden destek ekibimize ulaşabilirsiniz.</p>
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
  await sendEmail({
    from: process.env.SMTP_ADMIN,
    to: teacher.email,
    subject: `Completed Game: ${student.fullName}`,
    html: emailTemplate,
  });
    return res.status(200).json({ message: 'Oyun başarıyla eklendi' });
  } catch (error) {
    console.log(error.message)
    next(error)
  }
};
  

const addExam = async (req, res, next) => {
  try {
    const { TC, content, point } = req.body
    const student = await User.findOne({TC: TC});

    if (!student) {
      return res.status(404).json({ error: 'Öğrenci bulunamadı' });
    }
    student.exam.push({content, point});
    await student.save();
    const date = new Date(Date.now());
    const timeZoneOffset = 3 * 60 * 60 * 1000; 
    const newDate = new Date(date.getTime() + timeZoneOffset);
    const formattedDate = newDate.toLocaleString('tr-TR', { hour12: false });
    let emailTemplate = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Exam Result</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
            .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
            .header { background-color: ${point < 50 ? "#a83232;" : "#4CAF50;"} padding: 10px; text-align: center; border-radius: 8px 8px 0 0; }
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
                <h1>Exam Result!</h1>
            </div>
            <div class="content">
                <h2>Sevgili ${student.fullName},</h2>
                ${
                  point < 50 ?
                  `
                  <div>
                    <p>Maalesef "${content}" dersinin sınavından yeterli puanı alamadın. Lütfen daha çok çalışıp tekrar sınava gir.</p>
                    <p>Puan: ${point}</p>
                    <p>Sınava giriş tarihi: ${formattedDate}</p>
                  </div>`
                  :
                  `
                    <>
                      <p>Tebrikler!"${content}" dersinin sınavından yeterli puanı aldın. Sonraki derse geçebilirsin.</p>
                      <p>Puan: ${point}</p>
                      <p>Sınava giriş tarihi: ${formattedDate}</p>
                    </>
                  `

                }
                <p>Herhangi bir sorunuz veya yardıma ihtiyacınız olursa, <a href="mailto:cankeremkurt@gmail.com">cankeremkurt@gmail.com</a> adresinden destek ekibimize ulaşabilirsiniz.</p>
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
    await sendEmail({
      from: process.env.SMTP_ADMIN,
      to: student.email,
      subject: "Exam Result",
      html: emailTemplate,
    });
    
    const teacher = await User.findOne({teacherId: student.teacherId, isTeacher: true})
    emailTemplate = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Exam Result: ${student.fullName}</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
            .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
            .header { background-color: ${point < 50 ? "#a83232;" : "#4CAF50;"} padding: 10px; text-align: center; border-radius: 8px 8px 0 0; }
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
                <h1>Exam Result!</h1>
            </div>
            <div class="content">
                <h2>Sevgili Öğretmenimiz,</h2>
                <p>Öğrenciniz ${student.fullName} "${content}" dersinin sınavından ${point} puan almıştır.<br/> Sınava giriş zamanı: ${formattedDate}</p>
                <p>Herhangi bir sorunuz veya yardıma ihtiyacınız olursa, <a href="mailto:cankeremkurt@gmail.com">cankeremkurt@gmail.com</a> adresinden destek ekibimize ulaşabilirsiniz.</p>
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
  await sendEmail({
    from: process.env.SMTP_ADMIN,
    to: teacher.email,
    subject: `Exam Result: ${student.fullName}`,
    html: emailTemplate,
  });
    return res.status(200).json({ message: 'Sınav Sounucu başarıyla eklendi' });
  } catch (error) {
    console.log(error.message)
    next(error)
  }
};


const getStudents = async (req, res, next) => {
  const { teacherId } = req.body;

  const students = await User.find({teacherId, isTeacher: false}).select("_id fullName")

  return res.status(200).json(students);
};
module.exports = {
  addCourse,
  addGame,
  addExam,
  getStudents
};
