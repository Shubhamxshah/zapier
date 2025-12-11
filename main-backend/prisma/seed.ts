import {prisma} from "../src/lib/prisma";

async function main() {

    await prisma.availableTrigger.create({
        data: {
            id: "webhook",
            name: "webhook",
            image: "https://img.icons8.com/color/1200/webhook.jpg",
        }
    })

    await  prisma.availableAction.create({
        data: {
            id: "email",
            name: "Email",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYT3exZabjNNYv5MxMC3keJeyNFeXrLpERLQ&s",
        }
    })

    await prisma.availableAction.create({
        data: {
            id: "sol",
            name: "sol",
            image: "https://s2.coinmarketcap.com/static/img/coins/200x200/5426.png",
        }
    })
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });