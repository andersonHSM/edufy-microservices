import { v4 as uuid } from 'uuid';

export abstract class BaseEntity<T> {
  protected readonly _id: string;
  protected props: T;

  protected constructor(props: T, id?: string) {
    this._id = id || uuid();
    this.props = props;
  }

  get id(): string {
    return this._id;
  }

  getProps(): T {
    return this.props;
  }
}
