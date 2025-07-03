// types.ts

export type Status = 'todo' | 'inprogress' | 'done';
export type Priority = 'urgent' | 'high' | 'medium' | 'low';

export interface Assignee {
  id: string;
  name: string;
  type: 'user' | 'team';
  avatarUrl?: string; // optional for profile pics
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  tags: string[];
  status: Status;
  priority: Priority;
  startDate: Date;
  endDate: Date;
  assignee?: Assignee|undefined;
  assignedBy?: Assignee|undefined;
  teamId: string;
}
