export default function JumpEditorButton() {
    return (
        <div className="flex-center mx-4 px-6 bg-gray-200 bg-opacity-60 rounded-2xl cursor-pointer">
            <span className="gothic font-black opacity-60 py-2" style={{ fontSize: "14px" }}>
                小説を書く
            </span>
            <svg className="w-4 h-4 opacity-50 hover:opacity-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
            </svg>
        </div>
    );
}
