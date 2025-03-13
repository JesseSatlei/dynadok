import { ClientUseCase } from "../../../src/application/use-cases/ClientUseCase";
import { MongoClientRepository } from "../../../src/infrastructure/database/MongoClientRepository";

jest.mock("../../../src/infrastructure/database/MongoClientRepository");

describe("ClientUseCase", () => {
  let clientUseCase: ClientUseCase;
  let clientRepository: jest.Mocked<MongoClientRepository>;

  beforeEach(() => {
    clientRepository = new MongoClientRepository() as jest.Mocked<MongoClientRepository>;
    clientUseCase = new ClientUseCase(clientRepository);
  });

  test("deve criar um cliente", async () => {
    clientRepository.findByEmail.mockResolvedValue(null);
    clientRepository.create.mockResolvedValue({
      name: "John Doe",
      email: "john@example.com",
      phone: "123456789",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await clientUseCase.create("Jane Doe", "jane@example.com", "987654321");

    expect(result).toHaveProperty("email");
    expect(clientRepository.create).toHaveBeenCalled();
  });

  test("não deve criar cliente com email duplicado", async () => {
    clientRepository.findByEmail.mockResolvedValue({ id: "123", name: "Jane", email: "jane@example.com", phone: "987654321", createdAt: new Date(), updatedAt: new Date() });

    await expect(clientUseCase.create("Jane Doe", "jane@example.com", "987654321"))
      .rejects
      .toThrow("E-mail já cadastrado.");
  });
});
