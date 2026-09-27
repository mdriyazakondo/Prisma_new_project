import "dotenv/config";
import app from "./app";
import { prisma } from "./lib/prisma";
import config from "./config";

const port = config.port;

async function main() {
  try {
    await prisma.$connect();
    console.log("database connect successfully");
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error(error);
    await prisma.$disconnect().catch(() => undefined);
    process.exit(1);
  }
}

main();
