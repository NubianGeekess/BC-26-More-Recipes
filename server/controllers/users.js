import jwt from 'jsonwebtoken';
import models from '../models';
import * as auth from '../middleware/encryption';

const secret = process.env.secret || '!^sl1@#=5';
const user = models.User;

/**
 * @exports signUp
 * @param  {obj} req request object
 * @param  {obj} res result object
 * @return {obj}  newUser object
 */
export const signUp = (req, res) => {
  const name = req.body.name;
  const username = (req.body.username || '').replace(' ', '');
  const email = (req.body.email || '').replace(' ', '');
  const password = req.body.password;

  if (password.length < 6) {
    return res.status(401).send({
      success: false,
      message: 'Password must be at least 6 characters!'
    });
  }

  const newUser = user
    .findOne({
      attributes: ['id'],
      where: {
        $or: [
          { username: {
            $iLike: username }
          },
          { email: {
            $iLike: email }
          }
        ]
      }
    })
    .then((userFound) => {
      if (userFound) {
        return res.status(401).send({
          success: false,
          message: 'Username or email already taken!'
        });
      }

      user
        .create({
          name,
          username,
          email,
          password: auth.generateHash(password),
        })
        .then((result) => {
          const token = jwt.sign(result.password, secret /* , {
            expiresInMinutes: 1440
          } */);

          const createdUser = {
            success: true,
            userId: result.id,
            username: result.username,
            email: result.email,
            token
          };

          createdUser.success = true;
          return res.status(201).send(createdUser);
        })
        .catch(() => res.status(401).send({
          success: false,
          message: 'Error Creating user' }));

      return newUser;
    });
};

/**
 * @exports signIn
 * @param  {obj} req request object
 * @param  {obj} res result object
 * @return {obj}  newUser object
 */
export const signIn = (req, res) => {
  const usernameOrEmail = (req.body.username || req.body.email || '')
    .replace(' ', '');

  const newUser = user
    .findOne({
      attributes: ['id', 'name', 'username', 'email', 'password'],
      where: {
        $or: [
          { username: {
            $iLike: usernameOrEmail }
          },
          { email: {
            $iLike: usernameOrEmail }
          }
        ]
      }
    })
    .then((userFound) => {
      if (!userFound) {
        return res.status(404).send({
          success: false,
          message: 'Username or email does not exist!'
        });
      }

      if (auth.verifyHash(req.body.password, userFound.password)) {
        const token = jwt.sign(userFound.id, secret /* , {
          expiresInMinutes: 1440
        } */);

        return res.status(201).send({
          success: true,
          id: userFound.id,
          name: userFound.name,
          username: userFound.username,
          email: userFound.email,
          token });
      }
      throw new Error();
    })
    .catch(() => res.status(401).send({
      success: false,
      message: 'Incorrect Password!' }));

  return newUser;
};
