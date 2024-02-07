import { Survey } from '@prisma/client';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import db from '../db';

export const getServerSideProps = (async ({ params }) => {
  if (!params?.surveyId || typeof params.surveyId !== 'string') {
    return { notFound: true };
  }

  const survey = await db.survey.findUnique({
    where: { id: params.surveyId },
    // select: {
    //   name: true,
    //   fields: {
    //     select: {
    //       index: true,
    //       field: {
    //         select: {
    //           id: true,
    //           text: true,
    //           type: true,
    //         },
    //       },
    //     },
    //   },
    //   tenant: true,
    // },
    include: {
      fields: { include: { field: true } },
      tenant: true,
    },
  });

  if (!survey) {
    return { notFound: true };
  }

  return { props: { survey } };
}) satisfies GetServerSideProps<{ survey: Survey }>;

// This page renders out each of the fields in the survey, separated by page breaks.
export default function Page({ survey }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main>
      <h1>{survey.name}</h1>
      <pre>{JSON.stringify(survey, null, 4)}</pre>
      <form>
        {survey.fields.map((field) => (
          <div key={field.index}>
            <label htmlFor={field.field.id}>{field.field.text}</label>
            <input type="text" id={field.field.id} name={field.field.id} />
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </main>
  );
}
