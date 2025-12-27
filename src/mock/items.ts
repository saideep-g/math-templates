import { type AnyItem } from '../types/itemTypes';

/**
 * MOCK_ITEMS
 * * This file contains the full JSON definitions for the 5 sample questions 
 * provided in questions_new.json. These items cover the five core templates:
 * BALANCE_OPS, NUMBER_LINE_PLACE, WORKED_EXAMPLE_COMPLETE, CLASSIFY_SORT, and ERROR_ANALYSIS.
 */
export const MOCK_ITEMS: AnyItem[] = [
  {
    "item_id": "MQ.CBSE7.CH04.EQ.04.BAL.0001",
    "atom_id": "CBSE7.CH04.EQ.04",
    "template_id": "BALANCE_OPS",
    "difficulty": 2,
    "prompt": { "text": "Solve for x using balance moves: 3x + 5 = 20", "latex": "$$3x+5=20$$" },
    "instruction": "Tap operations to do the SAME thing to both sides until x is alone.",
    "stimulus": { "text": null, "diagram": null, "data": null },
    "interaction": {
      "type": "balance_ops",
      "config": {
        "equation": {
          "left": { "format": "ax_plus_b", "a": 3, "b": 5, "variable": "x" },
          "right": { "format": "const", "value": 20 }
        },
        "operations": [
          { "op_id": "ADD", "label": "+5", "value": 5, "apply": "both_sides" },
          { "op_id": "SUBTRACT", "label": "-5", "value": 5, "apply": "both_sides" },
          { "op_id": "MULTIPLY", "label": "×3", "value": 3, "apply": "both_sides" },
          { "op_id": "DIVIDE", "label": "÷3", "value": 3, "apply": "both_sides" }
        ],
        "max_steps": 3,
        "show_step_log": true,
        "goal": { "type": "isolate_variable", "variable": "x" }
      }
    },
    "answer_key": {
      "x_value": 5,
      "valid_sequences": [[{ "op_id": "SUBTRACT", "value": 5 }, { "op_id": "DIVIDE", "value": 3 }]]
    },
    "scoring": { "model": "process", "params": { "result_required": true, "max_steps": 3 } },
    "worked_solution": {
      "steps": [
        "Start: 3x + 5 = 20",
        "Subtract 5 from both sides: 3x = 15",
        "Divide both sides by 3: x = 5",
        "Check: 3(5) + 5 = 15 + 5 = 20 ✅"
      ],
      "final_answer": "x = 5"
    },
    "misconceptions": [],
    "feedback_map": {
      "on_correct": "Nice. You undid +5 first, then undid ×3. That reverse order is the key strategy.",
      "on_incorrect_attempt_1": "Try undoing the +5 first (reverse order). Make the equation simpler before dividing.",
      "on_incorrect_attempt_2": "Step scaffold: (1) subtract 5 from both sides, (2) divide both sides by 3, (3) check."
    },
    "transfer_item": {
      "item_id": "MQ.CBSE7.CH04.EQ.04.BAL.0001_T",
      "template_id": "BALANCE_OPS",
      "prompt": { "text": "Transfer: Solve 4x − 7 = 21", "latex": "$$4x-7=21$$" },
      "instruction": "Same strategy: isolate x.",
      "interaction": {
        "type": "balance_ops",
        "config": {
          "equation": {
            "left": { "format": "ax_plus_b", "a": 4, "b": -7, "variable": "x" },
            "right": { "format": "const", "value": 21 }
          },
          "operations": [
            { "op_id": "ADD", "label": "+7", "value": 7, "apply": "both_sides" },
            { "op_id": "SUBTRACT", "label": "-7", "value": 7, "apply": "both_sides" },
            { "op_id": "DIVIDE", "label": "÷4", "value": 4, "apply": "both_sides" }
          ],
          "max_steps": 3,
          "show_step_log": true,
          "goal": { "type": "isolate_variable", "variable": "x" }
        }
      },
      "answer_key": { "x_value": 7 },
      "scoring": { "model": "process", "params": {} },
      "worked_solution": { "steps": ["4x - 7 = 21", "4x = 28", "x = 7"], "final_answer": "x = 7" },
      "feedback_map": { "on_correct": "Perfect transfer!", "on_incorrect_attempt_1": "Apply the same logic as before.", "on_incorrect_attempt_2": "Add 7 then divide by 4." },
      "misconceptions": []
    }
  },
  {
    "item_id": "MQ.CBSE7.CH01.INT.02.NL.0001",
    "atom_id": "CBSE7.CH01.INT.02",
    "template_id": "NUMBER_LINE_PLACE",
    "difficulty": 1,
    "prompt": { "text": "Start at −3 on the number line. Move 5 steps to the right. Where do you land?", "latex": null },
    "instruction": "Drag the marker to the landing point.",
    "stimulus": { "text": null, "diagram": null, "data": null },
    "interaction": {
      "type": "number_line_place",
      "config": {
        "number_line": { "min": -10, "max": 10, "tick": 1, "snap": 1 },
        "start_marker": -3,
        "show_hops": { "direction": "right", "count": 5 },
        "marker_style": "dot"
      }
    },
    "answer_key": { "value": 2 },
    "scoring": { "model": "exact", "params": {} },
    "worked_solution": {
      "steps": ["From −3, moving right means adding.", "−3 + 5 = 2."],
      "final_answer": "2"
    },
    "misconceptions": [],
    "feedback_map": {
      "on_correct": "Yes. You added 5 by hopping right 5 ticks from −3.",
      "on_incorrect_attempt_1": "Try counting hops: from −3 go to −2 (1), −1 (2), 0 (3), 1 (4), 2 (5).",
      "on_incorrect_attempt_2": "Rule reminder: moving right is +, moving left is −. Then redo the 5 hops slowly."
    }
  },
  {
    "item_id": "MQ.CBSE7.CH02.FRD.05.WEC.0001",
    "atom_id": "CBSE7.CH02.FRD.05",
    "template_id": "WORKED_EXAMPLE_COMPLETE",
    "difficulty": 2,
    "prompt": { "text": "Complete the worked example: (3/4) ÷ (2/3)", "latex": "$$\\frac{3}{4}\\div\\frac{2}{3}$$" },
    "instruction": "Fill the blanks to finish the method correctly.",
    "stimulus": { "text": null, "diagram": null, "data": null },
    "interaction": {
      "type": "worked_example_complete",
      "config": {
        "steps": [
          { "line": "1) $$\\frac{3}{4}\\div\\frac{2}{3}=\\frac{3}{4}\\times\\boxed{\\ \\ \\ }$$", "blank_id": "B1", "input": "fraction" },
          { "line": "2) $$=\\frac{3\\times 3}{4\\times 2}$$", "blank_id": null, "input": null },
          { "line": "3) $$=\\boxed{\\ \\ \\ }$$", "blank_id": "B2", "input": "fraction_or_mixed" }
        ],
        "blank_prompts": {
          "B1": "Write the reciprocal of 2/3",
          "B2": "Simplify the result (improper fraction or mixed number)"
        }
      }
    },
    "answer_key": {
      "blanks": {
        "B1": ["3/2", "\\frac{3}{2}"],
        "B2": ["9/8", "1 1/8", "1 1/8", "\\frac{9}{8}", "1\\frac{1}{8}"]
      }
    },
    "scoring": { "model": "equivalence", "params": {} },
    "worked_solution": {
      "steps": [
        "Dividing by a fraction means multiplying by its reciprocal.",
        "Reciprocal of 2/3 is 3/2.",
        "So: (3/4) ÷ (2/3) = (3/4) × (3/2) = 9/8 = 1 1/8."
      ],
      "final_answer": "9/8 (or 1 1/8)"
    },
    "misconceptions": [],
    "feedback_map": {
      "on_correct": "Perfect. You used the reciprocal correctly and simplified.",
      "on_incorrect_attempt_1": "Check which fraction should be flipped: flip the divisor 2/3, not 3/4.",
      "on_incorrect_attempt_2": "Scaffold: write (3/4) × (3/2), then multiply tops and bottoms."
    }
  },
  {
    "item_id": "MQ.CBSE7.CH06.TRI.01.SORT.0001",
    "atom_id": "CBSE7.CH06.TRI.01",
    "template_id": "CLASSIFY_SORT",
    "difficulty": 2,
    "prompt": { "text": "Sort these triangles by their side lengths.", "latex": null },
    "instruction": "Drag each card into the correct bin. One bin is 'Not a triangle'.",
    "stimulus": { "text": null, "diagram": null, "data": null },
    "interaction": {
      "type": "classify_sort",
      "config": {
        "bins": [
          { "bin_id": "EQUI", "label": "Equilateral (all equal)" },
          { "bin_id": "ISO", "label": "Isosceles (two equal)" },
          { "bin_id": "SCA", "label": "Scalene (all different)" },
          { "bin_id": "NOTRI", "label": "Not a triangle" }
        ],
        "items": [
          { "item_id": "A", "label": "Sides: 6 cm, 6 cm, 6 cm" },
          { "item_id": "B", "label": "Sides: 5 cm, 5 cm, 8 cm" },
          { "item_id": "C", "label": "Sides: 4 cm, 6 cm, 7 cm" },
          { "item_id": "D", "label": "Sides: 2 cm, 3 cm, 5 cm" },
          { "item_id": "E", "label": "Sides: 7 cm, 9 cm, 7 cm" }
        ],
        "allow_one_item_per_bin": false
      }
    },
    "answer_key": {
      "mapping": { "A": "EQUI", "B": "ISO", "C": "SCA", "D": "NOTRI", "E": "ISO" }
    },
    "scoring": { "model": "set_membership", "params": {} },
    "worked_solution": {
      "steps": [
        "Equilateral: all three sides equal.",
        "Isosceles: exactly two equal.",
        "Scalene: all different.",
        "Not a triangle if the sum of two sides is not greater than the third (2+3=5)."
      ],
      "final_answer": "A→EQUI, B→ISO, C→SCA, D→NOTRI, E→ISO"
    },
    "misconceptions": [],
    "feedback_map": {
      "on_correct": "Nice sorting. Bonus: you used triangle inequality to catch the 'not a triangle' case.",
      "on_incorrect_attempt_1": "Recheck D: compare the largest side with the sum of the other two.",
      "on_incorrect_attempt_2": "Reminder: for a triangle, (smallest + middle) must be strictly greater than largest."
    }
  },
  {
    "item_id": "MQ.CBSE7.CH08.PCT.03.ERR.0001",
    "atom_id": "CBSE7.CH08.PCT.03",
    "template_id": "ERROR_ANALYSIS",
    "difficulty": 2,
    "prompt": { "text": "A bag costs ₹800. 25% discount, then 5% GST. Find the FIRST wrong line and fix it.", "latex": null },
    "instruction": "Tap the first incorrect line. Then enter the corrected GST and final price.",
    "stimulus": { "text": null, "diagram": null, "data": null },
    "interaction": {
      "type": "error_analysis",
      "config": {
        "student_work": {
          "lines": [
            "1) Discount = 25% of 800 = 200",
            "2) Price after discount = 800 − 200 = 600",
            "3) GST = 5% of 800 = 40",
            "4) Final price = 600 + 40 = 640"
          ]
        },
        "response_inputs": [
          { "input_id": "wrong_line", "type": "select_line" },
          { "input_id": "correct_gst", "type": "number" },
          { "input_id": "final_price", "type": "number" }
        ]
      }
    },
    "answer_key": {
      "first_wrong_line_index": 3,
      "corrections": { "correct_gst": 30, "final_price": 630 }
    },
    "scoring": { "model": "rubric_lite", "params": { "partial_credit": { "line_only": 0.4, "numbers_only": 0.6 } } },
    "worked_solution": {
      "steps": ["Price after discount: ₹600", "GST on ₹600: 5% of 600 = ₹30", "Final: 600 + 30 = ₹630"],
      "final_answer": "₹630"
    },
    "misconceptions": [],
    "feedback_map": {
      "on_correct": "Exactly. GST must be on the discounted ₹600.",
      "on_incorrect_attempt_1": "Check line 3: GST should be calculated on the discounted price, not the original.",
      "on_incorrect_attempt_2": "Scaffold: Find discounted price first. Then compute GST on that new base."
    }
  }
];