import { ClientProxy } from "@nestjs/microservices";
import { Test, TestingModule } from "@nestjs/testing";
import { of } from "rxjs";
import { UserEntity } from "src/app/users/domain/user.entity";
import { USERS_TCP_SERVICE } from "src/app/users/users.constants";
import { SUPPORT_SERVICE, SupportService } from "./support.service";

describe("SupportService", () => {
  let service: SupportService;
  let supportClient: ClientProxy;
  let usersClient: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupportService,
        {
          provide: SUPPORT_SERVICE,
          useValue: {
            send: jest.fn(),
          },
        },
        {
          provide: USERS_TCP_SERVICE,
          useValue: {
            send: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SupportService>(SupportService);
    supportClient = module.get<ClientProxy>(SUPPORT_SERVICE);
    usersClient = module.get<ClientProxy>(USERS_TCP_SERVICE);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("listMyTickets", () => {
    it("should list tickets for the current user", async () => {
      const userSub = "auth0|123";
      const userEntity: UserEntity = {
        sub_id: userSub,
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const tickets = [{ id: "1", title: "Issue 1" }];

      (usersClient.send as jest.Mock).mockReturnValue(of(userEntity));
      (supportClient.send as jest.Mock).mockReturnValue(of(tickets));

      const result = await service.listMyTickets(userSub);

      expect(usersClient.send).toHaveBeenCalledWith("getUserById", userSub);
      expect(supportClient.send).toHaveBeenCalledWith(
        "list_my_tickets",
        userSub,
      );
      expect(result).toEqual(tickets);
    });
  });
});
