# react-router-test-context

Create a pseudo `context` object that duplicates React Router's `context.router` structure. This is useful for shallow unit testing with Enzyme.

**Note:** This package only works with React Router v4.

### Installation

```
npm install --save-dev react-router-test-context
```

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

### enzyme

There are a few things that you should be aware of if you plan to use `react-router-test-context` with `enzyme` to test your location-aware components.

#### `mount`

If your root component is not a native React Router component (`<Switch>`, `<Route>`), you may run into issues with unfound context properties. To deal with this, you have two options.

1. Define a `contextTypes` on the root component.

```js
import MyComponent from '../component/MyComponent'

describe('my component', () => {

  // ADD THIS
  MyComponent.contextTypes = {
    router: React.PropTypes.object
  }

  it('renders', () => {
    const context = createRouterContext()
    const wrapper = mount(<MyComponent />, { context })
    // ...
  })
}
```

2. Pass a `childContextTypes` object to enzyme via the `options` object.

```js
describe('my component', () => {
  // ...
  
  it('renders', () => {
    const context = createRouterContext()
    const childContextTypes = {
      router: React.PropTypes.object
    }
    cosnt wrapper = mount(<MyComponent />, { context, childContextTypes })
    // ...
})
```

#### Limitations of `shallow` Renders

If you are using this to test that a `<Switch>` is matching as expected, a shallow render will probably not work as expected.

For example, if you were to do the following shallow render, the `wrapper` node would be a `<Route>`. This _could_ work to verify that you rendered the correct `<Route>` by checking that the path of the returned node is the path that you expect to be matched.

```js
const context = createRouterContext({ location: { pathname: '/two' }})
const wrapper = shallow((
  <Switch>
    <Route path='/one' component={One}/>
    <Route path='/two' component={Two}/>
  </Switch>
), { context })
const props = wrapper.props()
expect(props.path).toBe('/two')
```

This breaks down, however, if you attempt to do this on a component that contains a `<Switch>`.

```js
const Switcheroo = () => (
  <Switch>
    <Route path='/one' component={One}/>
    <Route path='/two' component={Two}/>
  </Switch>
)

const wrapper = shallow(<Switcheroo />, { context })
```

The `wrapper` node returned by shallow rendering the `<Switcheroo />` will be a `<Switch>`. The `<Switch>` will not have rendered, so we are unable to derive any relevant route matching information from the shallow render.

In cases like this, you will just need to do a full mount if you want to verify that the component renders the correct child component.

```js
const context = createRouterContext({ location: { pathname: '/two' }})
const wrapper = mount((
  <Switch>
    <Route path='/one' component={One}/>
    <Route path='/two' component={Two}/>
  </Switch>
), { context })

expect(wrapper.find(Two).exists()).toBe(true)
```
