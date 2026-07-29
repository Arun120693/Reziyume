const email = "test" + Date.now() + "@example.com";
const password = "password123";

async function run() {
  console.log("Registering user...");
  const regRes = await fetch("http://localhost:3000/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const regData = await regRes.json();
  console.log("Reg Status:", regRes.status, regData);

  console.log("Logging in via credentials...");
  // NextAuth credentials login
  const loginRes = await fetch("http://localhost:3000/api/auth/callback/credentials", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ email, password, redirect: "false" })
  });
  
  const cookies = loginRes.headers.get("set-cookie");
  console.log("Login Status:", loginRes.status);
  console.log("Cookies:", cookies);
  
  const sessionCookie = cookies.split(", ").find(c => c.includes("next-auth.session-token"));
  const cookieHeader = sessionCookie ? sessionCookie.split(";")[0] : "";
  
  console.log("Creating resume...");
  const res = await fetch("http://localhost:3000/api/resumes", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Cookie": cookieHeader
    },
    body: JSON.stringify({ templateId: "onyx" })
  });
  
  const text = await res.text();
  console.log("Resume Status:", res.status);
  console.log("Resume Body:", text);
}

run();
