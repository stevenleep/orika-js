/**
 * API Response DTO
 * Represents the data structure from the backend API
 */
export class UserDTO {
  id: number;
  user_name: string;
  email_address: string;
  created_at: string;
  is_active: boolean;
  
  constructor() {
    this.id = 0;
    this.user_name = '';
    this.email_address = '';
    this.created_at = '';
    this.is_active = false;
  }
}

