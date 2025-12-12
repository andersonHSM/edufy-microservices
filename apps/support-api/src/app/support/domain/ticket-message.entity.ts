import { BaseEntity } from 'libs/database/base.entity';

export interface TicketMessageProps {
  ticketId: string;
  content: string;
  authorSubId: string;
  authorName: string;
  createdAt: Date;
}

export type CreateTicketMessageInput = Omit<TicketMessageProps, 'createdAt'>;

export class TicketMessageEntity extends BaseEntity<TicketMessageProps> {
  static create(
    props: CreateTicketMessageInput,
    id?: string,
  ): TicketMessageEntity {
    const now = new Date();
    return new TicketMessageEntity(
      {
        ...props,
        createdAt: now,
      },
      id,
    );
  }

  static fromProps(
    props: TicketMessageProps,
    id?: string,
  ): TicketMessageEntity {
    return new TicketMessageEntity(props, id);
  }

  protected constructor(props: TicketMessageProps, id?: string) {
    super(props, id);
  }

  get ticketId(): string {
    return this.props.ticketId;
  }

  get content(): string {
    return this.props.content;
  }

  get authorSubId(): string {
    return this.props.authorSubId;
  }

  get authorName(): string {
    return this.props.authorName;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  toPersistence() {
    return {
      id: this.id,
      ticketId: this.ticketId,
      content: this.content,
      authorSubId: this.authorSubId,
      authorName: this.authorName,
      createdAt: this.props.createdAt,
    };
  }
}
