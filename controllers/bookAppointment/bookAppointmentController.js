const db = require("../../model/index");
const sequelize = db.sequelize;
const User = db.users;
const AppError = require("../../utils/appError");
const sendEmail = require("../../utils/email");
const PDFDocument = require("pdfkit");

const { QueryTypes, DataTypes } = require("sequelize");
exports.renderBookAppointmentForm = async (req, res) => {
  res.render("bookAppointment/createForm");
};
exports.createBookAppointment = async (req, res, next) => {
  const { email } = req.user;
  if (!email) {
    email = req.body.email;
  }
  const { name, age, address, phone, bloodGroup, donationDate } = req.body;
  if (!name || !age || !address || !phone || !bloodGroup || !donationDate) {
    req.flash("error", "Please provide all fields");
    return res.redirect("/");
  }
  await sequelize.query(
    "CREATE TABLE IF NOT EXISTS bookAppointment (id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,name VARCHAR(255),age VARCHAR(255),address VARCHAR(255),phone VARCHAR(255),bloodGroup VARCHAR(255),donationDate VARCHAR(255))",
    { type: QueryTypes.CREATE }
  );
  await sequelize.query(
    "INSERT INTO bookAppointment(name,age,address,phone,bloodGroup,donationDate) VALUES(?,?,?,?,?,?) ",
    {
      type: QueryTypes.INSERT,
      replacements: [name, age, address, phone, bloodGroup, donationDate],
    }
  );
  req.flash("sucess", "Created book appointment sucessfully");
  try {
    const pdf = new PDFDocument();
    pdf.pipe(fs.createWriteStream("form.pdf"));
    pdf.text("Name: " + name);
    pdf.moveDown();
    pdf.text("Age: " + age);
    pdf.moveDown();
    pdf.text("Address: " + address);
    pdf.moveDown();
    pdf.text("Phone: " + phone);
    pdf.moveDown();
    pdf.text("bloodGroup:" + bloodGroup);
    pdf.moveDown();
    pdf.text("Donation Date: " + donationDate);
    pdf.moveDown();
    pdf.end();
    const message = [{ path: "form.pdf" }];
    await sendEmail({
      email: email,
      subject: "You date for book appointment is ",
      message,
    });
    res.redirect("/bloodBank");
  } catch (error) {
    console.log(error);
    req.flash("error", "something went wrong");
    res.redirect("/");
  }
};
