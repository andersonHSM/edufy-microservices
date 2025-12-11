/**
 * Creates a type where all properties of `T` are optional and can be `null`.
 * This is useful for update DTOs or other scenarios where you want to explicitly
 * represent the absence of a value with `null`.
 *
 * @example
 * interface User {
 *   id: number;
 *   name: string;
 *   email: string;
 * }
 *
 * // updateUser can have properties like { name: 'New Name' }, { email: null }, or be an empty object.
 * const updateUser: PartialWithNull<User> = { name: 'New Name', email: null };
 */
export type PartialWithNull<T> = {
  [P in keyof T]?: T[P] | null;
};
