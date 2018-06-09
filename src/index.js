
export const BREAK_FIBER_CHAIN = 'BREAK_FIBER_CHAIN'

export default function (...initialFibers) {
  const queues = initialFibers.reduce((acc, initialFiber) => [
    acc[0].concat(initialFiber._queues[0]),
    acc[1].concat(initialFiber._queues[1]),
    acc[2].concat(initialFiber._queues[2]),
    acc[3].concat(initialFiber._queues[3]),
  ], [
    [],
    [],
    [],
    [],
  ])

  function* worker(...args) {
    let result
    try {
      for (let i = 0; i < 3; i += 1) {
        for (let j = 0; j < queues[i].length; j += 1) {
          result = yield* queues[i][j](...args, result)
          if (result === BREAK_FIBER_CHAIN) return
        }
      }
    } catch (exception) {
      for (let i = 0; i < queues[3].length; i += 1) {
        result = yield* queues[3][i](...args, result)
        if (result === BREAK_FIBER_CHAIN) return
      }
    }
  }

  function makeAddFiber(type) {
    return function addFiber(generator) {
      queues[type].push(generator)
      return worker
    }
  }

  function chain(fiber) {
    queues[0] = queues[0].concat(fiber._queue[0])
    queues[1] = queues[1].concat(fiber._queue[1])
    queues[2] = queues[2].concat(fiber._queue[2])
    queues[3] = queues[3].concat(fiber._queue[3])
    return worker
  }

  worker._queues = queues
  worker.before = makeAddFiber(0)
  worker.step = makeAddFiber(1)
  worker.after = makeAddFiber(2)
  worker.catch = makeAddFiber(3)
  worker.chain = chain
  return worker
}
