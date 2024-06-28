const fs = require('fs');
const faker = require('@faker-js/faker');

const user = {
  name: faker.name.firstName(),
  lname: faker.name.lastName(),
  city: faker.address.cityName(),
  phone: faker.phone.number('############'),
  zipCode: faker.address.zipCode('#####'),
  email: faker.internet.email(),
  state: faker.address.state(),
  street: faker.address.streetAddress(false),
  ssn: faker.phone.number('#####'),
  password: faker.internet.password()
};

// Write user data to user.json in the fixtures directory
fs.writeFileSync('cypress/fixtures/user.json', JSON.stringify(user, null, 2));

console.log('User data generated and saved to cypress/fixtures/user.json');
