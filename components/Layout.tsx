import JumpEditorButton from "./JumpEditorButton";

export default function Layout({ children }) {
    return (
        <div className="min-h-screen w-full bg-gray-200">
            <nav className="h-16 w-full flex-center editor-bg">
                <div className="container flex-center">
                    <div className="w-11/12 flex flex-wrap items-center justify-between">
                        <h1 className="mincho font-black text-3xl text-gray-600">Clara</h1>
                        <JumpEditorButton />
                    </div>
                </div>
            </nav>
            {children}
        </div>
    );
}
