const router = require('express').Router();
const {
  getUsers,
  getUsersId,
  postUsers,
  patchUsers,
  patchUsersAvatar,
} = require('../controllers/users');

router.get('/users', getUsers); // возвращает всех пользователей
router.get('/users/:userId', getUsersId); // возвращает пользователя по _id
router.post('/users', postUsers); // создаёт пользователя
router.patch('/users/me', patchUsers); // обновляет профиль
router.patch('/users/me/avatar', patchUsersAvatar); // обновляет аватар

module.exports = router;
