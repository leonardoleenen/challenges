type Employee = {
    first: string
    last: string
    id: number
    manager: number
    parent: Employee
    childrens: Map<number, Employee>
    department: number
    office: number
}
