import { MapperFactory, createMapperBuilder } from '../src';

const factory = MapperFactory.getInstance();

class User {
  id: number;
  username: string;
  email: string;
  password: string;
  
  constructor() {
    this.id = 0;
    this.username = '';
    this.email = '';
    this.password = '';
  }
}

class UserDTO {
  id: number;
  fullName: string;
  email: string;
  
  constructor() {
    this.id = 0;
    this.fullName = '';
    this.email = '';
  }
}

createMapperBuilder<User, UserDTO>()
  .from(User)
  .to(UserDTO)
  .mapField('username', 'fullName')
  .exclude('password')
  .register();

const user = new User();
user.id = 1;
user.username = 'Alice';
user.email = 'alice@example.com';
user.password = 'secret';

const dto = factory.map(user, User, UserDTO);
console.log('User:', user);
console.log('DTO:', dto);

