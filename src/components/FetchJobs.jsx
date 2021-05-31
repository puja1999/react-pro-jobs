import { useReducer, useEffect } from 'react';
import axios from 'axios';

const ACTIONS = { // inorder to define all of our actions, we are defining const variable called ACTIONS, which is gonna set to an object, which defines our actions, so that  we can reference them later 
  MAKE_REQUEST: 'make-request', // inside of useFetchJobs, we have these things, we can do, like making request, 
  GET_DATA: 'get-data', // after finishing request, getting data from that request,
  ERROR: 'error', // for error, 
  UPDATE_HAS_NEXT_PAGE: 'update-has-next-page'
}

const BASE_URL = 'https://cors-anywhere.herokuapp.com/https://jobs.github.com/positions.json' // jobs API

function reducer(state, action) { //dispatch whatever we passed to, will populated in action variable, and state is the current state of application
  switch (action.type) {
    case ACTIONS.MAKE_REQUEST:
      return { loading: true, jobs: [] } // if loading to true, then jobs gonna be set to empty array
    case ACTIONS.GET_DATA:
      return { ...state, loading: false, jobs: action.payload.jobs } // we are gonna pass the jobs, on the payload of actions
    case ACTIONS.ERROR:
      return { ...state, loading: false, error: action.payload.error, jobs: [] } // passing error object, and clear out jobs if we have in here
    case ACTIONS.UPDATE_HAS_NEXT_PAGE:
      return { ...state, hasNextPage: action.payload.hasNextPage }
    default:
      return state // returing current state
  }
}

export default function FetchJobs(params, page) { // we are using useReducer, to handle all the diff state inside of useFetchJobs
  const [state, dispatch] = useReducer(reducer, { jobs: [], loading: true }) // taking reducer function, which is defined above, gets called everytime we call dispatch, 

  useEffect(() => { // using useEffect to run code again, anytime we change the page,or params
    const cancelToken1 = axios.CancelToken.source()
    dispatch({ type: ACTIONS.MAKE_REQUEST })
    axios.get(BASE_URL, {
      cancelToken: cancelToken1.token,
      params: { markdown: true, page: page, ...params }
    }).then(res => {
      dispatch({ type: ACTIONS.GET_DATA, payload: { jobs: res.data } })  // listing jobs
    }).catch(e => {
      if (axios.isCancel(e)) return
      dispatch({ type: ACTIONS.ERROR, payload: { error: e } }) 
    })

    const cancelToken2 = axios.CancelToken.source()
    axios.get(BASE_URL, {
      cancelToken: cancelToken2.token,
      params: { markdown: true, page: page + 1, ...params }
    }).then(res => {
      dispatch({ type: ACTIONS.UPDATE_HAS_NEXT_PAGE, payload: { hasNextPage: res.data.length !== 0 } }) 
    }).catch(e => {
      if (axios.isCancel(e)) return
      dispatch({ type: ACTIONS.ERROR, payload: { error: e } }) 
    })

    return () => {
      cancelToken1.cancel()
      cancelToken2.cancel()
    }
  }, [params, page]) // whenever the params or page change, we want to re-run the use Effect hook
  
  return state
}