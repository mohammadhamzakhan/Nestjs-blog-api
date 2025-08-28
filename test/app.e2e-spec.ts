import { HttpCode, HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { PrismaService } from "../src/module/prisma/prisma.service";
import * as pactum from 'pactum';
import { execSync } from "child_process";
import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { signUpDto } from "src/module/auth/dto";
import { Role } from "@prisma/client";


describe("App e2e", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    let connect = false;

    if (!connect) {
      try {
        execSync('npx prisma db push', { stdio: 'inherit' });
        connect = true;

      } catch (err) {
        console.log("Database is not ready! retrying....", err);

        await new Promise((res) => setTimeout(res, 1000));
      }
    }

    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
    }));
    await app.init();
    await app.listen(3000);

    prisma = app.get(PrismaService);
    await prisma.cleanDB();
    pactum.request.setBaseUrl('http://localhost:3000');
  });

  afterAll(async () => {
    app.close();
  })

  describe('Auth', () => {
    describe('SignUp', () => {
      const dto: signUpDto = {
        name: 'Hamza ali',
        email: 'hamza@gmail.com',
        password: 'hamzaali',
        role: Role.USER,
      }

      it('should create user ', () => {
        return pactum.spec()
          .post('/auth/signUp')
          .withBody(dto)
          .expectStatus(HttpStatus.CREATED);
      })
    })
  })

});