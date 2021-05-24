import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
@Entity('users')
export class Users {
  @PrimaryGeneratedColumn()
  private id: number;

  @Column({
    length: 100,
  })
  @ApiProperty()
  private user_name: string;

  @Column()
  @ApiProperty()
  private dob: string;

  @Column()
  @ApiProperty()
  private metadata: string;

  @Column()
  @ApiProperty()
  private isactive: boolean = true;

  setName(displayName): void {
    this.checkNullCondition(displayName, 'Name');
    this.user_name = displayName;
  }

  setDob(dob): void {
    this.checkNullCondition(dob, 'Date of Birth');
    this.dob = dob;
  }

  setMetadata(role): void {
    this.metadata = role;
  }

  setIsActive(value): void {
    if (!value) {
      this.isactive = true;
    }
  }

  private checkNullCondition(value, type): void {
    if (!value) {
      throw new Error(`${type} cannot be null or empty`);
    }
  }
}

export class LoginModel {
  @ApiProperty()
  private email: string;

  @ApiProperty()
  private password: string;
}

export class FirebaseSignupModel {
  @ApiProperty()
  private displayName: string;

  @ApiProperty()
  private password: string;

  @ApiProperty()
  private email: string;

  @ApiProperty({ description: 'Format DD/MM/YYYY' })
  private dob: string;

  @ApiProperty({ enum: ['admin', 'user'] })
  private role: UserRole;
}
enum UserRole {
  Admin = 'admin',
  User = 'user',
}
