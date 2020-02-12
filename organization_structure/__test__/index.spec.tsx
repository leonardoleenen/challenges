/* eslint-disable import/extensions */
import * as React from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import { mount } from 'enzyme'
// eslint-disable-next-line import/extensions
import IndexPage from '../pages/index'

// eslint-disable-next-line import/extensions
import Loading from '../components/loading'

import OrganizationTree from '../components/organization_tree'

// eslint-disable-next-line import/extensions
import { fetchEmployees, arrayToMap } from '../services'

describe('Pages', () => {
  describe('Index', () => {
    it('should render without throwing an error', () => {
      const wrap = mount(<IndexPage />)
      // expect(wrap.find('div').text()).toBe('Hello Next.js')
      expect(true).toBe(true)
    })

    it('Render Loading component with no error', () => {
      const wrap = mount(<Loading />)
      expect(wrap.find('svg')).not.toBeNull()
    })

    it('Render Organization Structure Tree whitout error', async () => {
      const employees : Array<Employee> = await fetchEmployees(5, 20)
      const wrap = mount(<OrganizationTree layout="VERTICAL" structure={arrayToMap(employees)} />)
      expect(wrap.find('#organizationTree')).not.toBeNull()
    })
  })
})
