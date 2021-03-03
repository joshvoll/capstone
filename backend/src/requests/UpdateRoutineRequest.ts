/**
 * Fields in a request to update a single TODO item.
 */
export interface UpdateRoutineRequest {
  name: string
  dueDate: string
  done: boolean
}
