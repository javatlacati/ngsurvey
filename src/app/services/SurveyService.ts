import {Injectable} from "@angular/core";
import {Apollo, gql} from "apollo-angular";
import {Survey} from "../model/Survey";

@Injectable({providedIn: "root"})
export class SurveyService {

  constructor(private apollo: Apollo) {
  }

  retrieveTemplateByUuid(uuid: string | null) {
    return this.apollo
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
  }

  saveSurvey(variables: { survey: Survey }) {
    return this.apollo.mutate(
      {
        mutation: gql`
            mutation SaveNewSurvey($survey:SurveyInput!){
                saveNewSurvey(
                    survey: $survey
                )  {
                    surveyId
                    templateId
                    answers {
                        id
                        questionId
                        questionType
                        answerData {
                            answer
                            answerIdx
                            theDate
                        }
                    }
                }
            }`,
        variables: variables
      }
    )
  }
}
