export interface UserRecord {
  id: string;
  email: string;
  name: string;
  status: string;
  avatar?: string | null;
  roles?: { id: string; name: string; slug: string }[];
  createdAt: string;
}

export interface CreateUserPayload {
  email: string;
  name: string;
  password: string;
  status?: string;
  roleIds?: string[];
}

export interface UpdateUserPayload {
  email?: string;
  name?: string;
  status?: string;
  roleIds?: string[];
}
