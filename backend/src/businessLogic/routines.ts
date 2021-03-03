// import * as uuid from 'uuid'
import { RoutineItem } from '../models/routineItem'
import { RoutinesAccess } from '../dataLayer/routinesAccess'
import { CreateRoutineRequest } from '../requests/CreateRoutineRequest'
// import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { createLogger } from '../utils/logger'

//const logger = createLogger('auth')

const routinesAccess = new RoutinesAccess()

// const bucketName = process.env.IMAGES_BUCKET


export async function getRoutines(userId: string): Promise<RoutineItem[]> {
  return await routinesAccess.getUserRoutines(userId)
}

// createRoutine interface method
export async function createRoutine(createRoutineRequest: CreateRoutineRequest,userId: string): Promise<RoutineItem> {
	return await routinesAccess.createRoutine(createRoutineRequest, userId)
}


// deleteRoutine interface method
export async function deleteRoutine(userId:string, routineId:string) {
	return await routinesAccess.deleteRoutine(userId, routineId)
}

