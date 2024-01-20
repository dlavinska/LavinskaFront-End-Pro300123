import articles from '../data/articles.json'

const Main = () => {
  return (
    <div className="my-10 text-center sm:my-16 px-4">
      <h1>Main Section</h1>
      {articles.map((item) => (
        <section key={item.id}>
          <h2 className='className="text-xl font-semibold mb-8 md:text-3xl'>
            {item.title}
          </h2>
          <div className="text-yellow-500">{item.body}</div>
        </section>
      ))}
    </div>
  );
}

export default Main;