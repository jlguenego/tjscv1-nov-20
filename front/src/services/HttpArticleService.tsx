import { Article } from "../interfaces/Article";
import { ArticleService } from "./ArticleService";

export class HttpArticleService extends ArticleService {
  constructor() {
    super();
    console.log("http article instianted");
    this.refresh();
  }

  async refresh() {
    try {
      console.log("start refresh");
      const response = await fetch("http://localhost:3500/ws/articles");
      const json = await response.json();
      this.articles = json as Article[];
      this.save();
    } catch (error) {
      console.log("error: ", error);
      this.articles = [];
      this.save();
    }
  }

  addArticle(article: Article) {
    (async () => {
      try {
        await fetch("http://localhost:3500/ws/articles", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(article),
        });
        await this.refresh();
      } catch (error) {
        console.log("error: ", error);
      }
    })();
  }

  remove(selectedArticles: Article[]) {
    super.remove(selectedArticles);
    const ids = selectedArticles.map((a) => a.id);
    (async () => {
      try {
        await fetch("http://localhost:3500/ws/articles", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ids),
        });
        await this.refresh();
      } catch (error) {
        console.log("error: ", error);
      }
    })();
  }
}
