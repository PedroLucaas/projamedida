import { PrismaClient } from "@prisma/client";

export function can(permissionsRoutes) {
  return async (request, response, next) => {
    const { userId } = request;

    if (!userId) {
      return response.status(401).end();
    }
    const prisma = new PrismaClient();
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    prisma.$disconnect();

    if (!user) {
      return response.status(400).json("User does not exists");
    }

    const permissionExists = permissionsRoutes.includes(user.role);

    if (!permissionExists) {
      return response.status(401).end();
    }


    return next();
  };
}

export function is(rolesRoutes) {
  return async (request, response, next) => {
    const { userId } = request;

    const user = await UserRepository().findOne({
      where: { id: userId },
      relations: ["roles"],
    });

    if (!user) {
      return response.status(400).json("User does not exists");
    }

    const roleExists = user.roles
      .map((role) => role.name)
      .some((role) => rolesRoutes.includes(role));

    if (!roleExists) {
      return response.status(401).end();
    }

    return next();
  };
}