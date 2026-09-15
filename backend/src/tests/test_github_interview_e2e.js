async function testGitHubFlow() {
  const BASE_URL = 'http://localhost:5000/api';

  console.log('1. Logging in demo user...');
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'demo@interviewai.dev', password: 'demo1234' })
  });
  const loginJson = await loginRes.json();
  const token = loginJson.data.token;
  console.log('Token acquired:', !!token);

  console.log('\n2. Testing GitHub Repo Analysis endpoint...');
  const analyzeRes = await fetch(`${BASE_URL}/github/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ repoUrl: 'https://github.com/expressjs/express' })
  });
  const analyzeJson = await analyzeRes.json();
  console.log('Analyzed repo:', analyzeJson.data.fullName);
  console.log('Primary Language:', analyzeJson.data.primaryLanguage);
  console.log('Detected Tech:', analyzeJson.data.detectedTech);
  console.log('Key Files count:', analyzeJson.data.keyFiles.length);

  console.log('\n3. Creating GitHub Project Defense interview...');
  const createRes = await fetch(`${BASE_URL}/interviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      repoUrl: 'https://github.com/expressjs/express',
      experienceLevel: 'Advanced',
      totalQuestions: 2
    })
  });
  const createJson = await createRes.json();
  const interviewId = createJson.data.id;
  console.log(`Created Project Defense Interview: ${interviewId}, Type: ${createJson.data.interviewType}`);

  console.log('\n4. Starting interview & generating Q1 (anchored on repo)...');
  const startRes = await fetch(`${BASE_URL}/interviews/${interviewId}/start`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const startJson = await startRes.json();
  console.log('Q1 Category:', startJson.data.currentQuestion.category);
  console.log('Q1 Text:', startJson.data.currentQuestion.questionText);
  const q1Id = startJson.data.currentQuestion.id;

  console.log('\n5. Submitting answer for Q1...');
  const ans1Res = await fetch(`${BASE_URL}/interviews/${interviewId}/answers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      questionId: q1Id,
      answerText: 'In Express, the architecture uses a layer-based router pipeline where middleware functions execute sequentially. Data and state flow via the req and res objects. When an error is passed to next(err), Express skips standard route handlers and forwards directly to 4-parameter error-handling middleware.'
    })
  });
  const ans1Json = await ans1Res.json();
  console.log('Q1 Score:', ans1Json.data.evaluation.overallScore);
  console.log('Q2 Text:', ans1Json.data.nextQuestion.questionText);
  const q2Id = ans1Json.data.nextQuestion.id;

  console.log('\n6. Submitting answer for Q2 (Final question)...');
  const ans2Res = await fetch(`${BASE_URL}/interviews/${interviewId}/answers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      questionId: q2Id,
      answerText: 'To scale to 100k concurrent requests, the single biggest bottleneck is Node single-threaded event loop blocking and database connection exhaustion. We optimize with Redis caching layers, clustering via PM2 or Kubernetes worker pods, connection pooling, and CDN caching for static routes.'
    })
  });
  const ans2Json = await ans2Res.json();
  console.log('Interview Finished:', ans2Json.data.isFinished);
  console.log('Final Score:', ans2Json.data.finalReport.overallScore);

  console.log('\n✅ GitHub Repository Project Defense Flow Verified Successfully!');
}

testGitHubFlow().catch(console.error);
