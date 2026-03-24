export interface Author {
  id: number;
  name: string;
  email: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Note {
  id: number;
  title: string;
  description: string;
  fileUrl: string;
  course: string;
  createdAt: string;
  updatedAt: string;
  authorId: number;
  author?: Author;
  tags?: Tag[];
  favorites?: unknown[];
}