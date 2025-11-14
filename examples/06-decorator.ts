import { MapperFactory, MapTo, MapField, Exclude, Transform, createMappingFromDecorators } from '@orika-js/core';

const factory = MapperFactory.getInstance();

class UserDTO {
  id: number;
  fullName: string;
  email: string;
  status: string;
  
  constructor() {
    this.id = 0;
    this.fullName = '';
    this.email = '';
    this.status = '';
  }
}

@MapTo(UserDTO)
class User {
  id: number;

  @MapField('fullName')
  username: string;

  @Transform((value: string) => value.toLowerCase())
  email: string;

  @Transform((value: string) => value.toUpperCase())
  @MapField('status')
  userStatus: string;

  @Exclude()
  password: string;

  @Exclude()
  salt: string;

  constructor() {
    this.id = 0;
    this.username = '';
    this.email = '';
    this.userStatus = '';
    this.password = '';
    this.salt = '';
  }
}

console.log('='.repeat(60));
console.log('Decorator-based Mapping Example');
console.log('='.repeat(60));

createMappingFromDecorators<User, UserDTO>(User).register();

const user = new User();
user.id = 1;
user.username = 'Alice Smith';
user.email = 'ALICE@EXAMPLE.COM';
user.userStatus = 'active';
user.password = 'secret123';
user.salt = 'random_salt';

console.log('\nSource User:');
console.log('  id:', user.id);
console.log('  username:', user.username);
console.log('  email:', user.email);
console.log('  userStatus:', user.userStatus);
console.log('  password:', user.password);

const dto = factory.map(user, User, UserDTO);

console.log('\nMapped UserDTO:');
console.log('  id:', dto.id);
console.log('  fullName:', dto.fullName);
console.log('  email:', dto.email);
console.log('  status:', dto.status);
console.log('  password:', 'password' in dto ? 'EXISTS!' : '(correctly excluded)');
console.log('  salt:', 'salt' in dto ? 'EXISTS!' : '(correctly excluded)');

console.log('\n' + '='.repeat(60));
console.log('✓ Decorator mapping completed!');
console.log('='.repeat(60));

