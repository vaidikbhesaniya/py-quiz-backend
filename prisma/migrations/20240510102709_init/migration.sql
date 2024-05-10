-- CreateTable
CREATE TABLE "data" (
    "id" SERIAL NOT NULL,
    "userName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "question1" TEXT,
    "question2" TEXT,

    CONSTRAINT "data_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "data_email_key" ON "data"("email");
