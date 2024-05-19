# VR English Education Backend

Bu proje, bitirme tezim için yapmış olduğum Sanal Gerçeklik ile İngilizce Eğitimi projesinin backend kısmını içermektedir. Bu proje, kullanıcı kimlik doğrulama, kurs içeriği yönetimi ve öğrenci sonuçlarının kaydedilmesi gibi fonksiyonları sağlamaktadır.

## Kurulum

Öncelikle projeyi yerel makinenize klonlayın:

```sh
git clone https://github.com/kullanici-adi/vr-english-education-backend.git
```
Daha sonra proje dizinine gidin: npm install

## Endpointler

### Auth

**POST /auth/login**
Kullanıcı girişini gerçekleştirir.

#### Request Body:
* TC: Kullanıcı TC kimlik numarası
* password: Kullanıcı şifresi
* isGame: (Opsiyonel) VR üzerinden giriş yapılıyorsa true

**POST /auth/register**
Yeni kullanıcı kaydı oluşturur.

#### Request Body:

* TC: Kullanıcı TC kimlik numarası

* fullName: Kullanıcı adı ve soyadı

* email: Kullanıcı e-posta adresi

* password: Kullanıcı şifresi

* teacherId: (Opsiyonel) Öğretmen ID, öğretmen değilse gönderilmemeli

* isTeacher: Kullanıcı öğretmen ise true

### Course

**GET /course/:content**

Belirtilen içerik türü hakkında bilgi getirir.

#### URL Parametreleri:

* content: İçerik ismi (Words, Friends, Numbers vs.)

#### Request Body:

* TC: Kullanıcı TC kimlik numarası

#### Response:
* studentsWithContent: Bölümü tamamlayan öğrenciler dizisi

* studentsWithHighestPoints: Bölümün en yüksek sınav sonuçları dizisi

* gamesWithContent: Oyun skorları dizisi


### Student

**POST /student/add-course**

Belirtilen içeriği kullanıcıya ekler. VR üzerinden bölüm tamamlandıktan sonra kullanılır.

#### Request Body:

* TC: Kullanıcı TC kimlik numarası
* content: İçerik ismi (Words, Friends vs.)
* POST /student/add-game
* Oyun sonuçlarını kaydeder. VR üzerinden oyun tamamlandığında kullanılır.

#### Request Body:
* TC: Kullanıcı TC kimlik numarası
* content: İçerik ismi (Words, Friends vs.)
* point: Kullanıcının puanı
* pointType: Puan türü (Time, Point)

** POST /student/add-exam **

Sınav sonuçlarını kaydeder. VR üzerinden sınav tamamlandığında kullanılır.

#### Request Body:
* TC: Kullanıcı TC kimlik numarası
* content: İçerik ismi (Words, Friends vs.)
* point: Kullanıcının puanı
* Kullanılan Kütüphaneler
* bcryptjs: Kullanıcı şifrelerini kriptolamak için kullanıldı.
* mongoose: MongoDB veritabanı ile etkileşim için kullanıldı.
* multer: Dosya yükleme işlemleri için kullanıldı.
* nodemailer: E-posta göndermek için kullanıldı.
* uuid: Rastgele öğretmen ID oluşturmak için kullanıldı.
