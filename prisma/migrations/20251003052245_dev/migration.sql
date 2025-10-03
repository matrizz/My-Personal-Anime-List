-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "avatar" TEXT
);

-- CreateTable
CREATE TABLE "Anime" (
    "mal_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "title_english" TEXT,
    "title_japanese" TEXT,
    "episodes" INTEGER,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "rank" INTEGER,
    "synopsis" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "season" TEXT,
    "score" REAL,
    "genres" JSONB NOT NULL,
    "images" JSONB NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
