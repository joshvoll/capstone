import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId} from '../../helpers/authHelper'
import * as AWS from 'aws-sdk'
import 'source-map-support/register'


const docClient = new AWS.DynamoDB.DocumentClient()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const authHeader = event.headers['Authorization']
    const userId = getUserId(authHeader)
    const routineId = event.pathParameters.routineId
    const signedUrlExpireSeconds = 60 * 5

    console.log("ROUT?INE ID = ", routineId)
    const bucket = process.env.IMAGES_BUCKET
    const routinesTable = process.env.ROUTINE_TABLE

    // const imageId = uuid.v4()

    const s3 = new AWS.S3({
        signatureVersion: 'v4'
    })

    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id

    const url = s3.getSignedUrl('putObject', {
        Bucket: bucket,
        Key: `${routineId}.png`,
        Expires: signedUrlExpireSeconds
    })

    const imageUrl = `https://${bucket}.s3.amazonaws.com/${routineId}.png`
    console.log("IMAGEL URL = ", imageUrl)

    const updateUrlOnRoutine = {
        TableName: routinesTable,
        Key: { 
		"routineId": routineId ,
		"userId": userId
	},
        UpdateExpression: "set attachmentUrl = :a",
        ExpressionAttributeValues: {
            ":a": imageUrl
        },
        ReturnValues: "UPDATED_NEW"
    }

    await docClient.update(updateUrlOnRoutine).promise()

    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            iamgeUrl: imageUrl,
            uploadUrl: url
        })
    }
}
