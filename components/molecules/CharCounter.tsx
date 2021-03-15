import { EditorState } from "draft-js";
import { getTextCharCount } from "lib/novel/tools";

type CharCounterProps = {
    editorState: EditorState;
};

const CharCounter = ({ editorState }: CharCounterProps) => {
    const count = getEditorStateCharCount(editorState);
    return <span className="mincho opacity-50">{count}字</span>;
};

const getEditorStateCharCount = (es: EditorState) => {
    const text = es.getCurrentContent().getPlainText("");
    const count = getTextCharCount(text);
    return count;
};

export default CharCounter;
