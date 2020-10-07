const Users = require("../models/users");
const ObjectID = require("mongodb").ObjectID;

const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

dotenv.config();

/**
 * token option untuk digenerate
 *
 * algorithm, algoritma encryption (exp: "HS256", "HS384", "HS512", "PS256", and more)
 * expiresIn, token expired time (exp: "1d", 1 hari)
 *
 */
const sign_token = {
  issuer: process.env.ISSUER,
  subject: process.env.SUBJECT,
  algorithm: process.env.ALGORITHM,
  audience: process.env.AUDIENCE,
  expiresIn: process.env.DEFAULT_EXP,
};

const tokenAuth = async (req, res) => {
  try {
    const data = await jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET,
      sign_token
    );

    const user = await Users.findOne({ username: data.nameu });

    if (!user) {
      return res.status(401).send({
        status: {
          code: 401,
          message: "invalid token, your access is unauthorized",
        },
      });
    }

    if (user.token !== req.headers.authorization) {
      return res.status(401).send({
        status: {
          code: 401,
          message: "invalid token, your access is unauthorized",
        },
      });
    }

    return res.status(200).send({
      status: {
        code: 200,
        message: "OK",
      },
      data: {
        user: {
          namer: user.name,
          nameu: user.username,
          email: user.email,
        },
        avatar: user.avatar,
        token: user.token,
      },
    });
  } catch (err) {
    return res.status(401).send({
      status: {
        code: 401,
        message: err.message,
      },
    });
  }
};

const registerWithExternalDataThenLogin = async (req, res) => {
  try {
    const params = req.body;
    const paramsPassword = req.body.password;

    const user = await Users.findOne({ username: params.username });

    if (user) {
      const compare_password = bcrypt.compareSync(
        params.password,
        user.password
      );

      if (!compare_password) {
        return res.status(401).send({
          status: {
            code: 401,
            message: "username / password tidak sama",
          },
        });
      }

      const userData = {
        namer: user.name,
        nameu: user.username,
        email: user.email,
      };

      // generate token berdasarkan data user dari database
      const token = jwt.sign(userData, process.env.JWT_SECRET, sign_token);

      user.set({ token: token });
      user.save();

      return res.status(200).send({
        status: {
          code: 200,
          message: "OK",
        },
        data: {
          user: userData,
          avatar: user.avatar,
          token,
        },
      });
    } else {
      params.password = await bcrypt.hashSync(req.body.password, 10);
      params.token = params.token
        ? params.token
        : (await "_") +
          Math.random().toString(36).substr(2, 9) +
          params.username;

      const data = await Users.create(params);

      if (!data) {
        return res.status(400).send({
          status: {
            code: 400,
            message: "failed to add new user!",
          },
        });
      } else {
        const userNew = await Users.findOne({ username: params.username });

        const compare_password = await bcrypt.compareSync(
          paramsPassword,
          userNew.password
        );

        if (!compare_password) {
          return res.status(401).send({
            status: {
              code: 401,
              message: "username / password tidak sama",
            },
          });
        }

        const userData = {
          namer: userNew.name,
          nameu: userNew.username,
          email: userNew.email,
        };

        // generate token berdasarkan data user dari database
        const token = jwt.sign(userData, process.env.JWT_SECRET, sign_token);

        userNew.set({ token: token });
        userNew.save();

        return res.status(200).send({
          status: {
            code: 200,
            message: "OK",
          },
          data: {
            user: userData,
            avatar: user.avatar,
            token,
          },
        });
      }
    }
  } catch (err) {
    return res.status(400).send({
      status: {
        code: 400,
        message: err.message,
      },
    });
  }
};

const register = async (req, res) => {
  try {
    const params = req.body;

    // cek username, jika exist ditolak
    const duplicated = await Users.findOne({ username: params.username });

    if (duplicated) {
      return res.status(400).send({
        status: {
          code: 400,
          message: "username telah terpakai!",
        },
      });
    }

    // ubah password dengan encrypt
    params.password = await bcrypt.hashSync(req.body.password, 10);
    params.token = params.token
      ? params.token
      : (await "_") + Math.random().toString(36).substr(2, 9) + params.username;

    const data = await Users.create(params);

    return res.status(201).send({
      status: {
        code: 201,
        message: "CREATED",
      },
      data,
    });
  } catch (err) {
    return res.status(400).send({
      status: {
        code: 400,
        message: err.message,
      },
    });
  }
};

const login = async (req, res) => {
  try {
    const params = req.body;

    const user = await Users.findOne({ username: params.username });

    if (!user) {
      return res.status(401).send({
        status: {
          code: 401,
          message: "username / password tidak sama",
        },
      });
    }

    const compare_password = bcrypt.compareSync(params.password, user.password);
    if (!compare_password) {
      return res.status(401).send({
        status: {
          code: 401,
          message: "username / password tidak sama",
        },
      });
    }

    const userData = {
      namer: user.name,
      nameu: user.username,
      email: user.email,
    };

    // generate token berdasarkan data user dari database
    const token = jwt.sign(userData, process.env.JWT_SECRET, sign_token);

    user.set({ token: token });
    user.save();

    return res.status(200).send({
      status: {
        code: 200,
        message: "OK",
      },
      data: {
        user: userData,
        avatar: user.avatar,
        token,
      },
    });
  } catch (err) {
    return res.status(400).send({
      status: {
        code: 400,
        message: err.message,
      },
    });
  }
};

const logout = async (req, res) => {
  try {
    const data = await jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET,
      sign_token
    );

    const user = await Users.findOne({ username: data.nameu });

    if (!user) {
      return res.status(401).send({
        status: {
          code: 401,
          message: "invalid token, your access is unauthorized",
        },
      });
    }

    user.set({
      token: "_" + Math.random().toString(36).substr(2, 9) + user.username,
    });
    user.save();

    return res.status(200).send({
      status: {
        code: 200,
        message: "OK",
      },
    });
  } catch (err) {
    return res.status(401).send({
      status: {
        code: 401,
        message: err.message,
      },
    });
  }
};

const get_user_for_contact = async (req, res) => {
  try {
    const params = req.query;

    const data = await Users.find({
      $or: [{ name: { $regex: params.keyword, $options: "is" } }],
    });

    const newData = data.map((val) => ({
      username: val.username,
      name: val.name,
    }));

    return res.status(200).send({
      status: {
        code: 200,
        message: "OK",
      },
      data: newData,
    });
  } catch (err) {
    return res.status(400).send({
      status: {
        code: 400,
        message: err.message,
      },
    });
  }
};

const get_user_for_contact_by_uname = async (req, res) => {
  try {
    const params = req.query;

    const data = await Users.findOne({ username: params.uname });

    if (!data) {
      return res.status(400).send({
        status: {
          code: 400,
          message: "data tidak ditemukan!",
        },
      });
    }

    return res.status(200).send({
      status: {
        code: 200,
        message: "OK",
      },
      data: {
        name: data.name,
        email: data.email,
        lastSeen: data.updatedAt,
      },
    });
  } catch (err) {
    return res.status(400).send({
      status: {
        code: 400,
        message: err.message,
      },
    });
  }
};

module.exports = {
  tokenAuth,
  registerWithExternalDataThenLogin,
  register,
  login,
  logout,
  get_user_for_contact,
  get_user_for_contact_by_uname,
};
