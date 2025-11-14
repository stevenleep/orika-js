import { MapperFactory, createMapperBuilder } from '../src';

const factory = MapperFactory.getInstance();

class User {
  id: number;
  username: string;
  email: string;
  userStatus: string;
  password: string;
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

console.log('='.repeat(60));
console.log('Complete Mapping Example');
console.log('='.repeat(60));

createMapperBuilder<User, UserDTO>()
  .from(User)
  .to(UserDTO)
  .mapField('id', 'id')
  .mapField('username', 'fullName')
  .forMember('email', (s) => s.email.toLowerCase())
  .forMember('status', (s) => s.userStatus.toUpperCase())
  .exclude('password', 'salt')
  .register();

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
console.log('  salt:', user.salt);

const dto = factory.map(user, User, UserDTO);

console.log('\nMapped UserDTO:');
console.log('  id:', dto.id);
console.log('  fullName:', dto.fullName);
console.log('  email:', dto.email);
console.log('  status:', dto.status);
console.log('  password:', (dto as any).password);
console.log('  salt:', (dto as any).salt);

console.log('\n' + '='.repeat(60));
console.log('✓ Mapping completed successfully!');
console.log('  ✓ username → fullName');
console.log('  ✓ email → lowercase');
console.log('  ✓ userStatus → UPPERCASE status');
console.log('  ✓ password & salt excluded');
console.log('='.repeat(60));

