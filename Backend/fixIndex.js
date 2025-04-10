// fixIndex.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const FormSchema = require("./models/formSchema"); // Adjust path if different

const fixIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGOURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("🔌 Connected to MongoDB");

    // Drop the existing index on 'schemaName'
    try {
      await FormSchema.collection.dropIndex("schemaName_1");
      console.log("✅ Dropped old unique index on 'schemaName'");
    } catch (err) {
      if (err.codeName === "IndexNotFound") {
        console.log("ℹ️ Index 'schemaName_1' not found. Already removed.");
      } else {
        throw err;
      }
    }

    // Create new compound index: schemaName + userId
    await FormSchema.collection.createIndex(
      { schemaName: 1, userId: 1 },
      { unique: true }
    );

    console.log("✅ Created new unique compound index on { schemaName, userId }");
    process.exit();
  } catch (error) {
    console.error("❌ Error fixing index:", error);
    process.exit(1);
  }
};

fixIndex();
