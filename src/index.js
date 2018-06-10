
export const BREAK_FIBER_MERGE = 'BREAK_FIBER_MERGE'

export default function (...initialFibers) {
  const queues = [[], [], [], []]

  function* worker(...args) {
    let result
    try {
      for (let i = 0; i < 3; i += 1) {
        for (let j = 0; j < queues[i].length; j += 1) {
          result = yield* queues[i][j](...args, result)
          if (result === BREAK_FIBER_MERGE) return
        }
      }
    } catch (exception) {
      for (let i = 0; i < queues[3].length; i += 1) {
        result = yield* queues[3][i](exception, ...args, result)
        if (result === BREAK_FIBER_MERGE) return
      }
    }
  }

  function makeAddFiber(type) {
    return function addFiber(generator) {
      queues[type].push(generator)
      return worker
    }
  }

  function mergeFibers(...fibers) {
    fibers.forEach(function (fiber) {
      queues[0].concat(fiber._queues[0])
      queues[1].concat(fiber._queues[1])
      queues[2].concat(fiber._queues[2])
      queues[3].concat(fiber._queues[3])
    })
  }

  function merge(...fibers) {
    mergeFibers(...fibers)
    return worker
  }

  merge(...initialFibers)

  worker._queues = queues
  worker.before = makeAddFiber(0)
  worker.step = makeAddFiber(1)
  worker.after = makeAddFiber(2)
  worker.catch = makeAddFiber(3)
  worker.merge = merge
  return worker
}
