import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId} from '../../helpers/authHelper'
// import * as AWS from 'aws-sdk'
import { deleteRoutine  } from '../../businessLogic/routines'
import 'source-map-support/register'

// const docClient = new AWS.DynamoDB.DocumentClient()

// const todosTable = process.env.TODO_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const authHeader = event.headers['Authorization']
    const userId = getUserId(authHeader)
    const routineId = event.pathParameters.routineId

    /*
    await docClient.delete({
        TableName: todosTable,
        Key: {
	    userId: userId,
            todoId: todoId
        }
    }).promise()
    */
    await deleteRoutine(userId, routineId)

    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: 'Item removed'
    }
}
