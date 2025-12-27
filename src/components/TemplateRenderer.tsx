import React from 'react';
import { type AnyItem, type TemplateProps } from '../types/itemTypes';
import { BalanceOps } from './templates/BalanceOps';
import { NumberLinePlace } from './templates/NumberLinePlace';
import { WorkedExampleComplete } from './templates/WorkedExampleComplete';
import { ClassifySort } from './templates/ClassifySort';
import { ErrorAnalysis } from './templates/ErrorAnalysis';

export const TemplateRenderer: React.FC<TemplateProps<AnyItem>> = (props) => {
  const { item } = props;

  switch (item.template_id) {
    case 'BALANCE_OPS':
      return <BalanceOps {...(props as TemplateProps<any>)} />;
    case 'NUMBER_LINE_PLACE':
      return <NumberLinePlace {...(props as TemplateProps<any>)} />;
    case 'WORKED_EXAMPLE_COMPLETE':
      return <WorkedExampleComplete {...(props as TemplateProps<any>)} />;
    case 'CLASSIFY_SORT':
      return <ClassifySort {...(props as TemplateProps<any>)} />;
    case 'ERROR_ANALYSIS':
      return <ErrorAnalysis {...(props as TemplateProps<any>)} />;
    default:
      return <div className="p-10 text-center text-slate-400">Interaction not found</div>;
  }
};