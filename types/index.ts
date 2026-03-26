export interface Project {
  id: string;
  name: string;
  githubUrl: string;
  description: string;
  imageUrl: string;
  submitterId: string;
  submitterName: string;
  submitterAvatar: string;
  upvotes: number;
  createdAt: string;
}

export interface ProjectWithId extends Project {
  id: string;
}
