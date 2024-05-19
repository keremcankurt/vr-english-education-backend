const bcrypt = require("bcryptjs");
const validateUserInput = (TC,password) => {
    return TC && password;
};
const comparePassword = (password,hashedPassword) => {
    return bcrypt.compareSync(password,hashedPassword);
};
module.exports = {
    validateUserInput,
    comparePassword
}