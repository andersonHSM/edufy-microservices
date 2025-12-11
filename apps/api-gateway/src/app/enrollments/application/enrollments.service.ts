import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { CreateEnrollmentDto } from "../presentation/dto/create-enrollment.dto";

export const ENROLLMENTS_SERVICE = "ENROLLMENTS_SERVICE";

@Injectable()
export class EnrollmentsService {
  constructor(
    @Inject(ENROLLMENTS_SERVICE) private readonly client: ClientProxy,
  ) {}

  create(createEnrollmentDto: CreateEnrollmentDto) {
    return this.client.send("create_enrollment", {
      ...createEnrollmentDto,
      status: "pending",
    });
  }

  listMyEnrollments(studentSubId: string) {
    return this.client.send("list_my_enrollments", studentSubId);
  }
}
