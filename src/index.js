
export const BREAK_FIBER_CHAIN = 'BREAK_FIBER_CHAIN'

export default (...initialFibers) => {
  const queue = initialFibers.reduce((acc, initialFiber) => [
    [...acc[0], ...initialFiber._queue[0]],
    [...acc[1], ...initialFiber._queue[1]],
    [...acc[2], ...initialFiber._queue[2]],
    [...acc[3], ...initialFiber._queue[3]],
  ], [
    [],
    [],
    [],
    [],
  ])

  function* worker(...args) {
    let result
    try {
      for (const beforeFiber of queue[0]) {
        result = yield* beforeFiber(...args, result)
        if (result === BREAK_FIBER_CHAIN) return
      }
      for (const stepFiber of queue[1]) {
        result = yield* stepFiber(...args, result)
        if (result === BREAK_FIBER_CHAIN) return
      }
      for (const afterFiber of queue[2]) {
        result = yield* afterFiber(...args, result)
        if (result === BREAK_FIBER_CHAIN) return
      }
    } catch (exception) {
      for (const catchFiber of queue[3]) {
        result = yield* catchFiber(exception, ...args, result)
        if (result === BREAK_FIBER_CHAIN) return
      }
    }
  }

  const addFiber = type => (generator) => {
    queue[type].push(generator)
    return worker
  }

  worker._queue = queue
  worker.before = addFiber(0)
  worker.step = addFiber(1)
  worker.after = addFiber(2)
  worker.catch = addFiber(3)
  return worker
}
