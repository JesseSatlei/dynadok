import mongoose from "mongoose";
import { MongoClientRepository } from "../../../src/infrastructure/database/MongoClientRepository";
import { MongoMemoryServer } from "mongodb-memory-server";

describe("MongoClientRepository", () => {
  let mongoServer: MongoMemoryServer;
  let clientRepository: MongoClientRepository;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), {});

    clientRepository = new MongoClientRepository();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  test("deve criar um cliente no banco de dados", async () => {
    const client = await clientRepository.create({
      name: "Test User",
      email: "test@example.com",
      phone: "123456789",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(client).toHaveProperty("_id");
    expect(client.email).toBe("test@example.com");
  });
});
