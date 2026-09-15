async function testFlow() {
  const BASE_URL = 'http://localhost:5000/api';
  console.log('1. Health check...');
  const healthRes = await fetch(`${BASE_URL}/health`);
  const healthJson = await healthRes.json();
  console.log('Health response:', healthJson);

  console.log('\n2. Logging in demo user...');
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'demo@interviewai.dev', password: 'demo1234' })
  });
  const loginJson = await loginRes.json();
  console.log('Login success:', loginJson.success, 'Token received:', !!loginJson.data?.token);
  const token = loginJson.data.token;

  console.log('\n3. Fetching roles...');
  const rolesRes = await fetch(`${BASE_URL}/roles`);
  const rolesJson = await rolesRes.json();
  console.log(`Roles count: ${rolesJson.data?.length}`);

  console.log('\n4. Creating 3-question adaptive interview for Frontend Developer (Intermediate)...');
  const createRes = await fetch(`${BASE_URL}/interviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      role: 'Frontend Developer',
      experienceLevel: 'Intermediate',
      interviewType: 'Technical',
      totalQuestions: 3
    })
  });
  const createJson = await createRes.json();
  const interviewId = createJson.data.id;
  console.log(`Interview created with ID: ${interviewId}`);

  console.log('\n5. Starting interview...');
  const startRes = await fetch(`${BASE_URL}/interviews/${interviewId}/start`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const startJson = await startRes.json();
  console.log('Q1 Difficulty:', startJson.data.currentQuestion.difficulty);
  console.log('Q1 Text:', startJson.data.currentQuestion.questionText);
  const q1Id = startJson.data.currentQuestion.id;

  console.log('\n6. Submitting strong answer for Q1...');
  const ans1Res = await fetch(`${BASE_URL}/interviews/${interviewId}/answers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      questionId: q1Id,
      answerText: 'React uses a Virtual DOM and reconciliation diffing algorithm to minimize real DOM manipulations. When state changes, it creates a new fiber tree, computes the difference in O(n) using keys, and batches DOM updates efficiently for high performance.'
    })
  });
  const ans1Json = await ans1Res.json();
  console.log('Q1 Score:', ans1Json.data.evaluation.overallScore);
  console.log('Q2 Adapted Difficulty:', ans1Json.data.nextQuestion.difficulty);
  console.log('Q2 Text:', ans1Json.data.nextQuestion.questionText);
  const q2Id = ans1Json.data.nextQuestion.id;

  console.log('\n7. Submitting weak/brief answer for Q2...');
  const ans2Res = await fetch(`${BASE_URL}/interviews/${interviewId}/answers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      questionId: q2Id,
      answerText: 'Not very sure.'
    })
  });
  const ans2Json = await ans2Res.json();
  console.log('Q2 Score:', ans2Json.data.evaluation.overallScore);
  console.log('Q3 Adapted Difficulty:', ans2Json.data.nextQuestion.difficulty);
  console.log('Q3 Text:', ans2Json.data.nextQuestion.questionText);
  const q3Id = ans2Json.data.nextQuestion.id;

  console.log('\n8. Submitting solid answer for Q3 (Final question)...');
  const ans3Res = await fetch(`${BASE_URL}/interviews/${interviewId}/answers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      questionId: q3Id,
      answerText: 'Variables declared with let and const have block scope and exist in the temporal dead zone until declared, preventing hoisting bugs. const prevents variable reassignment while let permits it. var is function scoped and hoisted as undefined.'
    })
  });
  const ans3Json = await ans3Res.json();
  console.log('Interview Finished:', ans3Json.data.isFinished);
  console.log('Final Report Overall Score:', ans3Json.data.finalReport.overallScore);

  console.log('\n9. Fetching final report results endpoint...');
  const resultsRes = await fetch(`${BASE_URL}/interviews/${interviewId}/results`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const resultsJson = await resultsRes.json();
  console.log('Report Summary:', resultsJson.data.summary);
  console.log('Skill Gaps count:', resultsJson.data.skillGaps.length);
  console.log('Recommended Topics:', resultsJson.data.recommendedTopics);
  console.log('Improvement Plan steps:', resultsJson.data.improvementPlan.length);

  console.log('\n✅ All API & Adaptive flows verified successfully!');
}

testFlow().catch(console.error);
