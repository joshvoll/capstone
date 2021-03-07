import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId} from '../../helpers/authHelper'
import { UpdateRoutineRequest } from '../../requests/UpdateRoutineRequest'
//import { TodosAccess } from '../../dataLayer/todosAccess'
import { updateRoutine } from '../../businessLogic/routines'
import { ApiResponseHelper } from '../../helpers/apiResponseHelper'
import { createLogger } from '../../log/log'

const logger = createLogger('routines')
//const todosAccess = new TodosAccess()
const apiResponseHelper = new ApiResponseHelper()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const routineId = event.pathParameters.routineId
    const updatedRoutine: UpdateRoutineRequest = JSON.parse(event.body)
    const authHeader = event.headers['Authorization']
    const userId = getUserId(authHeader)

    
    logger.info(`UPDATE ROUTINE ${userId}`) 
    /* 
    const item = await todosAccess.getTodoById(todoId)
  
    if(item.Count == 0){
        logger.error(`user ${userId} requesting update for non exists todo with id ${todoId}`)
        return apiResponseHelper.generateErrorResponse(400,'TODO not exists')
    } 

    if(item.Items[0].userId !== userId){
        logger.error(`user ${userId} requesting update todo does not belong to his account with id ${todoId}`)
        return apiResponseHelper.generateErrorResponse(400,'TODO does not belong to authorized user')
    }
    */


    logger.info(`User ${userId} updating group ${routineId} to be ${updatedRoutine}`)
    // await new TodosAccess().updateTodo(updatedTodo,todoId, userId)
    await updateRoutine(updatedRoutine, routineId, userId)
    logger.info(`after sending the function to update`)
    return apiResponseHelper.generateEmptySuccessResponse(204)
  
}
