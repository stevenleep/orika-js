import { MapperFactory, createMapperBuilder } from '../src';

const factory = MapperFactory.getInstance();

class Post {
  id: number;
  title: string;
  authorId: number;
  
  constructor() {
    this.id = 0;
    this.title = '';
    this.authorId = 0;
  }
}

class PostDTO {
  id: number;
  title: string;
  authorName: string;
  
  constructor() {
    this.id = 0;
    this.title = '';
    this.authorName = '';
  }
}

async function fetchAuthorName(authorId: number): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 10));
  return `Author_${authorId}`;
}

createMapperBuilder<Post, PostDTO>()
  .from(Post)
  .to(PostDTO)
  .mapField('id', 'id')
  .mapField('title', 'title')
  .forMemberAsync('authorName', async (source) => {
    return await fetchAuthorName(source.authorId);
  })
  .register();

(async () => {
  const post = new Post();
  post.id = 1;
  post.title = 'Hello World';
  post.authorId = 123;

  const dto = await factory.mapAsync(post, Post, PostDTO);
  console.log('Post:', post);
  console.log('DTO:', dto);
})();

