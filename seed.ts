import { db } from "@/server/db";
import { shops, transactions, users } from "@/server/db/schema";

export async function seed() {
  try {
    console.log("Seeding the database...");

    // We'll use the existing user with ID be658c00-2803-487a-b824-319798bb9d9e
    const existingUserId = "41d63103-239a-4323-a7a8-00845d40b3b5";

    // Create additional users
    const newUserId1 = crypto.randomUUID();
    const newUserId2 = crypto.randomUUID();
    const newUserId3 = crypto.randomUUID();

    await db.insert(users).values([
      {
        id: newUserId1,
        name: "Rahul Kumar",
        email: "rahul.kumar@example.com",
        image: "https://randomuser.me/api/portraits/men/1.jpg",
      },
      {
        id: newUserId2,
        name: "Priya Singh",
        email: "priya.singh@example.com",
        image: "https://randomuser.me/api/portraits/women/2.jpg",
      },
      {
        id: newUserId3,
        name: "Amit Patel",
        email: "amit.patel@example.com",
        image: "https://randomuser.me/api/portraits/men/3.jpg",
      },
    ]);

    console.log("Users seeded successfully!");

    // Create shops
    const shopResults = await db
      .insert(shops)
      .values([
        {
          merchantId: existingUserId,
          phoneNumber: "+919876543210",
          upiId: "dhruvil1808@okhdfcbank",
          name: "Apna General Store",
          address: "123 Market Road, Mumbai, Maharashtra",
          status: "active",
          image:
            "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        },
        {
          merchantId: existingUserId,
          phoneNumber: "+919876543211",
          upiId: "havitonline-1@oksbi",
          name: "Digital World Electronics",
          address: "456 Tech Lane, Bangalore, Karnataka",
          status: "active",
          image:
            "https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        },
        {
          merchantId: existingUserId,
          phoneNumber: "+919876543212",
          upiId: "fashion.store@upi",
          name: "Trendy Fashions",
          address: "789 Style Street, Delhi, Delhi NCR",
          status: "active",
          image:
            "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        },
      ])
      .returning({ id: shops.id });

    const shop1Id = shopResults[0]!.id;
    const shop2Id = shopResults[1]!.id;
    const shop3Id = shopResults[2]!.id;

    console.log("Shops seeded successfully!");

    // Create transactions
    await db.insert(transactions).values([
      {
        shopId: shop1Id,
        customerId: existingUserId,
        amount: 120.5,
        notes: "Monthly groceries",
        isPaid: true,
      },
      {
        shopId: shop1Id,
        customerId: existingUserId,
        amount: 45.75,
        notes: "Snacks and beverages",
        isPaid: true,
      },
      {
        shopId: shop2Id,
        customerId: existingUserId,
        amount: 15000.0,
        notes: "New laptop purchase",
        isPaid: false,
      },
      {
        shopId: shop2Id,
        customerId: existingUserId,
        amount: 2500.0,
        notes: "Smartphone accessories",
        isPaid: false,
      },
      {
        shopId: shop3Id,
        customerId: existingUserId,
        amount: 3200.5,
        notes: "Winter collection shopping",
        isPaid: false,
      },
      {
        shopId: shop3Id,
        customerId: existingUserId,
        amount: 1800.0,
        notes: "Formal wear",
        isPaid: true,
      },
    ]);

    console.log("Transactions seeded successfully!");
    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// Execute the seed function
seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
