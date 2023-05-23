import articles from '../data/articles.json'

const Main = () => {
  return (
    <div className="main">
      <h1>Main Section</h1>
      {articles.map(item =>
        <section key={item.id}>
          <h2>{item.title}</h2>
          <div>{item.body}</div>
        </section>)}
    </div>
  );
}

export default Main;