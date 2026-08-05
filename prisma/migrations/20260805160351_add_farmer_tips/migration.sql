-- CreateTable
CREATE TABLE "FarmerTip" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT,
    "body" TEXT NOT NULL,
    "images" TEXT[],
    "videoUrl" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FarmerTip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipComment" (
    "id" TEXT NOT NULL,
    "tipId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "rating" INTEGER,
    "comment" TEXT NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TipComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FarmerTip_slug_key" ON "FarmerTip"("slug");

-- CreateIndex
CREATE INDEX "FarmerTip_category_idx" ON "FarmerTip"("category");

-- CreateIndex
CREATE INDEX "TipComment_tipId_idx" ON "TipComment"("tipId");

-- AddForeignKey
ALTER TABLE "TipComment" ADD CONSTRAINT "TipComment_tipId_fkey" FOREIGN KEY ("tipId") REFERENCES "FarmerTip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
