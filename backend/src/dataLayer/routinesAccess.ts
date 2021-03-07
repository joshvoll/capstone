import { RoutineItem } from '../models/RoutineItem';
import { CreateRoutineRequest } from '../requests/CreateRoutineRequest';
import { UpdateRoutineRequest } from '../requests/UpdateRoutineRequest';
import { createLogger } from '../log/log'
const uuid = require('uuid/v4')
import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('routinesDataAccess');


export class RoutinesAccess{
    constructor(
        private readonly docClient: AWS.DynamoDB.DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly routinesTable = process.env.ROUTINE_TABLE,
        private readonly userIdIndex = process.env.USER_ID_INDEX
    ){}
    // get all routines from users
    async getUserRoutines(userId: string): Promise<RoutineItem[]>{
        const result = await this.docClient.query({
            TableName: this.routinesTable,
            IndexName: this.userIdIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues:{
                ':userId':userId
            }
        }).promise()
        return result.Items as RoutineItem[]
    }
    // createRoutine from users
    async createRoutine(request: CreateRoutineRequest,userId: string): Promise<RoutineItem>{
        const newId = uuid()
        const item = new RoutineItem()
        item.userId= userId
        item.routineId= newId
        item.createdAt= new Date().toISOString()
        item.name= request.name
        item.dueDate= request.dueDate
        item.done= false
  
        await this.docClient.put({
            TableName: this.routinesTable,
            Item: item
        }).promise()

        return item
    }
    // updateRoutine from user
    async updateRoutine(updatedRoutine:UpdateRoutineRequest,routineId:string, userId:string){
	logger.info(`Updating a todo routineid = ${routineId} `);
	logger.info(`Updating a todo user = ${userId} `);
        await this.docClient.update({
            TableName: this.routinesTable,
            Key:{
                routineId: routineId,
		userId: userId
            },
            UpdateExpression: 'set #namefield = :n, dueDate = :d, done = :done',
            ExpressionAttributeValues: {
                ':n' : updatedRoutine.name,
                ':d' : updatedRoutine.dueDate,
                ':done' : updatedRoutine.done
            },
            ExpressionAttributeNames:{
                "#namefield": "name"
              }
          }).promise()
    }    
    // deleteRoutine from user
    async deleteRoutine(userId:string, routineId:string) {
       await this.docClient.delete({
            TableName: this.routinesTable,
            Key: {
	       userId: userId,
               routineId: routineId
            }
       }).promise()
    }
}
