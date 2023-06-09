import {Component, OnInit} from '@angular/core';
import {Apollo, gql} from "apollo-angular";
import {Survey} from "../../model/Survey";
import {SurveyTemplate} from "../../model/SurveyTemplate";
import {NgForm} from '@angular/forms';
import {ActivatedRoute} from "@angular/router";
import {Question} from "../../model/Question";
import {MultipleOptionQuestion} from "../../model/MultipleOptionQuestion";
import {Answer} from "../../model/Answer";
import {AnswerData} from "../../model/AnswerData";
import {SurveyService} from "../../services/SurveyService";

@Component({
  selector: 'survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit {
  item: SurveyTemplate | null = null;
  expandedSectionIndex = 0;
  userResponses: any[][] = [[], []];

  constructor(private apollo: Apollo, private route: ActivatedRoute, private surveyService: SurveyService) {
  }

  ngOnInit() {
    const routeParams = this.route.snapshot.paramMap;
    const uuid = routeParams.get("uuid")
    if (uuid) {
      this.surveyService.retrieveTemplateByUuid(uuid)
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
              let multipleOptionAnswer = new Answer();
              multipleOptionAnswer.questionId = question.questionId;
              multipleOptionAnswer.questionType = moq.type
              multipleOptionAnswer.answerData = new AnswerData()
              multipleOptionAnswer.answerData.answerIdx = moq.answerOptions.findIndex(value => value === this.userResponses[sectionIdx][questionIdx])
              survey.answers.push(multipleOptionAnswer)
              // console.log(`selector "#${section.sectionId}_${question.questionId}_${optionIdx}"`)
            }
          } else {
            if (question.type == 'DATE') {
              let dateQuestion = new Answer()
              dateQuestion.questionType = question.type
              dateQuestion.questionId = question.questionId
              dateQuestion.answerData = new AnswerData()
              dateQuestion.answerData.theDate = new Date(this.userResponses[sectionIdx][questionIdx]).toLocaleDateString('es-MX', {
                year: '2-digit',
                month: '2-digit',
                day: '2-digit'
              })
              survey.answers.push(dateQuestion)
            } else if (question.type == 'OPEN') { //OPEN
              let openQuestionAnswer = new Answer()
              openQuestionAnswer.questionType = question.type
              openQuestionAnswer.questionId = question.questionId
              openQuestionAnswer.answerData = new AnswerData()
              openQuestionAnswer.answerData.answer = this.userResponses[sectionIdx][questionIdx]
              survey.answers.push(openQuestionAnswer)
            } else {
              let moq = question as MultipleOptionQuestion
              let multipleOptionAnswer = new Answer();
              multipleOptionAnswer.questionId = question.questionId;
              multipleOptionAnswer.questionType = moq.type
              multipleOptionAnswer.answerData = new AnswerData()
              multipleOptionAnswer.answerData.answerIdx = moq.answerOptions.findIndex(value => value === this.userResponses[sectionIdx][questionIdx])
              survey.answers.push(multipleOptionAnswer)
              // console.log(`selector "#${section.sectionId}_${question.questionId}_${optionIdx}"`)
            }

          }
        }
      }
      console.log(`sending answers: ${JSON.stringify(survey)}`)
      this.surveyService.saveSurvey({survey})
        .subscribe(({data}) => {
          // @ts-ignore
          console.log(`saved:${JSON.stringify(data)}`)
        }, (err) => console.error(err))

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
