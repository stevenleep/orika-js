import { MapperFactory, createMapperBuilder } from '../src';

const factory = MapperFactory.getInstance();

class UserData {
  id: number;
  permissions: Set<string>;
  metadata: Map<string, any>;
  tags: string[];
  
  constructor() {
    this.id = 0;
    this.permissions = new Set();
    this.metadata = new Map();
    this.tags = [];
  }
}

class UserDataDTO {
  id: number;
  permissions: Set<string>;
  metadata: Map<string, any>;
  tags: string[];
  
  constructor() {
    this.id = 0;
    this.permissions = new Set();
    this.metadata = new Map();
    this.tags = [];
  }
}

createMapperBuilder<UserData, UserDataDTO>()
  .from(UserData)
  .to(UserDataDTO)
  .autoMap(true)
  .register();

const userData = new UserData();
userData.id = 1;
userData.permissions.add('read');
userData.permissions.add('write');
userData.metadata.set('createdAt', new Date());
userData.metadata.set('source', 'web');
userData.tags = ['premium', 'verified'];

const dto = factory.map(userData, UserData, UserDataDTO);

console.log('Permissions:', Array.from(dto.permissions));
console.log('Metadata:', Array.from(dto.metadata.entries()));
console.log('Tags:', dto.tags);

