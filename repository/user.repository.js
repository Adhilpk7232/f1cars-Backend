// user.repository.js

const User = require('../model/user'); // Assuming you have a User model defined

class UserRepository {
  async getUsers() {
    try {
      // Perform database query or operation to get users
      const users = await User.find();
      return users;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(userId) {
    try {
      // Perform database query or operation to get a specific user by ID
      const user = await User.findById(userId);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async createUser(userData) {
    try {
      // Perform database query or operation to create a new user
      const newUser = await User.create(userData);
      return newUser;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(userId, userData) {
    try {
      // Perform database query or operation to update a user
      const updatedUser = await User.findByIdAndUpdate(userId, userData, { new: true });
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }
  async updateUserById(userId, updateData) {
    try {
      // Perform database query or operation to update a user by their ID
      const updatedUser = await User.updateOne({ _id: userId }, { $set: updateData });
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      // Perform database query or operation to delete a user
      const deletedUser = await User.findByIdAndDelete(userId);
      return deletedUser;
    } catch (error) {
      throw error;
    }
  }
  async findUserByEmail(data){
    try{
        const userData = await User.findOne({email:data})
        return userData
    }catch(error){
        throw error
    }
  }
}


module.exports = UserRepository;