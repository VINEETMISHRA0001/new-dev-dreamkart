const express = require('express');
const {
  addUser,
  loginUser,
  fetchAllUsers,
  deleteUser,
} = require('./../../controllers/USERMANAGEMENT/UserManagement');

const router = express.Router();

router.post('/add', addUser); // POST /user/add - to add a user
router.post('/login', loginUser); // POST /user/login - to log in a user
router.get('/users', fetchAllUsers);
router.delete('/users/:userId', deleteUser);
module.exports = router;
