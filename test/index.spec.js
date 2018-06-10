const createFiber = require('../src').default

describe('createFiber', () => {
  it('return a function (fiber)', () => {
    const fiber = createFiber()
    expect(typeof fiber).toBe('function')
  })
})

describe('fiber', () => {
  it('fiber return an object (Generator)', () => {
    const fiber = createFiber()
    const generator = fiber()
    expect(typeof generator).toBe('object')
  })
  it('generator has next function property', () => {
    const fiber = createFiber()
    const generator = fiber()
    expect(typeof generator.next).toBe('function')
  })
  it('next return an object with value and done properties', () => {
    const fiber = createFiber()
    const generator = fiber()
    const result = generator.next()
    expect(Object.prototype.hasOwnProperty.call(result, 'value')).toBe(true)
    expect(Object.prototype.hasOwnProperty.call(result, 'done')).toBe(true)
  })
  it('generator has next function property', () => {
    const fiber = createFiber()
    const generator = fiber()
    expect(typeof generator.next).toBe('function')
  })
  it('next return an object with value and done properties', () => {
    const fiber = createFiber()
    const generator = fiber()
    const result = generator.next()
    expect(Object.prototype.hasOwnProperty.call(result, 'value')).toBe(true)
    expect(Object.prototype.hasOwnProperty.call(result, 'done')).toBe(true)
  })
  it('fiber has all the mergeing properties (before, step, after, catch, merge)', () => {
    const fiber = createFiber()
    expect(Object.prototype.hasOwnProperty.call(fiber, 'before')).toBe(true)
    expect(Object.prototype.hasOwnProperty.call(fiber, 'step')).toBe(true)
    expect(Object.prototype.hasOwnProperty.call(fiber, 'after')).toBe(true)
    expect(Object.prototype.hasOwnProperty.call(fiber, 'catch')).toBe(true)
    expect(Object.prototype.hasOwnProperty.call(fiber, 'merge')).toBe(true)
  })
  it('fiber before property return the fiber', () => {
    const fiber = createFiber()
    expect(fiber.before()).toBe(fiber)
  })
  it('fiber step property return the fiber', () => {
    const fiber = createFiber()
    expect(fiber.step()).toBe(fiber)
  })
  it('fiber after property return the fiber', () => {
    const fiber = createFiber()
    expect(fiber.after()).toBe(fiber)
  })
  it('fiber catch property return the fiber', () => {
    const fiber = createFiber()
    expect(fiber.catch()).toBe(fiber)
  })
  it('fiber merge property return the fiber', () => {
    const fiber = createFiber()
    expect(fiber.merge()).toBe(fiber)
  })
})