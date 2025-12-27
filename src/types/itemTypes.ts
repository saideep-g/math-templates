export type TemplateId = 
  | 'BALANCE_OPS' 
  | 'NUMBER_LINE_PLACE' 
  | 'WORKED_EXAMPLE_COMPLETE' 
  | 'CLASSIFY_SORT' 
  | 'ERROR_ANALYSIS';

export interface BaseItem {
  item_id: string;
  atom_id: string;
  template_id: TemplateId;
  difficulty: number;
  prompt: { text: string; latex: string | null };
  instruction: string;
  stimulus: { text: string | null; diagram: string | null; data: any | null };
  answer_key: any;
  scoring: {
    model: 'exact' | 'tolerance' | 'equivalence' | 'set_membership' | 'rubric_lite' | 'process';
    params: any;
  };
  worked_solution: {
    steps: string[];
    final_answer: string;
    why_it_works?: string;
  };
  misconceptions: {
    category: string;
    tag: string;
    symptom: string;
    hint: string;
  }[];
  feedback_map: {
    on_correct: string;
    on_incorrect_attempt_1: string;
    on_incorrect_attempt_2: string;
  };
  transfer_item?: any;
}

export interface BalanceOpsItem extends BaseItem {
  template_id: 'BALANCE_OPS';
  interaction: {
    type: 'balance_ops';
    config: {
      equation: {
        left: any;
        right: any;
      };
      operations: { op_id: string; label: string; value: number; apply: string }[];
      max_steps: number;
      show_step_log: boolean;
      goal: { type: string; variable: string };
    };
  };
}

export interface NumberLineItem extends BaseItem {
  template_id: 'NUMBER_LINE_PLACE';
  interaction: {
    type: 'number_line_place';
    config: {
      number_line: { min: number; max: number; tick: number; snap: number };
      start_marker: number;
      show_hops?: { direction: 'right' | 'left'; count: number };
      marker_style: string;
    };
  };
}

export interface WorkedExampleItem extends BaseItem {
  template_id: 'WORKED_EXAMPLE_COMPLETE';
  interaction: {
    type: 'worked_example_complete';
    config: {
      steps: { line: string; blank_id: string | null; input: string | null }[];
      blank_prompts: Record<string, string>;
    };
  };
}

export interface ClassifySortItem extends BaseItem {
  template_id: 'CLASSIFY_SORT';
  interaction: {
    type: 'classify_sort';
    config: {
      bins: { bin_id: string; label: string }[];
      items: { item_id: string; label: string }[];
      allow_one_item_per_bin: boolean;
    };
  };
}

export interface ErrorAnalysisItem extends BaseItem {
  template_id: 'ERROR_ANALYSIS';
  interaction: {
    type: 'error_analysis';
    config: {
      student_work: { lines: string[] };
      response_inputs: { input_id: string; type: 'select_line' | 'number' }[];
    };
  };
}

export type AnyItem = 
  | BalanceOpsItem 
  | NumberLineItem 
  | WorkedExampleItem 
  | ClassifySortItem 
  | ErrorAnalysisItem;

export interface CommitResult {
  isCorrect: boolean;
  score: number;
  response: any;
  diagnosticTags?: string[];
  feedbackText: string;
}

export type TemplateProps<T> = {
  item: T;
  attempt: number;
  onCommit: (result: CommitResult) => void;
  onChangeLocal?: (localState: any) => void;
};