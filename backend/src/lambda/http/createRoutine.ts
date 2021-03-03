import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateRoutineRequest } from '../../requests/CreateRoutineRequest'
import { getUserId} from '../../helpers/authHelper'
// import { RoutinesAccess } from '../../dataLayer/routinesAccess'
import { createRoutine } from '../../businessLogic/routines'
import { ApiResponseHelper } from '../../helpers/apiResponseHelper'
import { createLogger } from '../../log/log'

const logger = createLogger('routines')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
    const newRoutine: CreateRoutineRequest = JSON.parse(event.body)
    
    const authHeader = event.headers['Authorization']
    const userId = getUserId(authHeader)
    logger.info(`create group for user ${userId} with data ${newRoutine}`)
    const item = await createRoutine(newRoutine,userId)
    
    return new ApiResponseHelper().generateDataSuccessResponse(201,'item',item)

}
