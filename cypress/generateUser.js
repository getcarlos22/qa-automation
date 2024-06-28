import { writeFileSync } from 'fs';
import { name as _name, address, phone as _phone, internet } from '@faker-js/faker';

const user = {
  name: _name.firstName(),
  lname: _name.lastName(),
  city: address.cityName(),
  phone: _phone.number('############'),
  zipCode: address.zipCode('#####'),
  email: internet.email(),
  state: address.state(),
  street: address.streetAddress(false),
  ssn: _phone.number('#####'),
  password: internet.password()
};

// Write user data to user.json in the fixtures directory
writeFileSync('cypress/fixtures/user.json', JSON.stringify(user, null, 2));

console.log('User data generated and saved to cypress/fixtures/user.json');
