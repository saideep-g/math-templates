import { type AnyItem, type CommitResult } from '../types/itemTypes';
import { normalizeFraction } from './normalize';

/**
 * Orchestrates scoring based on the item's defined model.
 */
export const scoreItem = (item: AnyItem, response: any, attempt: number): CommitResult => {
  const { model, params } = item.scoring;
  let isCorrect = false;
  let score = 0;
  let diagnosticTags: string[] = [];

  switch (model) {
    case 'exact':
      isCorrect = response === item.answer_key.value;
      score = isCorrect ? 1 : 0;
      break;

    case 'equivalence':
      // Fraction equivalence scoring
      const blanks = item.answer_key.blanks;
      const responseBlanks = response as Record<string, string>;
      const correctCount = Object.keys(blanks).reduce((acc, key) => {
        const normalizedResponse = normalizeFraction(responseBlanks[key]);
        const isMatch = blanks[key].some((ans: string) => normalizeFraction(ans) === normalizedResponse);
        return acc + (isMatch ? 1 : 0);
      }, 0);
      score = correctCount / Object.keys(blanks).length;
      isCorrect = score === 1;
      break;

    case 'set_membership':
      // Sorting scoring
      const mapping = item.answer_key.mapping;
      const respMapping = response as Record<string, string>;
      const totalItems = Object.keys(mapping).length;
      const correctMappings = Object.keys(mapping).filter(k => mapping[k] === respMapping[k]).length;
      score = correctMappings / totalItems;
      isCorrect = score === 1;
      break;

    case 'process':
      // Multi-step algebra balance
      if (item.template_id === 'BALANCE_OPS') {
        const finalX = response.currentX;
        isCorrect = finalX === item.answer_key.x_value;
        score = isCorrect ? 1 : 0;
        
        // Detect specific logic errors for feedback
        if (response.history?.[0]?.op_id === 'DIVIDE' && item.item_id.includes('BAL')) {
          diagnosticTags.push('DIVIDE_BEFORE_SUBTRACT');
        }
      }
      break;

    case 'rubric_lite':
      // Error analysis scoring
      if (item.template_id === 'ERROR_ANALYSIS') {
        const lineCorrect = response.wrong_line === item.answer_key.first_wrong_line_index;
        const numbersCorrect = Object.keys(item.answer_key.corrections).every(
          k => Number(response[k]) === item.answer_key.corrections[k]
        );
        
        if (lineCorrect && numbersCorrect) score = 1;
        else if (lineCorrect) score = params.partial_credit.line_only;
        else if (numbersCorrect) score = params.partial_credit.numbers_only;
        
        isCorrect = score === 1;
      }
      break;
  }

  // Map diagnostic tags to feedback
  const feedbackText = isCorrect 
    ? item.feedback_map.on_correct 
    : attempt === 1 
      ? item.feedback_map.on_incorrect_attempt_1 
      : item.feedback_map.on_incorrect_attempt_2;

  return { isCorrect, score, response, diagnosticTags, feedbackText };
};