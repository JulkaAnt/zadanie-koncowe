import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xfuezwjkwtojqxsrccge.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmdWV6d2prd3RvanF4c3JjY2dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NjU1MDQsImV4cCI6MjA2MzI0MTUwNH0.k3dEcZDYEVcQ3K-sSNu9AF9enL69utG14-JfK95FYAw'; 
const supabase = createClient(supabaseUrl, supabaseKey);

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
 
  const email = e.target.email.value;
  const password = e.target.password.value;

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

if (error) {
    alert("Nieprawidłowy login lub hasło.");
    console.error(error);
    return;
  }
   localStorage.setItem("loggedIn", "true");

  window.location.href = "/";
  });
