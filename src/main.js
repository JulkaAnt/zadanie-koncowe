import { format } from 'date-fns';
main();

async function main() {
const API_URL = 'https://xfuezwjkwtojqxsrccge.supabase.co/rest/v1/article';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmdWV6d2prd3RvanF4c3JjY2dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NjU1MDQsImV4cCI6MjA2MzI0MTUwNH0.k3dEcZDYEVcQ3K-sSNu9AF9enL69utG14-JfK95FYAw';

async function loadArticles() {
  try {
    const res = await fetch(`${API_URL}?select=title,subtitle,author,created_at,content&order=created_at.desc`, {
      headers: {
        apikey: API_KEY,
        Authorization: `Bearer ${API_KEY}`,
      }
    });

    if (!res.ok) throw new Error("Nie udało się pobrać artykułów");

    const articles = await res.json();
    renderArticles(articles);
  } catch (err) {
    console.error(err);
    document.getElementById('articles-container').innerText = "Błąd ładowania artykułów.";
  }
}

function renderArticles(articles) {
  const container = document.getElementById('articles-container');
  container.innerHTML = '';

  articles.forEach(({ title, subtitle, author, created_at, content }) => {
    const div = document.createElement('div');
    div.className = 'article-box';
    div.innerHTML = `
      <h2>${title}</h2>
      <h3>${subtitle}</h3>
      <p><strong>Autor:</strong> ${author}</p>
      <p><strong>Data:</strong> ${format(new Date(created_at), 'dd-MM-yyyy')}</p>
      <p>${content}</p>
    `;
    container.appendChild(div);
  });
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
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        apikey: API_KEY,
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newArticle),
    });

    if (!res.ok) throw new Error("Nie udało się dodać artykułu.");

    e.target.reset();
    loadArticles();

  } catch (err) {
    console.error("Błąd dodawania artykułu:", err);
  }
});

loadArticles();}