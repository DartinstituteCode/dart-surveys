import { Box } from '@chakra-ui/react';
import { useCallback } from 'react';
import { Model } from 'survey-core';
import 'survey-core/defaultV2.min.css';
import { Survey } from 'survey-react-ui';
import intakeSurveyJson from '../../prisma/intake.json';

export default function Page() {
  const surveyModel = new Model(intakeSurveyJson);
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
