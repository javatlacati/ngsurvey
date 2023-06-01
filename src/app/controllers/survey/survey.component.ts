import {Component, OnInit} from '@angular/core';
import {Apollo, gql} from "apollo-angular";
import {Survey} from "../../model/Survey";
import {SurveyTemplate} from "../../model/SurveyTemplate";
import {NgForm} from '@angular/forms';
import {ActivatedRoute} from "@angular/router";
import {Question} from "../../model/Question";
import {MultipleOptionQuestion} from "../../model/MultipleOptionQuestion";
import {MultipleOptionAnswer} from "../../model/MultipleOptionAnswer";
import {OpenQuestionAnswer} from "../../model/OpenQuestionAnswer";
import {DateAnswer} from "../../model/DateAnswer";

@Component({
  selector: 'survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit {
  item: SurveyTemplate | null = null;
  expandedSectionIndex = 0;
  userResponses: any[][] = [[], []];

  constructor(private apollo: Apollo, private route: ActivatedRoute) {
  }

  ngOnInit() {
    const routeParams = this.route.snapshot.paramMap;
    const uuid = routeParams.get("uuid")
    this.apollo
    .query({
      query: gql`
        query GetTemplateByUuid($uuid: String!) {
          template(uuid: $uuid) {
            surveyTemplateId
            uuid
            sections {
              sectionId
              name
              questions {
                ... on MultipleOptionQuestion {
                  questionId
                  statement
                  type
                  required
                  answerOptions
                }
                ... on Question {
                  questionId
                  statement
                  type
                  required
                }
              }
            }
          }
        }`,
      variables: {
        "uuid": uuid
      }
    })
    .subscribe(({data}) => {
      // @ts-ignore
      this.item = data.template;
      if (this.item) {
        let numberSections = this.item.sections.length
        this.userResponses = []
        for (let i = 0; i < numberSections; i++) {
          this.userResponses.push([])
        }
      }
    });
  }

  guardarEncuesta(forma: NgForm) {
    console.log(this.userResponses)
    if (this.item) {
      let survey = new Survey();
      survey.templateId = this.item.surveyTemplateId
      survey.answers = []

      for (let sectionIdx = 0; sectionIdx < this.item.sections.length; sectionIdx++) {
        const section = this.item.sections[sectionIdx];
        for (let questionIdx = 0; questionIdx < section.questions.length; questionIdx++) {
          const question = section.questions[questionIdx];
          if (question instanceof MultipleOptionQuestion) {
            console.log(`#${section.sectionId}_${question.questionId}`)
            let moq = question as MultipleOptionQuestion
            for (let optionIdx = 0; optionIdx < moq.answerOptions.length; optionIdx++) {
              let multipleOptionAnswer = new MultipleOptionAnswer();
              multipleOptionAnswer.questionId = question.questionId;
              multipleOptionAnswer.answerIdx = moq.answerOptions.findIndex(this.userResponses[sectionIdx][questionIdx])
              multipleOptionAnswer.questionType = moq.type
              survey.answers.push(multipleOptionAnswer)
              // console.log(`selector "#${section.sectionId}_${question.questionId}_${optionIdx}"`)
            }
          } else {
            if (question.type == 'DATE') {
              let dateQuestion = new DateAnswer()
              dateQuestion.questionType = question.type
              dateQuestion.theDate = this.userResponses[sectionIdx][questionIdx]
              dateQuestion.questionId = question.questionId
              survey.answers.push(dateQuestion)
            } else if (question.type == 'OPEN') { //OPEN
              let openQuestion = new OpenQuestionAnswer()
              openQuestion.questionType = question.type
              openQuestion.answer = this.userResponses[sectionIdx][questionIdx]
              openQuestion.questionId = question.questionId
              survey.answers.push(openQuestion)
            } else {
              let moq = question as MultipleOptionQuestion
              let multipleOptionAnswer = new MultipleOptionAnswer();
              multipleOptionAnswer.questionId = question.questionId;
              multipleOptionAnswer.answerIdx = moq.answerOptions.findIndex(value => value === this.userResponses[sectionIdx][questionIdx])
              multipleOptionAnswer.questionType = moq.type
              survey.answers.push(multipleOptionAnswer)
              // console.log(`selector "#${section.sectionId}_${question.questionId}_${optionIdx}"`)
            }

          }
        }
      }
      console.log(`sending answers: ${JSON.stringify(survey)}`)
    }
  }

  getOptions(question: Question): string[] {
    // console.log(`type: ${question.type}`)
    if (question.type == 'MULTIPLE_OPTION') {
      return (question as MultipleOptionQuestion).answerOptions
    } else {
      return []
    }
  }
}
