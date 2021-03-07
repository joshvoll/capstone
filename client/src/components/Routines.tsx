import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createRoutine, deleteRoutine, getRoutines, patchRoutine } from '../api/routines-api'
import Auth from '../auth/Auth'
import { Routine } from '../types/Routine'

interface RoutinesProps {
  auth: Auth
  history: History
}

interface RoutinesState {
  routines: Routine[]
  newRoutineName: string
  loadingRoutines: boolean
}

export class Routines extends React.PureComponent<RoutinesProps, RoutinesState> {
  state: RoutinesState = {
    routines: [],
    newRoutineName: '',
    loadingRoutines: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newRoutineName: event.target.value })
  }

  onEditButtonClick = (routineId: string) => {
    this.props.history.push(`/routines/${routineId}/edit`)
  }

  onRoutineCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newRoutine = await createRoutine(this.props.auth.getIdToken(), {
        name: this.state.newRoutineName,
        dueDate
      })
      this.setState({
        routines: [...this.state.routines, newRoutine],
        newRoutineName: ''
      })
    } catch {
      alert('Routine creation failed')
    }
  }

  onRoutineDelete = async (routineId: string) => {
    try {
      await deleteRoutine(this.props.auth.getIdToken(), routineId)
      this.setState({
        routines: this.state.routines.filter(routine => routine.routineId != routineId)
      })
    } catch {
      alert('Routine deletion failed')
    }
  }

  onRoutineCheck = async (pos: number) => {
    try {
      const routine = this.state.routines[pos]
      await patchRoutine(this.props.auth.getIdToken(), routine.routineId, {
        name: routine.name,
        dueDate: routine.dueDate,
        done: !routine.done
      })
      this.setState({
        routines: update(this.state.routines, {
          [pos]: { done: { $set: !routine.done } }
        })
      })
    } catch {
      alert('Routine deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const routines = await getRoutines(this.props.auth.getIdToken())
      this.setState({
        routines,
        loadingRoutines: false
      })
    } catch (e) {
      alert(`Failed to fetch routines: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Routines</Header>

        {this.renderCreateRoutineInput()}

        {this.renderRoutines()}
      </div>
    )
  }

  renderCreateRoutineInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New task',
              onClick: this.onRoutineCreate
            }}
            fluid
            actionPosition="left"
            placeholder="To change the world..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderRoutines() {
    if (this.state.loadingRoutines) {
      return this.renderLoading()
    }

    return this.renderRoutinesList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Routines
        </Loader>
      </Grid.Row>
    )
  }

  renderRoutinesList() {
    return (
      <Grid padded>
        {this.state.routines.map((routine, pos) => {
          return (
            <Grid.Row key={routine.routineId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onRoutineCheck(pos)}
                  checked={routine.done}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {routine.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {routine.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(routine.routineId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onRoutineDelete(routine.routineId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {routine.attachmentUrl && (
                <Image src={routine.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
