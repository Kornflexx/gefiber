
# gefiber

Gefiber is an simple helper that allow to pipe and compose Generator.
It is tiny (~0.76kB).

## API

### createFiber ⇒ [<code>Fiber</code>](#Fiber)
**Kind**: default export

| Param | Type | Description |
| --- | --- | --- |
| initialFibers | <code>...Fiber</code> | Fibers to merge with. |
## Typedefs

<a name="ChainingFunction"></a>

### ChainingFunction ⇒ [<code>Fiber</code>](#Fiber)
**Kind**: global typedef
**Returns**: [<code>Fiber</code>](#Fiber) Current Fiber.

| Param | Type | Description |
| --- | --- | --- |
| generator | <code>Generator</code> | Generator to add to the concerned queue. |

<a name="ChainingMergingFunction"></a>

### ChainingMergingFunction ⇒ [<code>Fiber</code>](#Fiber)
**Kind**: global typedef
**Returns**: [<code>Fiber</code>](#Fiber) Current Fiber.

| Param | Type | Description |
| --- | --- | --- |
| generator | <code>...Fibers</code> | Fibbers  to merge with. |

<a name="Fiber"></a>

## Fiber : <code>Generator</code>
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| before | [<code>ChainingFunction</code>](#ChainingFunction) | Add Generator to the before queue. |
| step | [<code>ChainingFunction</code>](#ChainingFunction) | Add Generator to the step queue. |
| after | [<code>ChainingFunction</code>](#ChainingFunction) | Add Generator to the after queue. |
| catch | [<code>ChainingFunction</code>](#ChainingFunction) | Add Generator to the catch queue. |
| merge | [<code>ChainingMergingFunction</code>](#ChainingMergingFunction) | Merge Fibers with the current fiber. |

## Composition example with redux-saga

```js

import { call, put, select } from 'redux-saga/effects'
import { createFiber } from 'gefiber'

...

const loadingFiber = createFiber()
	.before(function* () {
		yield put({ type: 'SET_IS_LOADING', isLoading: true })
	})
	.after(function* () {
		yield put({ type: 'SET_IS_LOADING', isLoading: false })
	})
	.catch(function* () {
		yield put({ type: 'SET_IS_LOADING', isLoading: false })
	})

const toastErrorFiber = createFiber()
	.catch(function* (e) {
		yield put({ type: 'SHOW_TOAST_ERROR', message: e })
	})

const tokenSelectorFiber = createFiber()
	.step(function* () {
		const token = yield select(state => state.token)
		if (!token) throw 'You have to be authenticated to have access to this feature'
		return token
	})

const baseApiFiber = createFiber(
		loadingFiber,
		toastErrorFiber,
	)
	.chain(tokenSelectorFiber)

export const getCatsSaga = createFiber(baseApiFiber)
	.step(function* (action, token) {
		const cats = yield call(catAPI.get, token)
		yield put({ type: 'ADD_CATS', cats })
	})

export const getDogsSaga = createFiber(baseApiFiber)
	.step(function* (action, token) {
		const dogs = yield call(dogAPI.get, token)
		yield put({ type: 'ADD_DOGS', dogs })
	})

```