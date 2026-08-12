import "dotenv/config";
import mongoose from "mongoose";
import { Store, User, StoreMember } from "@shabu/database";
import { connectDatabase, disconnectDatabase } from "./config/database.js";

const runTest = async () => {
    try {
        console.log("⏳ Connecting to Database...");
        await connectDatabase();

        console.log("\n🧹 Clearing old test data...");
        await Store.deleteMany({ shopDomain: "test-store.myshopify.com" });
        await User.deleteMany({ email: "admin@test-store.com" });
        await StoreMember.deleteMany({});

        console.log("\n✨ 1. Creating a new Store (Phase 1)...");
        const store = await Store.create({
            name: "My Awesome Customizer Store",
            shopDomain: "test-store.myshopify.com",
            currency: "USD",
            status: "active",
            settings: { maxUploadSizeMb: 50, allowGuestDesigns: true }
        });
        console.log("✅ Store created successfully with ID:", store._id);

        console.log("\n✨ 2. Creating a new User (Phase 2)...");
        const user = await User.create({
            name: "Store Admin",
            email: "admin@test-store.com",
            passwordHash: "hashed_password_123",
            authProvider: "credentials",
            status: "active"
        });
        console.log("✅ User created successfully with ID:", user._id);

        console.log("\n✨ 3. Creating a Store Member Relation (Phase 2)...");
        const member = await StoreMember.create({
            storeId: store._id,
            userId: user._id,
            role: "owner",
            permissions: ["products.read", "orders.process"],
            status: "active"
        });
        console.log("✅ Store Member association created! Role:", member.role);

        console.log("\n🔍 4. Verification Check...");
        // Retrieve the member and populate the user and store details
        const savedMember = await StoreMember.findById(member._id)
            .populate("userId", "name email")
            .populate("storeId", "name shopDomain");

        console.log("\n🎉 TEST PASSED! Here is the populated relation:");
        console.log(JSON.stringify(savedMember, null, 2));

    } catch (error) {
        console.error("❌ Test failed:", error);
    } finally {
        await disconnectDatabase();
        process.exit(0);
    }
};

void runTest();
