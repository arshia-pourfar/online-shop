export type User = {
    id: string;
    name: string;
    phone: string;
    email: string;
    status: string;
    password: string;
    role: string;
    createdAt: string; // or Date
};

// id        String     @id @default(cuid())
//   email     String     @unique
//   name      String?
//   password  String
//   phone     String?    // **Corrected: Changed from Int to String?**
//   status    UserStatus @default(ACTIVE)
//   role      Role       @default(USER)
//   orders    Order[]
//   createdAt DateTime   @default(now())