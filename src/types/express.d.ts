declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      username: string;
      name: string;
      avatar: string;
      createdAt: Date;
      updatedAt: Date;
    }
  }
}

export {};
