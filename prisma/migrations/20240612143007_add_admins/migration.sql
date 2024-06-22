-- CreateTable
CREATE TABLE "Admins" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'admin',
    "password" TEXT NOT NULL DEFAULT 'none',

    CONSTRAINT "Admins_pkey" PRIMARY KEY ("id")
);
