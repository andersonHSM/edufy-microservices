import { BaseEntity } from 'libs/database/base.entity';
import { TicketMessageEntity } from './ticket-message.entity';

export enum TicketStatus {
  OPEN = 'open',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export interface TicketProps {
  title: string;
  description: string;
  status: TicketStatus;
  creatorSubId: string;
  creatorName: string;
  creatorEmail: string;
  resolvedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  messages?: TicketMessageEntity[];
}

export type CreateTicketInput = Omit<
  TicketProps,
  'status' | 'createdAt' | 'updatedAt' | 'resolvedBy' | 'messages'
>;

export class TicketEntity extends BaseEntity<TicketProps> {
  static create(props: CreateTicketInput, id?: string): TicketEntity {
    const now = new Date();
    return new TicketEntity(
      {
        ...props,
        status: TicketStatus.OPEN,
        resolvedBy: null, // Explicitly set to null
        createdAt: now,
        updatedAt: now,
        messages: [],
      },
      id,
    );
  }

  static fromProps(props: TicketProps, id?: string): TicketEntity {
    return new TicketEntity({ ...props, messages: props.messages || [] }, id);
  }

  protected constructor(props: TicketProps, id?: string) {
    super(props, id);
  }

  get title(): string {
    return this.props.title;
  }

  get description(): string {
    return this.props.description;
  }

  get status(): TicketStatus {
    return this.props.status;
  }

  get creatorSubId(): string {
    return this.props.creatorSubId;
  }

  get creatorName(): string {
    return this.props.creatorName;
  }

  get creatorEmail(): string {
    return this.props.creatorEmail;
  }

  get resolvedBy(): string | null {
    return this.props.resolvedBy;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get messages(): TicketMessageEntity[] {
    return this.props.messages || [];
  }

  updateStatus(status: TicketStatus): void {
    this.props.status = status;
    this.props.updatedAt = new Date();
  }

  assignResolvedBy(resolvedBy: string | null): void {
    this.props.resolvedBy = resolvedBy;
    this.props.updatedAt = new Date();
  }

  toPersistence() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      status: this.status,
      creatorSubId: this.creatorSubId,
      creatorName: this.creatorName,
      creatorEmail: this.creatorEmail,
      resolvedBy: this.resolvedBy,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
