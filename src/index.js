
export const BREAK_FIBER_CHAIN = 'BREAK_FIBER_CHAIN'

export function createFiber(...initialFibers) {
  const queues = [[], [], [], []]

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
        result = yield* queues[3][i](exception, ...args, result)
        if (result === BREAK_FIBER_CHAIN) return
      }
    }
  }

  function makePush(type) {
    const queue = queues[type]
    return function push(generator) {
      queue.push(generator)
      return worker
    }
  }

  function merge(...fibers) {
    for (let i = 0; i < fibers.length; i += 1) {
      queues[0].concat(fibers[i]._queues[0])
      queues[1].concat(fibers[i]._queues[1])
      queues[2].concat(fibers[i]._queues[2])
      queues[3].concat(fibers[i]._queues[3])
    }
    return worker
  }

  merge(...initialFibers)

  worker._queues = queues
  worker.before = makePush(0)
  worker.step = makePush(1)
  worker.after = makePush(2)
  worker.catch = makePush(3)
  worker.merge = merge
  return worker
}
