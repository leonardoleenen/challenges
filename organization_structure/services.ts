import axios from 'axios'
import _ from 'underscore'

const URL = 'https://2jdg5klzl0.execute-api.us-west-1.amazonaws.com/default/EmployeesChart-Api'
axios.defaults.adapter = require('axios/lib/adapters/http')


export const orderHierarchically = (employeesMap: Map<number, Employee>) : Map<number, Employee> => {
  const toRemove : Array<Employee> = []
  employeesMap.forEach((employee: Employee) => {
    if (employee.parent) {
      if (employeesMap.get(employee.parent.id)) {
        employeesMap.get(employee.parent.id).childrens.set(employee.id, employee)
      }
      toRemove.push(employee)
    }
  })
  toRemove.forEach((e: Employee) => {
    if (e.manager !== 0) { employeesMap.delete(e.id) }
  })
  return employeesMap
}

export const arrayToMap = (list: Array<Employee>) : Map<number, Employee> => {
  const transformedList = new Map()
  list.forEach((e: Employee) => {
    transformedList.set(e.id, e)
  })
  return transformedList
}

export const fill = (employees: Array<Employee>) : Promise<Array<Employee>> => axios
  .get(`${URL}?id=${employees.map((e:Employee) => e.manager).join('&id=')}`)
  .then((result) => {
    const managers : Array<Employee> = result.data
    const employeesFilled = employees.map((e:Employee) => {
      const manager = managers.filter((m: Employee) => e.manager === m.id)
      e.parent = { ...manager[0] }
      e.childrens = new Map()
      return e
    })

    return employeesFilled.concat(managers.map((m: Employee) => {
      let parent : Employee = employees.filter((e: Employee) => m.manager === e.id)[0]
      if (!parent) {
        parent = managers.filter((p: Employee) => p.id === m.manager)[0] as Employee
      }
      // eslint-disable-next-line no-param-reassign
      m.childrens = new Map()

      // eslint-disable-next-line no-param-reassign
      m.parent = parent
      return m
    }))
  })

export const fetchEmployees = (offset: number, limit: number) : Promise<Array<Employee>> => axios
  .get(`${URL}?offset=${offset}&limit=${limit}`)
  .then((employees) => fill(employees.data as Array<Employee>))
