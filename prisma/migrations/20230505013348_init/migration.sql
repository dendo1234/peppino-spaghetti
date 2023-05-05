-- CreateTable
CREATE TABLE "Alimento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Almoco" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "data" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "_AlimentoToAlmoco" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_AlimentoToAlmoco_A_fkey" FOREIGN KEY ("A") REFERENCES "Alimento" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AlimentoToAlmoco_B_fkey" FOREIGN KEY ("B") REFERENCES "Almoco" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Alimento_name_key" ON "Alimento"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_AlimentoToAlmoco_AB_unique" ON "_AlimentoToAlmoco"("A", "B");

-- CreateIndex
CREATE INDEX "_AlimentoToAlmoco_B_index" ON "_AlimentoToAlmoco"("B");
