import type { UserDTO } from '../models/UserDTO';

/**
 * Mock API Service
 * Simulates backend API calls
 */
export const api = {
  /**
   * Fetch all users
   */
  async getUsers(): Promise<UserDTO[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data in API format (snake_case)
    return [
      {
        id: 1,
        user_name: 'alice_wonder',
        email_address: 'alice@example.com',
        created_at: '2024-01-15T10:30:00Z',
        is_active: true
      },
      {
        id: 2,
        user_name: 'bob_builder',
        email_address: 'bob@example.com',
        created_at: '2024-02-20T14:45:00Z',
        is_active: true
      },
      {
        id: 3,
        user_name: 'charlie_brown',
        email_address: 'charlie@example.com',
        created_at: '2023-12-01T09:00:00Z',
        is_active: false
      }
    ] as UserDTO[];
  },
  
  /**
   * Fetch single user
   */
  async getUser(id: number): Promise<UserDTO> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      id,
      user_name: 'demo_user',
      email_address: 'demo@example.com',
      created_at: new Date().toISOString(),
      is_active: true
    } as UserDTO;
  },
  
  /**
   * Create new user
   */
  async createUser(userData: Partial<UserDTO>): Promise<UserDTO> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return {
      id: Math.floor(Math.random() * 1000),
      ...userData,
      created_at: new Date().toISOString()
    } as UserDTO;
  },
  
  /**
   * Update user
   */
  async updateUser(id: number, updates: Partial<UserDTO>): Promise<UserDTO> {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    const user = await this.getUser(id);
    return { ...user, ...updates };
  }
};

