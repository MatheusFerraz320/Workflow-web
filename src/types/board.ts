export interface Board {
  id: string;
  name: string;
  description?: string | null;
  color: string;
  ownerId: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBoardDto {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateBoardDto {
  name?: string;
  description?: string;
  color?: string;
  archived?: boolean;
}
