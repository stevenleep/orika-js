/**
 * Domain Model
 * Represents the business entity used in the application
 */
export class User {
  id: number;
  username: string;
  email: string;
  createdAt: Date;
  isActive: boolean;
  
  constructor() {
    this.id = 0;
    this.username = '';
    this.email = '';
    this.createdAt = new Date();
    this.isActive = false;
  }
  
  // Business logic methods
  get displayName(): string {
    return `${this.username} (${this.email})`;
  }
  
  get isNew(): boolean {
    const daysSinceCreation = (Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceCreation < 7;
  }
}

