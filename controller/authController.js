const User = require("../models/User");
const Role = require("../models/Role");
const bcrypt = require('bcryptjs');
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./config.env" });


const generateAccessToekn = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "24h" })
}

class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: "Error validator" })
            }
            const { username, email, password, phone, address } = req.body;
            //check to same user name 
            const candidate = await User.findOne({ username });
            if (candidate) {
                return res.status(400).json({ message: "user not have" });
            }
            const hashPassword = bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({ value: "USER" });
            const user = new User({ username, password: hashPassword, email, phone, address, roles: [userRole.value] });

            await user.save();

            return res.json({ message: "Success authrization" })
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "user  not have token" })
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: `User ${email} not finded` });
            }
            const validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword) {
                return res.status(400).json({ message: "Not correctly password" });
            }
            const token = generateAccessToekn(user._id, user.roles);

            return res.json({ token })
        } catch (e) {
            console.log(e);
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find()
            res.json(users);
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = new authController();