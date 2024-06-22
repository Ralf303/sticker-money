-- CreateTable
CREATE TABLE "Stakes" (
    "id" SERIAL NOT NULL,
    "jackpot" INTEGER NOT NULL,
    "bar" INTEGER NOT NULL,
    "berries" INTEGER NOT NULL,
    "lemons" INTEGER NOT NULL,
    "odd" INTEGER NOT NULL,
    "correct" INTEGER NOT NULL,

    CONSTRAINT "Stakes_pkey" PRIMARY KEY ("id")
);
