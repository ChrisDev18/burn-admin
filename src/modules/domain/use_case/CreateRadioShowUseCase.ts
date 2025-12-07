import prisma from "@/app/lib/prisma";
import {RadioShowRepository} from "@/modules/repository/RadioShowRepository";
import {RadioShow} from "@/modules/domain/model/RadioShow";

export type CreateRadioShowResult =
    | { ok: true; radioShow: RadioShow }
    | { ok: false; error: "DATABASE_ERROR" };

export class CreateRadioShowUseCase {
  constructor(
      private readonly radioShowRepo = new RadioShowRepository(),
  ) {}

  async execute(input: {
    title: string;
    description: string | null;
    hosts: string[];
    photo: string | null;
  }): Promise<CreateRadioShowResult> {
    try {
      return prisma.$transaction(async (tx) => {
        const radioShowRepoTx = this.radioShowRepo.withTransaction(tx);

        const result = await radioShowRepoTx.createRadioShow({
          title: input.title,
          description: input.description,
          hosts: input.hosts,
          photo: input.photo
        });

        if (result.ok) {
          return {
            ok: true,
            radioShow: result.radioShow,
          };
        } else throw Error(result.error)

      })
    } catch (err) {
      return { ok: false, error: "DATABASE_ERROR" };
    }
  }
}