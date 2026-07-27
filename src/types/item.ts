import type { User } from './user';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type ItemStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';

export interface Comment {
  id: string;
  text: string;
  authorId: string;
  itemId: string;
  createdAt: string;
  updatedAt: string;
  author: User;
}

export interface Item {
  id: string;
  title: string;
  description?: string | null;
  priority: Priority;
  status: ItemStatus;
  assigneeId?: string | null;
  dueDate?: string | null;
  boardId: string;
  position: number;
  createdAt: string;
  updatedAt: string;
  assignee?: User | null;
  board?: { id: string; name: string; color?: string };
  comments?: Comment[];
}

export interface CreateItemDto {
  title: string;
  description?: string;
  priority?: Priority;
  status?: ItemStatus;
  assigneeId?: string;
  dueDate?: string;
  boardId: string;
  position?: number;
}

export interface UpdateItemDto {
  title?: string;
  description?: string;
  priority?: Priority;
  status?: ItemStatus;
  assigneeId?: string;
  dueDate?: string;
  position?: number;
}

export interface CreateCommentDto {
  content: string;
  itemId: string;
}
