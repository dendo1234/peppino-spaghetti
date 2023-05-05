import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const date = new Date()
    date.setMilliseconds(0)
    date.setSeconds(0);
    date.setMinutes(0);
    date.setHours(0);
    
    const alimento = await prisma.almoco.create({
        data: {
            data: date,
            alimentos: {
                connect: {
                    name: "sofa"
                }
            }
        }})
    console.log(alimento)
    

//  const almoco = await prisma.almoco.findUnique({
//      where: {
//          id: 1
//      },
//      include: {
//          alimentos: true
//      }
//  })
//  console.log(almoco)

    const almoco = await prisma.almoco.findFirst({
        where: {
        data: date
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