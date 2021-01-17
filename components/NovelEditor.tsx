export default function NovelEditor({ title, content }: { title: string; content: string }) {
    return (
        <div>
            <h1>{title}</h1>
            <h2>{content}</h2>
        </div>
    );
}
