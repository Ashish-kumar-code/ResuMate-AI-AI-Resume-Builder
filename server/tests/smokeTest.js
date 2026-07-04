// Smoke test for ResuMate AI backend
// Runs: register -> get user -> create resume -> update resume -> ATS score -> delete resume

const BASE = process.env.BASE_URL || 'http://localhost:3000'

const fetchJson = async (url, opts = {}) => {
  const res = await fetch(url, opts)
  const text = await res.text()
  try { return { ok: res.ok, status: res.status, body: JSON.parse(text) } } catch(e){ return { ok: res.ok, status: res.status, body: text } }
}

const run = async () => {
  console.log('Smoke test started against', BASE)
  const email = `smoke+${Date.now()}@example.com`
  const password = 'Test1234'

  console.log('1) Register user')
  let r = await fetchJson(`${BASE}/api/users/register`, {
    method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name: 'Smoke Tester', email, password})
  })
  console.log(' register ->', r.status, r.body)
  if(!r.ok) return process.exitCode = 2
  const token = r.body.token

  console.log('2) Get user data')
  r = await fetchJson(`${BASE}/api/users/data`, {headers: {Authorization: token}})
  console.log(' user data ->', r.status, r.body)
  if(!r.ok) return process.exitCode = 3

  console.log('3) Create resume')
  r = await fetchJson(`${BASE}/api/resumes/create`, {method:'POST', headers:{'Content-Type':'application/json', Authorization: token}, body: JSON.stringify({title: 'Smoke Resume'})})
  console.log(' create ->', r.status, r.body)
  if(!r.ok) return process.exitCode = 4
  const resumeId = r.body.resume._id || r.body.resumeId || (r.body.resume && r.body.resume._id)
  if(!resumeId) { console.error('Could not determine resumeId'); return process.exitCode = 5 }

  console.log('4) Update resume (save data)')
  const resumeData = {
    professional_summary: 'Experienced smoke tester',
    skills: ['testing','nodejs'],
    personal_info: { full_name: 'Smoke Tester' },
    experience: [], project: [], education: []
  }

  r = await fetchJson(`${BASE}/api/resumes/update`, {method:'PUT', headers:{'Content-Type':'application/json', Authorization: token}, body: JSON.stringify({resumeId, resumeData: JSON.stringify(resumeData)})})
  console.log(' update ->', r.status, r.body)
  if(!r.ok) return process.exitCode = 6

  console.log('5) ATS score')
  r = await fetchJson(`${BASE}/api/ai/ats-score`, {method:'POST', headers:{'Content-Type':'application/json', Authorization: token}, body: JSON.stringify({resumeId, jobDescription: 'javascript node react developer'})})
  console.log(' ats ->', r.status, r.body)

  console.log('6) Delete resume')
  r = await fetchJson(`${BASE}/api/resumes/delete/${resumeId}`, {method:'DELETE', headers:{Authorization: token}})
  console.log(' delete ->', r.status, r.body)

  console.log('Smoke test completed')
}

run().catch(err=>{ console.error('Smoke test error', err); process.exit(1) })
