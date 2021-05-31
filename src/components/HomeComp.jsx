import React, { useState } from 'react';
import FetchJobs from './FetchJobs';
import { Container } from 'react-bootstrap';
import DisplayJob from '../components/DisplayJob';
import JobsPagination from '../components/JobsPagination';
import SearchJob from '../components/SearchJob';

function HomeComp() {
  const [params, setParams] = useState({})
  const [page, setPage] = useState(1)
  const { jobs, loading, error, hasNextPage } = FetchJobs(params, page) // calling useFetchJobs

  function handleParamChange(e) {
    const param = e.target.name
    const value = e.target.value
    setPage(1)
    setParams(prevParams => {
      return { ...prevParams, [param]: value }
    })
  }

  return (
    <>
    <div>
    <Container className="my-4">
      <h1 className="mb-4">Pro Jobs</h1>
      <SearchJob params={params} onParamChange={handleParamChange} />
      <JobsPagination page={page} setPage={setPage} hasNextPage={hasNextPage} />
      {/* // if loading, then h1 will printed */}
      {loading && <h1>Loading...</h1>} 
      {/* // if error, then error will be printed */}
      {error && <h1>Error. Try Refreshing.</h1>} 
      {jobs.map(job => {
        return <DisplayJob key={job.id} job={job} />
      })}
      <JobsPagination page={page} setPage={setPage} hasNextPage={hasNextPage} />
    </Container>
    </div>
    </>
  )
}

export default HomeComp;