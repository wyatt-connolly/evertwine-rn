import { SupabaseDataService } from "../services/SupabaseDataService";
import { getMockCommunityUsers } from "../data/mockCommunityUsers";

async function seedCommunityUsers() {
  console.log("🌱 Starting to seed community users...");
  
  const mockUsers = getMockCommunityUsers();
  let successCount = 0;
  let errorCount = 0;
  
  for (const user of mockUsers) {
    try {
      // Check if user already exists
      const existingUser = await SupabaseDataService.getUser(user.uid);
      
      if (existingUser) {
        console.log(`⏭️  User ${user.displayName} already exists, skipping...`);
        continue;
      }
      
      // Create the user
      await SupabaseDataService.createUser(user);
      console.log(`✅ Successfully created user: ${user.displayName}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Unexpected error creating user ${user.displayName}:`, error);
      errorCount++;
    }
  }
  
  console.log("\n📊 Seeding Summary:");
  console.log(`✅ Successfully created: ${successCount} users`);
  console.log(`❌ Errors: ${errorCount} users`);
  console.log(`📝 Total processed: ${mockUsers.length} users`);
  
  if (errorCount === 0) {
    console.log("🎉 All community users seeded successfully!");
  } else {
    console.log("⚠️  Some users failed to seed. Check the errors above.");
  }
}

// Run the seeding function
seedCommunityUsers()
  .then(() => {
    console.log("🏁 Seeding process completed.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Fatal error during seeding:", error);
    process.exit(1);
  });
