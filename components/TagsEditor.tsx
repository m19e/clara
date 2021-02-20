import { useState, createRef } from "react";
import AutosizeInput from "react-input-autosize";
import TagsInput from "react-tagsinput";

const autoSizingRenderInput = ({ addTag, ...props }: TagsInput.RenderInputProps<never>) => {
    let { onChange, value, ...other } = props;
    return (
        <AutosizeInput
            type="text"
            {...other}
            placeholder="タグを追加"
            style={{ fontFamily: "sans-serif" }}
            inputClassName="bg-transparent border-0 text-sm font-normal outline-none focus:outline"
            onChange={onChange}
            value={value}
        />
    );
};

const TagsEditor = ({ tempTags }: { tempTags: string[]; setTempTags: (tags: string[]) => void }) => {
    const [tags, setTags] = useState(tempTags as never[]);
    const [tag, setTag] = useState("");
    const [suggests, setSuggests] = useState([
        "アイドルマスターシャイニーカラーズ",
        "放クラ",
        "小宮果穂",
        "園田智代子",
        "西城樹里",
        "杜野凛世",
        "有栖川夏葉",
        "ノクチル",
        "浅倉透",
        "樋口円香",
        "福丸小糸",
        "市川雛菜",
    ]);
    const [r18, setR18] = useState(false);
    const inputRef = createRef<TagsInput<never>>();
    const reg = /[^_0-9a-zA-Z\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]+/g;

    const handleChange = (tags: never[]) => {
        const valid = tags.map((t: string) => t.replace(reg, "") as never).filter((t: string) => t !== "");
        setTags(valid);
    };

    const handleChangeInput = (t: string) => {
        if (/[\s]/.test(t)) {
            inputRef.current?.accept();
            return;
        }
        if (Array.from(t).length >= 30) {
            setTag(Array.from(t).slice(0, 30).join(""));
            return;
        }
        setTag(t);
    };

    const handleClickSuggest = (suggest: string) => {
        inputRef.current?.addTag(suggest as never);
    };

    return (
        <div className="flex flex-col justify-center items-center w-1/2">
            <div className="w-full flex justify-between text-sm">
                <span className="mx-2" style={{ fontFamily: "sans-serif" }}>
                    タグ
                </span>
                <span className="mx-2">{tags.length}/10</span>
            </div>
            <TagsInput
                ref={inputRef}
                value={tags}
                onChange={handleChange}
                inputValue={tag}
                onChangeInput={handleChangeInput}
                tagProps={{
                    className: "react-tagsinput-tag",
                }}
                renderInput={autoSizingRenderInput}
                onlyUnique={true}
                maxTags={10}
            />
            <div className="w-full mt-2 px-2 py-3 flex flex-col bg-gray-100 rounded" style={{ fontFamily: "sans-serif" }}>
                <span className="text-sm">よく使われているタグ</span>
                <div className="mt-2 flex flex-wrap">
                    {suggests.map((s) => (
                        <span className="mr-2 text-sm text-gray-500 hover:text-blue-400 cursor-pointer" onClick={() => handleClickSuggest(s)}>
                            #{s}
                        </span>
                    ))}
                </div>
            </div>
            <div className="w-full flex mt-4">
                <label className="inline-flex items-center">
                    <input type="radio" className="text-indigo-600" value="zen" checked={!r18} onChange={() => setR18(false)} />
                    <span className="ml-1">全年齢</span>
                </label>
                <label className="inline-flex items-center ml-4">
                    <input type="radio" className="text-indigo-600" value="r18" checked={r18} onChange={() => setR18(true)} />
                    <span className="ml-1">R-18</span>
                </label>
            </div>
        </div>
    );
};

export default TagsEditor;
