import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/Users.entitiy';

@Injectable()
export class UsersRepository {
  private Users: User[] = [
    {
      id: 1,
      email: 'john.doe@example.com',
      name: 'John Doe',
      password: 'securepassword123',
      address: '123 Main St',
      phone: '555-1234',
      country: 'USA',
      city: 'New York',
    },
    {
      id: 2,
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      password: 'password321',
      address: '456 Elm St',
      phone: '555-5678',
    },
  ];
  getUsers(): User[] {
    return this.Users;
  }
}
