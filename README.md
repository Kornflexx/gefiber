
# gefiber



Gefiber is an simple helper that allow to pipe and compose generator.


## createFiber

|arguments|return|description|
|--|--|--|
|initialFibers:[Fiber:Generator] *|self:[Fiber:Generator]|fibers to herit

\* optionnal

## Fiber

|method|arguments|return|description|
|--|--|--|--|
|before|generator:[Generator]|self:[Fiber:Generator]|add generator to first called queue
|step|generator:[Generator]|self:[Fiber:Generator]|add generator to second called queue
|after|generator:[Generator]|self:[Fiber:Generator]|add generator to third  called queue
|catch|catchGenerator:[Generator]|self:[Fiber:Generator]|add generator to a queue entirely called when an exception is thrown into previous queues


generator : `function* (...args, result)`

catchGenerator : `function* (exception, ...args, result)`

`result` is the returned value from the previous executed generator.

## Composition Example with redux-saga

```js

import { call, put, select } from 'redux-saga/effects'
import createFiber from 'gefiber'

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

const authFiber = createFiber()
	.step(function* () {
		const token = yield select(state => state.token)
		if (!token) throw 'You have to be authenticated to have access to this feature'
		return token
	})

const getCatsSaga = createFiber(
		loadingFiber,
		toastErrorFiber,
		authFiber
	)
	.step(function* (action, token) {
		const cats = yield call(catAPI.get, token)
		yield put({ type: 'ADD_CATS', cats })
	})

 const getDogsSaga = createFiber(
		loadingFiber,
		toastErrorFiber,
		authFiber
	)
	.step(function* (action, token) {
		const dogs = yield call(dogAPI.get, token)
		yield put({ type: 'ADD_DOGS', dogs })
	})

```



Here, `getCatsSaga` is equivalent to

```jsx

createFiber()
	.before(function* () {
		yield put({ type: 'SET_IS_LOADING', isLoading: true })
	})
	.step(function* () {
		const token = yield select(state => state.token)
		if (!token) throw 'You have to be authenticated to have access to this feature'
		return token
	})
	.step(function* (action, token) {
		const cats = yield call(catAPI.get, token)
		yield put({ type: 'ADD_CATS', cats })
	})
	.after(function* () {
		yield put({ type: 'SET_IS_LOADING', isLoading: false })
	})
	.catch(function* () {
		yield put({ type: 'SET_IS_LOADING', isLoading: false })
	})
	.catch(function* (e) {
		yield put({ type: 'SHOW_TOAST_ERROR', message: e })
	})

```
