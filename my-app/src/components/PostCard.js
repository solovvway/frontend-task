export default function PostCard({ title, body}){
    return(
        <article style={{
            border: '1px solid #ddd',
            borderRadius: '10px',
            padding: '10px',
            marginBottom: '10px'
            }}>
            <h3>{title}</h3>
            <p>{body}</p>
        </article>
    );
}