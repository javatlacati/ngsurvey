import {Component, OnInit} from '@angular/core';
import {Apollo, gql} from "apollo-angular";
import {Survey} from "../../model/Survey";
import {SurveyTemplate} from "../../model/SurveyTemplate";

@Component({
  selector: 'survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit{
  items: SurveyTemplate[] = [];
  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.apollo
      .query({
        query: gql`

          {
            sayHello
            templates {
              sections {
                sectionId
                name
                questions {
                  statement
                  required
                  questionId
                  type: questionType
                  openQuestion {
                    answer
                  }
                  dateQuestion {
                    date
                  }
                  multipleOptionQuestion {
                    answerOptions
                    answerIdx
                  }
                }
              }
            }
          }

        `,
      })
      .subscribe(({ data }) => {
        // @ts-ignore
        this.items = data.templates;
      });
  }
}
