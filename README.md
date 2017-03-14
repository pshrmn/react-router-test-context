# react-router-test-context

Create a pseudo `context` object that duplicates React Router's `context.router` structure. This is useful for shallow unit testing with Enzyme.

### Usage

```js
import createRouterContext from 'react-router-test-context'
import { shallow } from 'enzyme'

describe('my test', () => {
  it('renders', () => {
    const context = createRouterContext()
    const wrapper = shallow(<MyComponent />, { context })
    // ...
  })
})
```
