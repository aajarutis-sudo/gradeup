export default {
    datasource: {
        url: process.env.DATABASE_URL || 'file:./dev.db',
    },
    migrations: {
        seed: 'ts-node ./prisma/seed.ts',
    },
}

