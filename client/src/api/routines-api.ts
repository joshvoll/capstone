import { apiEndpoint } from '../config'
import { Routine } from '../types/Routine';
import { CreateRoutineRequest } from '../types/CreateRoutineRequest';
import Axios from 'axios'
import { UpdateRoutineRequest } from '../types/UpdateRoutineRequest';

export async function getRoutines(idToken: string): Promise<Routine[]> {
  console.log('Fetching routine')

  const response = await Axios.get(`${apiEndpoint}/routines`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Routines:', response.data.items)
  return response.data.items
}

export async function createRoutine(
  idToken: string,
  newRoutine: CreateRoutineRequest
): Promise<Routine> {
  const response = await Axios.post(`${apiEndpoint}/routines`,  JSON.stringify(newRoutine), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchRoutine(
  idToken: string,
  routineId: string,
  updatedRoutine: UpdateRoutineRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/routines/${routineId}`, JSON.stringify(updatedRoutine), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteRoutine(
  idToken: string,
  routineId: string
): Promise<void> {
  console.log("TOOKEN ID = ", idToken)
  console.log("ROUTINE ID = ", routineId)
  console.log("Endpoint = ", apiEndpoint+"/"+routineId)
  await Axios.delete(`${apiEndpoint}/routines/${routineId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  routineId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/routines/${routineId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
