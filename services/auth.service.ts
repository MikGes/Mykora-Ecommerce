import bcrypt from "bcryptjs";
import type { UserProfile } from "@/types";

const users = new Map<
  string,
  {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    phone?: string;
    image?: string;
    role: "USER" | "ADMIN";
    loyaltyTier: "SILVER" | "GOLD" | "PLATINUM";
    loyaltyPoints: number;
    emailVerified: boolean;
    failedLoginAttempts: number;
    lockedUntil?: Date;
  }
>();

// Demo accounts
users.set("admin@mykora.com", {
  id: "admin-1",
  name: "Admin User",
  email: "admin@mykora.com",
  passwordHash: bcrypt.hashSync("Admin123!", 12),
  role: "ADMIN",
  loyaltyTier: "PLATINUM",
  loyaltyPoints: 5000,
  emailVerified: true,
  failedLoginAttempts: 0,
});

users.set("demo@mykora.com", {
  id: "user-1",
  name: "Demo User",
  email: "demo@mykora.com",
  passwordHash: bcrypt.hashSync("Demo1234!", 12),
  role: "USER",
  loyaltyTier: "GOLD",
  loyaltyPoints: 750,
  emailVerified: true,
  failedLoginAttempts: 0,
});

export const authService = {
  async findByEmail(email: string) {
    return users.get(email.toLowerCase()) ?? null;
  },

  async findById(id: string): Promise<UserProfile | null> {
    for (const user of users.values()) {
      if (user.id === id) return this.toProfile(user);
    }
    return null;
  },

  toProfile(user: (typeof users extends Map<string, infer V> ? V : never)): UserProfile {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      image: user.image,
      role: user.role,
      loyaltyTier: user.loyaltyTier,
      loyaltyPoints: user.loyaltyPoints,
      emailVerified: user.emailVerified,
    };
  },

  async createUser(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<UserProfile> {
    const email = data.email.toLowerCase();
    if (users.has(email)) throw new Error("Email already registered");
    const user = {
      id: `user-${Date.now()}`,
      name: data.name,
      email,
      passwordHash: await bcrypt.hash(data.password, 12),
      role: "USER" as const,
      loyaltyTier: "SILVER" as const,
      loyaltyPoints: 100,
      emailVerified: false,
      failedLoginAttempts: 0,
    };
    users.set(email, user);
    return this.toProfile(user);
  },

  async verifyPassword(email: string, password: string): Promise<UserProfile | null> {
    const user = users.get(email.toLowerCase());
    if (!user) return null;
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new Error("Account is temporarily locked. Try again later.");
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      user.failedLoginAttempts++;
      if (user.failedLoginAttempts >= 5) {
        user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
      }
      return null;
    }
    user.failedLoginAttempts = 0;
    user.lockedUntil = undefined;
    return this.toProfile(user);
  },

  async updateProfile(
    userId: string,
    data: Partial<{ name: string; email: string; phone: string; image: string }>
  ): Promise<UserProfile> {
    for (const user of users.values()) {
      if (user.id === userId) {
        if (data.name) user.name = data.name;
        if (data.email) user.email = data.email;
        if (data.phone !== undefined) user.phone = data.phone;
        if (data.image !== undefined) user.image = data.image;
        return this.toProfile(user);
      }
    }
    throw new Error("User not found");
  },

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    for (const user of users.values()) {
      if (user.id === userId) {
        const valid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!valid) throw new Error("Current password is incorrect");
        user.passwordHash = await bcrypt.hash(newPassword, 12);
        return;
      }
    }
    throw new Error("User not found");
  },

  async deleteAccount(userId: string): Promise<void> {
    for (const [email, user] of users) {
      if (user.id === userId) {
        users.delete(email);
        return;
      }
    }
  },

  async getAllUsers() {
    return Array.from(users.values()).map((u) => this.toProfile(u));
  },
};
