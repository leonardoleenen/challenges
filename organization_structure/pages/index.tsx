/* eslint-disable import/extensions */
import * as React from 'react'
import { useEffect, useState } from 'react'
import Loading from '../components/loading'
import { fetchEmployees, orderHierarchically, arrayToMap } from '../services'
import OrganizationStructure from '../components/organization_tree'

enum LAYOUT {
  VERTICAL = 'VERTICAL',
  HORIZONTAL = 'HORIZONTAL'
}

interface NavigationCache {
  offset: number
  limit: number
  employees: Array<Employee>
}

const styleButtonUnPressed = 'rounded-lg border p-4'
const styleButtonPressed = 'rounded-lg bg-teal-500 p-4 text-white'

export default () => {
  const [isLoading, setIsLoading] = useState(false)
  const [offset, setOffSet] = useState<number>(5)
  const [limit, setLimit] = useState<number>(10)
  const [navEntry, setNavEntry] = useState<NavigationCache>(null)
  const [navCache, setNavCache] = useState<Array<NavigationCache>>([])
  const [layout, setLayout] = useState<LAYOUT>(LAYOUT.VERTICAL)

  useEffect(() => {
    const fetchData = async () => {
      const employees : Array<Employee> = await fetchEmployees(offset, limit)
      navCache.push({
        offset,
        limit,
        employees: await (employees),
      })
      setNavCache(navCache)
      setNavEntry({
        offset,
        limit,
        employees,
      })
    }
    fetchData()
  }, [])

  const search = () => {
    setIsLoading(true)

    const oldNavEntry : NavigationCache = navCache.filter((entry: NavigationCache) => entry.limit === limit && entry.offset === offset)[0]

    if (oldNavEntry) {
      setNavEntry(oldNavEntry)
      setIsLoading(false)
      return
    }

    fetchEmployees(offset, limit).then((employees: Array<Employee>) => {
      navCache.push({
        offset,
        limit,
        employees,
      })
      setNavCache(navCache)
      setNavEntry({
        offset,
        limit,
        employees,
      })
      setIsLoading(false)
    })
  }


  if (isLoading || !navEntry) return <Loading />

  const renderOrganization = (structure : Map<number, Employee>) => {
    const row = []
    structure.forEach((e:Employee, k:number) => {
      row.push(
        <div className="p-4 w-auto m-2 border" key={e.id}>
          <span className="font-thin">{`${e.first} ${e.last}`}</span>
          <div className={layout === LAYOUT.VERTICAL ? 'flex-cols' : 'flex'}>{renderOrganization(e.childrens)}</div>
        </div>,
      )
    })
    return row
  }


  return (
    <div className=" flex p-4">
      <aside>
        <div className="flex-cols">
          <div className="flex mt-8">
            <button className={`${layout === LAYOUT.VERTICAL ? styleButtonPressed : styleButtonUnPressed}`} type="button" onClick={() => setLayout(LAYOUT.VERTICAL)}>Vertical</button>
            <button className={`${layout === LAYOUT.HORIZONTAL ? styleButtonPressed : styleButtonUnPressed} ml-2`} onClick={() => setLayout(LAYOUT.HORIZONTAL)} type="button">Horizontal</button>
          </div>
          <div>
            <div className="flex mt-8">
              <div>
                <div> Offset</div>
                <input
                  onChange={(e) => setOffSet(parseInt(e.target.value || '0', 10))}
                  type="number"
                  value={offset}
                  className="appearance-none border-2 border-gray-200 rounded p-2 w-16"
                  name="offset"
                />
              </div>
              <div className="ml-4">
                <div> Limit</div>
                <input
                  onChange={(e) => setLimit(parseInt(e.target.value || '0', 10))}
                  type="number"
                  value={limit}
                  className="appearance-none border-2 border-gray-200 rounded p-2 w-16"
                  name="limit"
                />
              </div>
            </div>
            <button
              onClick={() => search()}
              className="appearance-none p-2 bg-blue-500 text-white font-semibold mt-2 rounded-lg"
              type="button"
            >
              Search
            </button>
          </div>
        </div>
      </aside>
      <article className="px-4">
        <header className="m-4 text-2xl font-semibold">
          Organization Structure
        </header>
        <div>
          <OrganizationStructure
            layout={layout}
            structure={arrayToMap(navEntry.employees)}
          />

        </div>
      </article>
    </div>
  )
}
