import createContext from '../index'

describe('createContext', () => {
  it('returns an object with a "router" property', () => {
    const ctx = createContext()
    expect(ctx).toHaveProperty('router')
  })

  describe('context.router', () => {
    it('has expected properties', () => {
      const ctx = createContext()
      expect(ctx.router).toHaveProperty('history')
      expect(ctx.router).toHaveProperty('route')
      expect(ctx.router).toHaveProperty('staticContext')
      // context.router.route
      expect(ctx.router.route).toHaveProperty('match')
      expect(ctx.router.route).toHaveProperty('location')
    })

    describe('match', () => {
      it('is default object if not provided', () => {
        const ctx = createContext()
        const { match } = ctx.router.route
        expect(match).toEqual({
          path: '/',
          url: '/',
          isExact: true,
          params: {}
        })
      })

      it('is provided object', () => {
        const match = {
          path: '/:number',
          url: '/8',
          isExact: true,
          params: { number: '8' }
        }
        const ctx = createContext({ match })
        expect(ctx.router.route.match).toEqual(match)
      })

      it('merges partially provided match object', () => {
        const partialMatch = { isExact: false }
        const ctx = createContext({ match: partialMatch })
        const { match } = ctx.router.route
        expect(match).toEqual({
          path: '/',
          url: '/',
          isExact: false,
          params: {}
        })
      })
    })

    describe('location', () => {
      it('is default object if not provided', () => {
        const ctx = createContext()
        const { location } = ctx.router.route
        expect(location.pathname).toBe('/')
        expect(location.search).toBe('')
        expect(location.hash).toBe('')
        expect(typeof location.key).toBe('string')
        expect(location.key.length).toBe(6)
      })

      it('is provided object', () => {
        const location = {
          pathname: '/some-place',
          search: '?test=value',
          hash: '#hash',
          key: 'okdoke'
        }
        const ctx = createContext({ location })
        expect(ctx.router.route.location).toEqual(location)
      })

      it('merges partially provided location object', () => {
        const partialLocation = { pathname: '/somewhere' }
        const ctx = createContext({ location: partialLocation })
        const { location } = ctx.router.route
        expect(location.pathname).toBe('/somewhere')
        expect(location.search).toBe('')
        expect(location.hash).toBe('')
      })
    })

    describe('history', () => {
      it('is default object if not provided', () => {
        const properties = {
          action: 'string',
          location: 'object',
          listen: 'function',
          push: 'function',
          replace: 'function',
          createHref: 'function'
        }
        const ctx = createContext()
        const { history } = ctx.router
        Object.keys(properties).forEach(key => {
          expect(history).toHaveProperty(key)
          expect(typeof history[key]).toBe(properties[key])
        })
      })

      it('uses location option if provided', () => {
        const location = { pathname: '/in-history' }
        const ctx = createContext({ location })
        const { history } = ctx.router
        expect(history.location.pathname).toBe(location.pathname)
      })

      it('is provided object', () => {
        const fakeHistory = {
          action: 'FAKE_ACTION',
          location: {},
          listen: () => {},
          push: () => {},
          replace: () => {},
          createHref: () => {}
        }
        const ctx = createContext({ history: fakeHistory })
        const { history } = ctx.router
        Object.keys(fakeHistory).forEach(key => {
          expect(history[key]).toEqual(fakeHistory[key])
        })
      })

      it('merges partially provided history object', () => {
        const partialHistory = {
          action: 'FAKE_ACTION'
        }
        const ctx = createContext({ history: partialHistory })
        const { history } = ctx.router

        // verify that the partial property is present
        expect(history.action).toEqual(partialHistory.action)
        // and that the default properties exist
        const properties = [ 'action', 'location', 'listen', 'push', 'replace', 'createHref' ]
        properties.forEach(p => {
          expect(history).toHaveProperty(p)
        })
      })

    })

    describe('staticContext', () => {
      it('is undefined if not provided as an option', () => {
        const ctx = createContext()
        expect(ctx.router.staticContext).toBe(undefined)
      })

      it('is the provided value', () => {
        const staticContext = {}
        const ctx = createContext({ staticContext })
        expect(ctx.router.staticContext).toBe(staticContext)
      })
    })

    
  })
})