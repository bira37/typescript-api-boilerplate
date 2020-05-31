const migrations: { [key: string]: string } = {
  "add-uuid-ossp-extension": `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  `,
  "create-user-table": `
    CREATE TABLE users (
      id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      "deletedAt" TIMESTAMP DEFAULT NULL,
      "username" TEXT NOT NULL,
      "password" TEXT NOT NULL,
      "email" TEXT NOT NULL,
      "firstName" TEXT NOT NULL,
      "lastName" TEXT NOT NULL,
      "isSuperUser" BOOLEAN NOT NULL
    );
  `
};

export default migrations;
