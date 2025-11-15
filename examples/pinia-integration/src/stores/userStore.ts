import { defineStore } from 'pinia';
import { User } from '../models/User';
import { UserDTO } from '../models/UserDTO';
import { api } from '../services/api';

/**
 * User Store
 * Demonstrates using $mapper in Pinia store actions
 */
export const useUserStore = defineStore('user', {
  state: () => ({
    users: [] as User[],
    currentUser: null as User | null,
    loading: false,
    error: null as string | null
  }),
  
  getters: {
    activeUsers: (state) => state.users.filter(u => u.isActive),
    inactiveUsers: (state) => state.users.filter(u => !u.isActive),
    userCount: (state) => state.users.length
  },
  
  actions: {
    /**
     * Fetch all users and map from DTO to domain model
     */
    async fetchUsers() {
      this.loading = true;
      this.error = null;
      
      try {
        console.log('📡 Fetching users from API...');
        const dtos = await api.getUsers();
        
        console.log('🔄 Mapping DTOs to domain models using $mapper...');
        // Use $mapper provided by the plugin
        this.users = this.$mapper.mapArray(dtos, UserDTO, User);
        
        console.log('✅ Successfully fetched and mapped', this.users.length, 'users');
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Unknown error';
        console.error('❌ Error fetching users:', err);
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * Fetch single user
     */
    async fetchUser(id: number) {
      this.loading = true;
      this.error = null;
      
      try {
        const dto = await api.getUser(id);
        // Map single object
        this.currentUser = this.$mapper.map(dto, UserDTO, User);
        console.log('✅ Fetched user:', this.currentUser.displayName);
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Unknown error';
        console.error('❌ Error fetching user:', err);
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * Create new user
     */
    async createUser(username: string, email: string) {
      this.loading = true;
      this.error = null;
      
      try {
        // Create domain model
        const newUser = new User();
        newUser.username = username;
        newUser.email = email;
        newUser.isActive = true;
        newUser.createdAt = new Date();
        
        // Map to DTO for API
        const dto = this.$mapper.map(newUser, User, UserDTO);
        
        // Send to API
        const createdDto = await api.createUser(dto);
        
        // Map response back to domain model
        const createdUser = this.$mapper.map(createdDto, UserDTO, User);
        
        // Add to store
        this.users.push(createdUser);
        
        console.log('✅ Created user:', createdUser.displayName);
        return createdUser;
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Unknown error';
        console.error('❌ Error creating user:', err);
        throw err;
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * Update current user with partial data
     */
    updateCurrentUser(updates: Partial<User>) {
      if (!this.currentUser) {
        console.warn('⚠️ No current user to update');
        return;
      }
      
      console.log('🔄 Merging updates into current user...');
      // Use merge to update existing object
      this.currentUser = this.$mapper.merge(
        updates,
        this.currentUser,
        User,
        User
      );
      
      console.log('✅ Updated current user:', this.currentUser.displayName);
    },
    
    /**
     * Toggle user active status
     */
    async toggleUserActive(userId: number) {
      const user = this.users.find(u => u.id === userId);
      if (!user) return;
      
      try {
        user.isActive = !user.isActive;
        
        // Map to DTO for API
        const dto = this.$mapper.map(user, User, UserDTO);
        await api.updateUser(userId, { is_active: dto.is_active });
        
        console.log('✅ Toggled user active status:', user.displayName);
      } catch (err) {
        // Rollback on error
        user.isActive = !user.isActive;
        this.error = err instanceof Error ? err.message : 'Unknown error';
        console.error('❌ Error toggling user status:', err);
      }
    },
    
    /**
     * Clear all data
     */
    clearUsers() {
      this.users = [];
      this.currentUser = null;
      this.error = null;
      console.log('🗑️ Cleared all users');
    }
  }
});

