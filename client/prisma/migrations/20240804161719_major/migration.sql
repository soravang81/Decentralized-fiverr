-- CreateEnum
CREATE TYPE "TransactionPurpose" AS ENUM ('BUYER_TO_ESCROW', 'ESCROW_TO_SELLER', 'ESCROW_TO_BUYER_REFUND', 'BUYER_TO_SELLER_TIP', 'PLATFORM_FEE');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('BUYER', 'SELLER', 'BOTH');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PROCESSING', 'DISPUTED', 'CANCELLED', 'DELIVERED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'HELD_IN_ESCROW', 'RELEASED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('GraphicsAndDesign', 'DigitalMarketing', 'WritingAndTranslation', 'VideoAndAnimation', 'MusicAndAudio', 'ProgrammingAndTech', 'Business', 'Lifestyle');

-- CreateEnum
CREATE TYPE "Niche" AS ENUM ('LogoDesign', 'BusinessCardsAndStationery', 'Illustration', 'FlyersAndBrochures', 'WebAndMobileDesign', 'SocialMediaMarketing', 'SEO', 'ContentMarketing', 'EmailMarketing', 'VideoMarketing', 'ArticlesAndBlogPosts', 'Translation', 'ProofreadingAndEditing', 'Copywriting', 'CreativeWriting', 'WhiteboardAndAnimatedExplainers', 'VideoEditing', 'ShortVideoAds', 'LogoAnimation', 'CharacterAnimation', 'VoiceOver', 'MixingAndMastering', 'ProducersAndComposers', 'SingersAndVocalists', 'SoundEffects', 'WebProgramming', 'MobileApps', 'ECommerceDevelopment', 'GameDevelopment', 'DataAnalysisAndReports', 'VirtualAssistant', 'MarketResearch', 'BusinessPlans', 'BrandingServices', 'FinancialConsulting', 'OnlineTutoring', 'Wellness', 'ArtsAndCrafts', 'RelationshipAdvice', 'PersonalStylists');

-- CreateEnum
CREATE TYPE "SubNiche" AS ENUM ('Minimalist', 'ThreeD', 'Mascot', 'HandDrawn', 'BusinessCards', 'StationeryDesign', 'ChildrensBook', 'Comics', 'Portraits', 'Flyers', 'Brochures', 'Leaflets', 'WebsiteDesign', 'AppDesign', 'LandingPageDesign', 'Instagram', 'Facebook', 'Twitter', 'LinkedIn', 'OnPageSEO', 'OffPageSEO', 'TechnicalSEO', 'BlogWriting', 'GuestPosting', 'ContentStrategy', 'EmailCampaigns', 'NewsletterDesign', 'EmailCopywriting', 'YouTubeMarketing', 'VideoSEO', 'VideoAds', 'SEOWriting', 'TechnicalWriting', 'GeneralTranslation', 'LegalTranslation', 'TechnicalTranslation', 'AcademicEditing', 'BookEditing', 'ResumeEditing', 'SalesCopy', 'AdCopy', 'ProductDescriptions', 'ShortStories', 'Poetry', 'Scriptwriting', 'WhiteboardAnimation', 'TwoDAnimation', 'ThreeDAnimation', 'YouTubeEditing', 'MusicVideoEditing', 'CommercialEditing', 'SocialMediaAds', 'ProductAds', 'EventAds', 'ThreeDLogoAnimation', 'IntroOutroAnimation', 'CustomAnimation', 'CartoonCharacter', 'ThreeDCharacter', 'GameCharacter', 'MaleVoice', 'FemaleVoice', 'CharacterVoice', 'SongMixing', 'PodcastMixing', 'AudioMastering', 'CustomMusic', 'Jingles', 'PodcastMusic', 'MaleSingers', 'FemaleSingers', 'BackgroundVocals', 'CustomSoundEffects', 'GameSounds', 'Foley', 'FrontendDevelopment', 'BackendDevelopment', 'FullStackDevelopment', 'iOSDevelopment', 'AndroidDevelopment', 'HybridApps', 'Shopify', 'WooCommerce', 'Magento', 'Unity', 'UnrealEngine', 'TwoDGameDevelopment', 'DataVisualization', 'DataMining', 'DataEngineering', 'AdminSupport', 'DataEntry', 'Research', 'CompetitorAnalysis', 'SurveyDesign', 'MarketAnalysis', 'StartupPlans', 'InvestorPlans', 'StrategicPlans', 'BrandStrategy', 'BrandNaming', 'BrandGuidelines', 'FinancialPlanning', 'Accounting', 'BusinessValuation', 'LanguageLessons', 'MusicLessons', 'FitnessCoaching', 'Meditation', 'LifeCoaching', 'DietPlans', 'CustomArtwork', 'HandmadeCrafts', 'CraftLessons', 'DatingAdvice', 'MarriageCounseling', 'BreakupAdvice', 'FashionAdvice', 'PersonalShopping', 'WardrobeStyling');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT;

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "skills" TEXT[],
    "languages" TEXT[],
    "profilePicture" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'BUYER',
    "category" "Category",
    "niche" "Niche",
    "subNiche" "SubNiche",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gig" (
    "id" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subCategory" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "revisions" INTEGER NOT NULL,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "gigId" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "amount" DOUBLE PRECISION NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dispute" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resolution" TEXT,

    CONSTRAINT "Dispute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "fromAddress" TEXT NOT NULL,
    "toAddress" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "txHash" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "purpose" "TransactionPurpose" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Dispute_orderId_key" ON "Dispute"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_orderId_key" ON "Review"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_txHash_key" ON "Transaction"("txHash");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gig" ADD CONSTRAINT "Gig_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_gigId_fkey" FOREIGN KEY ("gigId") REFERENCES "Gig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dispute" ADD CONSTRAINT "Dispute_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
