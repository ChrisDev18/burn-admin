import {hash} from "@uswriting/bcrypt";
import prisma from "@/app/lib/prisma";
import {User} from "@/modules/domain/model/User";
import {Prisma, PrismaClient} from "@prisma/client";
import {ITXClientDenyList} from "@prisma/client/runtime/library";

export type CreateUserResult =
    | { ok: true; user: User }
    | { ok: false; error: "EMAIL_ALREADY_EXISTS" | "DATABASE_ERROR" };

export type FindUserResult =
    | { ok: true; user: User | null }
    | { ok: false; error: "DATABASE_ERROR" };

export type DeleteUserResult =
    | { ok: true; userId: number }
    | { ok: false; error: "DOES_NOT_EXIST" | "DATABASE_ERROR" };


export class UserRepository {
  constructor(private readonly db: Omit<PrismaClient, ITXClientDenyList> = prisma) {}

  withTransaction(tx: Omit<PrismaClient, ITXClientDenyList>) {
    return new UserRepository(tx);
  }

  async createUser(
      firstName: string,
      lastName: string,
      email: string,
      password: string
  ): Promise<CreateUserResult> {

    const hashedPassword = hash(password, 10);

    try {
      const user = await this.db.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
        },
      });

      return {
        ok: true,
        user: user
      };

    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          return {
            ok: false,
            error: "EMAIL_ALREADY_EXISTS",
          };
        }
      }

      return {
        ok: false,
        error: "DATABASE_ERROR",
      };
    }
  }

  async findUserByEmail(email: string): Promise<FindUserResult> {

    try {
      const user = await this.db.user.findUnique({
        where: {email},
      });

      if (!user) return {
        ok: true,
        user: null
      };

      return {
        ok: true,
        user: user
      }
    } catch (error) {
      return {
        ok: false,
        error: "DATABASE_ERROR",
      }
    }
  }

  async deleteUser(
      id: number
  ): Promise<DeleteUserResult> {

    try {
      const user = await this.db.user.findUnique({
        where: { id }
      });

      if (!user) {
        // If it doesn't exist, return error code
        return {
          ok: false,
          error: "DOES_NOT_EXIST",
        };
      }

      await this.db.user.delete({ where: {id} });

      return {
        ok: true,
        userId: user.id
      };

    } catch (error) {
      return {
        ok: false,
        error: "DATABASE_ERROR",
      };
    }
  }

}