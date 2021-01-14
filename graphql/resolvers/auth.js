const User = require("../../models/user");
const bcrypt = require("bcrypt");
const consola = require("consola");

module.exports = {
  // create User
  createUser: (args) => {
    const { email, password } = args.userInput;
    return User.findOne({ email: email })
      .then((user) => {
        if (user) {
          throw new Error("User already exist.");
        } else {
          return bcrypt
            .hash(password, 12)
            .then((hashedPassword) => {
              const newUser = new User({
                email: email,
                password: hashedPassword,
              });
              return newUser.save();
            })
            .then((result) => {
              consola.success("User added successfully");
              return { ...result._doc, password: null };
            })
            .catch((err) => {
              throw err;
            });
        }
      })
      .catch((err) => {
        throw err;
      });
  },
};
