ALTER TABLE "CollectionRecipe"
ADD CONSTRAINT "CollectionRecipe_recipeId_fkey"
FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;
