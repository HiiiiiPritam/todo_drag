import type { User } from "./user";

export interface Team {
  id: string;
  name: string;
  color: string;
  members: string[];
  isGlobal: boolean;
}