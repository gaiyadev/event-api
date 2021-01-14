const User = require("../../models/user");
const bcrypt = require("bcrypt");
const consola = require("consola");
const jwt = require("jsonwebtoken");
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
  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User does nt exist");
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error("Password do not match!");
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      {expiresIn: '1h'}
    );
    return { userId: user.id, token, token, email: user.email, tokenExpired: 1 };
  },
};
