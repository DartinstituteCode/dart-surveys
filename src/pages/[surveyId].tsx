import { Box } from '@chakra-ui/react';
import { Survey as SurveyType } from '@prisma/client';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useCallback } from 'react';
import { Model } from 'survey-core';
import 'survey-core/defaultV2.min.css';
import { Survey } from 'survey-react-ui';
import db from '../db';

export const getServerSideProps = (async ({ params }) => {
  if (!params?.surveyId || typeof params.surveyId !== 'string') {
    return { notFound: true };
  }

  const survey = await db.survey.findUnique({
    where: { id: params.surveyId },
    include: {
      questions: true,
      tenant: true,
    },
  });

  if (!survey) {
    return { notFound: true };
  }

  return { props: { survey } };
}) satisfies GetServerSideProps<{ survey: SurveyType }>;

export default function Page({ survey }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const surveyModel = new Model(survey.schema);
  const alertResults = useCallback((sender: any) => {
    console.log(sender);
  }, []);

  surveyModel.onComplete.add(alertResults);

  return (
    <Box maxW="70rem" mx="auto" my={8}>
      <Survey model={surveyModel} />
    </Box>
  );
}
