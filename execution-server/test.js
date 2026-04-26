const code = `
print("Hello from Python executing on the new Node.js backend!")
for i in range(3):
    print(f"Count: {i}")
`;

fetch('http://localhost:3000/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ language: 'python', code })
})
.then(res => res.json())
.then(data => {
    console.log('API Response:', data);
    process.exit(0);
})
.catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
