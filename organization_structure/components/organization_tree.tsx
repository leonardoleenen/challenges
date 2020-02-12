/* eslint-disable import/extensions */
import * as React from 'react'
import { orderHierarchically } from '../services'

interface Props {
   structure : Map<number, Employee>,
   layout: string
}
export default (prop : Props) => {
  const { structure, layout } = prop

  const renderOrganization = (organizationStructure : Map<number, Employee>) => {
    const row = []
    organizationStructure.forEach((e:Employee, k:number) => {
      row.push(
        <div className="p-4 w-auto m-2 border" key={e.id}>
          <span className="font-thin">{`${e.first} ${e.last}`}</span>
          <div className={layout === 'VERTICAL' ? 'flex-cols' : 'flex'}>{renderOrganization(e.childrens)}</div>
        </div>,
      )
    })
    return row
  }

  return (
    <div id="organizationTree">
      {renderOrganization(orderHierarchically(structure))}
    </div>
  )
}
