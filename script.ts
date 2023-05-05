import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
//    const alimento = await prisma.almoco.create({
//        data: {
//            data: new Date(),
//            alimentos: {
//                create: {
//                    name: "cadeira"
//                },
//                connect: {
//                    name: "sofa"
//                }
//            }
//        }})
//    console.log(alimento)
    const almoco = await prisma.almoco.findUnique({
        where: {
            id: 1
        },
        include: {
            alimentos: true
        }
    })
    console.log(almoco)
}


main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })