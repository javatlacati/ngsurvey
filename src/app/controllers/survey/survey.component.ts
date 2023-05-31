import {Component, OnInit} from '@angular/core';
import {Apollo, gql} from "apollo-angular";
import {Survey} from "../../model/Survey";
import {SurveyTemplate} from "../../model/SurveyTemplate";
import {NgForm} from '@angular/forms';
import {ActivatedRoute} from "@angular/router";
import {Question} from "../../model/Question";
import {MultipleOptionQuestion} from "../../model/MultipleOptionQuestion";

@Component({
  selector: 'survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit {
  item: SurveyTemplate | null = null;
  expandedSectionIndex = 0;

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
    });
  }

  guardarEncuesta(forma: NgForm) {
    console.log(forma)
  }

  getOptions(question: Question): string[] {
    console.log(`type: ${question.type}`)
    if (question.type == 'MULTIPLE_OPTION') {
      return (question as MultipleOptionQuestion).answerOptions
    } else {
      return []
    }
  }
}
