import { MapperFactory, createMapperBuilder } from '../src';

const factory = MapperFactory.getInstance();

class CreateUserRequest {
  username: string;
  email: string;
  age: number;
  
  constructor() {
    this.username = '';
    this.email = '';
    this.age = 0;
  }
}

class ValidatedUser {
  username: string;
  email: string;
  age: number;
  
  constructor() {
    this.username = '';
    this.email = '';
    this.age = 0;
  }
}

createMapperBuilder<CreateUserRequest, ValidatedUser>()
  .from(CreateUserRequest)
  .to(ValidatedUser)
  .autoMap(true)
  .validate((source, dest) => {
    if (!dest.email.includes('@')) {
      throw new Error('Invalid email');
    }
    if (dest.age < 0 || dest.age > 150) {
      throw new Error('Invalid age');
    }
    if (dest.username.length < 3) {
      throw new Error('Username too short');
    }
  })
  .register();

const validRequest = new CreateUserRequest();
validRequest.username = 'alice';
validRequest.email = 'alice@example.com';
validRequest.age = 25;

const invalidRequest = new CreateUserRequest();
invalidRequest.username = 'ab';
invalidRequest.email = 'invalid';
invalidRequest.age = 200;

try {
  const user = factory.map(validRequest, CreateUserRequest, ValidatedUser);
  console.log('✓ Valid user:', user);
} catch (error) {
  console.log('✗ Validation failed:', (error as Error).message);
}

try {
  const user = factory.map(invalidRequest, CreateUserRequest, ValidatedUser);
  console.log('✗ Invalid user passed:', user);
} catch (error) {
  console.log('✓ Validation caught:', (error as Error).message);
}

