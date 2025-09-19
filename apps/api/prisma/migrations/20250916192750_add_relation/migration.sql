-- AddForeignKey
ALTER TABLE "public"."MultiChangeSetOption" ADD CONSTRAINT "MultiChangeSetOption_multiChangeSetId_fkey" FOREIGN KEY ("multiChangeSetId") REFERENCES "public"."MultiChangeSet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
