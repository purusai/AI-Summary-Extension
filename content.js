function getArticleText() {
    const article = document.querySelector("article");
    if (article) return article.innerText;

    const paragraphs = Array.from(document.querySelectorAll("p"));
}