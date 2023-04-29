import {OpenQuestion} from "./OpenQuestion";
import {DateQuestion} from "./DateQuestion";
import {MultipleOptionQuestion} from "./MultipleOptionQuestion";

export class Question {
  statement: string = "";
  type: string = "";
  required: boolean = false;

  openQuestion: OpenQuestion | null = null;
  dateQuestion: DateQuestion | null = null;
  multipleOptionQuestion: MultipleOptionQuestion | null = null;
}
