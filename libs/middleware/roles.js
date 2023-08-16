import { PrismaClient } from "@prisma/client";

function is(rolesRoutes) {
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

    const roleExists = rolesRoutes.includes(user.role);

    if (!roleExists) {
      return response.status(401).end();
    }


    return next();
  };
}

module.exports = { is };