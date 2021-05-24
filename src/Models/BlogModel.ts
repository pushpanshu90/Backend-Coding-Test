import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Blog {
  @PrimaryColumn()
  public id: string;

  @Column()
  private updated_date: string;

  @Column()
  @ApiProperty()
  public title: string;

  @Column()
  @ApiProperty()
  private body: string;

  setDate(date): void {
    this.checkNullCondition(date, 'Date');
    this.updated_date = date;
  }

  setArticleTitle(title): void {
    this.checkNullCondition(title, 'Title');
    this.title = title;
  }

  setArticleBody(body): void {
    this.checkNullCondition(body, 'Article Body');
    this.body = body;
  }

  getId() {
    return this.id;
  }

  setId(id) {
    this.checkNullCondition(id, 'Id cannot be null or empty');
    this.id = id;
  }

  private checkNullCondition(value, type): void {
    if (!value) {
      throw new Error(`${type} cannot be null or empty`);
    }
  }
}
