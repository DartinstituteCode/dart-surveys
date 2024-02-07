import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

enum FieldType {
  HTML,
  PAGE_BREAK,
  SMALL_TEXT,
  TEXT,
  RATING_TO_5,
  RATING_TO_10,
  MULTIPLE_CHOICE,
  TRUE_FALSE,
}

async function main() {
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Care Providers',
    },
  });

  const nameField = await prisma.field.create({
    data: { type: FieldType.SMALL_TEXT, text: 'Name', tenantId: tenant.id },
  });
  const emailField = await prisma.field.create({
    data: { type: FieldType.SMALL_TEXT, text: 'Email', tenantId: tenant.id },
  });
  const phoneField = await prisma.field.create({
    data: { type: FieldType.SMALL_TEXT, text: 'Phone', tenantId: tenant.id },
  });
  const pageBreakField = await prisma.field.create({
    data: { type: FieldType.PAGE_BREAK, text: '', tenantId: tenant.id },
  });

  const survey = await prisma.survey.create({
    data: {
      name: 'Intake Survey',
      tenantId: tenant.id,
      fields: {
        create: [
          { index: 0, fieldId: nameField.id },
          { index: 1, fieldId: emailField.id },
          { index: 2, fieldId: phoneField.id },
          { index: 3, fieldId: pageBreakField.id },
          {
            index: 4,
            fieldId: (
              await prisma.field.create({
                data: {
                  type: FieldType.RATING_TO_5,
                  text: 'On a scale of 1-5, please rate your overall well-being',
                  tenantId: tenant.id,
                },
              })
            ).id,
          },
          { index: 5, fieldId: pageBreakField.id },
          {
            index: 6,
            fieldId: (
              await prisma.field.create({
                data: {
                  type: FieldType.RATING_TO_5,
                  text: "How satisfied are you with the quality of care you've received thus far?",
                  tenantId: tenant.id,
                },
              })
            ).id,
          },
        ],
      },
    },
  });
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
