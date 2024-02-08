import { PrismaClient } from '@prisma/client';

import intakeSurveySchema from './intake.json';

const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Care Providers',
    },
  });

  const survey = await prisma.survey.create({
    data: {
      name: 'Intake Survey',
      tenantId: tenant.id,
      schema: JSON.stringify(intakeSurveySchema),
    },
  });

  const questionPromises: Promise<any>[] = [];

  intakeSurveySchema.pages.forEach((page) => {
    page.elements.forEach((element) => {
      questionPromises.push(
        prisma.question.create({
          data: {
            schemaId: element.name,
            tenantId: tenant.id,
            surveys: {
              connect: {
                id: survey.id,
              },
            },
          },
        }),
      );
    });
  });

  await Promise.all(questionPromises);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
