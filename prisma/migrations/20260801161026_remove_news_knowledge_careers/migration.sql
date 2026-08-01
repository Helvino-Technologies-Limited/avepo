-- DropForeignKey
ALTER TABLE "JobApplication" DROP CONSTRAINT "JobApplication_jobId_fkey";

-- DropForeignKey
ALTER TABLE "NewsPost" DROP CONSTRAINT "NewsPost_authorId_fkey";

-- DropTable
DROP TABLE "JobApplication";

-- DropTable
DROP TABLE "JobPosting";

-- DropTable
DROP TABLE "KnowledgeArticle";

-- DropTable
DROP TABLE "NewsPost";

-- DropEnum
DROP TYPE "JobType";

-- DropEnum
DROP TYPE "KnowledgeCategory";

-- DropEnum
DROP TYPE "NewsStatus";

