const { assert } = require('chai');

const getUserByEmail  = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail(testUsers, "user@example.com")
    const expectedUserID = "user@example.com";
    // Write your assert statement here
    assert.deepEqual(user.email, expectedUserID, "Check to see if this is a valid email");
  });
  
  it('should test to see the non-existent email', function() {
    const user = getUserByEmail(testUsers, "az@gmail.com")
    const expectedUserID = undefined;
    // Write your assert statement here
    assert.deepEqual(user, expectedUserID, "Check to see if this is a valid email");
  });
});