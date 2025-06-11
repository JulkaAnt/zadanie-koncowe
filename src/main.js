import { format } from 'date-fns';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xfuezwjkwtojqxsrccge.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmdWV6d2prd3RvanF4c3JjY2dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NjU1MDQsImV4cCI6MjA2MzI0MTUwNH0.k3dEcZDYEVcQ3K-sSNu9AF9enL69utG14-JfK95FYAw'; 
const supabase = createClient(supabaseUrl, supabaseKey);

let currentUser = null;

main();

async function main() {
  const { data: { session } } = await supabase.auth.getSession();
  currentUser = session?.user || null;

  updateLogin(); 
  await loadArticles();
}

function updateLogin() {
  const loginLink = document.querySelector('#app a');
  if (currentUser) {
    loginLink.textContent = 'Logout';
    loginLink.onclick = async (e) => {
      e.preventDefault();
      await supabase.auth.signOut();
      location.reload();
    };
  } else {
    loginLink.textContent = 'Login';
    loginLink.setAttribute('href', '/login/');
  }
}

async function loadArticles() {
  try {
    const { data: articles, error } = await supabase
      .from('article')
      .select('id, title, subtitle, author, created_at, content')
      .order('created_at', { ascending: false });

    if (error) throw error;

    renderArticles(articles);
  } catch (err) {
    console.error(err);
    document.getElementById('articles-container').innerText = "Błąd ładowania artykułów.";
  }
}

function renderArticles(articles) {
  const container = document.getElementById('articles-container');
  container.innerHTML = '';

  articles.forEach(({ id, title, subtitle, author, created_at, content }) => {
    const div = document.createElement('div');
    div.className = 'article-box';

    div.innerHTML = `
      <h2>${title}</h2>
      <h3>${subtitle}</h3>
      <p><strong>Autor:</strong> ${author}</p>
      <p><strong>Data:</strong> ${format(new Date(created_at), 'dd-MM-yyyy')}</p>
      <p>${content}</p>
    `;

    if (currentUser) {
      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edytuj';
      editBtn.onclick = () => editArticle(id);

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Usuń';
      deleteBtn.onclick = () => deleteArticle(id);

      div.appendChild(editBtn);
      div.appendChild(deleteBtn);
    }

    container.appendChild(div);
  });
}

async function deleteArticle(id) {
  const confirmed = confirm("Czy na pewno chcesz usunąć ten artykuł?");
  if (!confirmed) return;

  try {
    const { error } = await supabase
      .from('article')
      .delete()
      .eq('id', id);

    if (error) throw error;

    await loadArticles();
  } catch (err) {
    console.error("Błąd usuwania artykułu:", err.message);
  }
}

function editArticle(id) {
  window.location.href = `/edit.html?id=${id}`;
}

document.getElementById("articleForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const newArticle = {
    title: formData.get("title"),
    subtitle: formData.get("subtitle"),
    author: formData.get("author"),
    content: formData.get("content"),
    created_at: formData.get("created"),
  };

  try {
    const { error } = await supabase
      .from('article')
      .insert([newArticle]);

    if (error) throw error;

    e.target.reset();
    await loadArticles();
  } catch (err) {
    console.error("Błąd dodawania artykułu:", err.message);
  }
});
