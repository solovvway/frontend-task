export default async function PostPage () {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10');
    const posts = await res.json();  

    return (
        <main style={{ padding: '20px'}}>
            <h1>Server Page with posts</h1>
            <ul>
                {posts.map(post => (
                    <li key={post.id} style={{ marginBottom: '10px'}}>
                        <strong>{post.title}</strong>
                        <p>{post.body}</p>
                    </li>
                ))}
            </ul>
        </main>
    );

}